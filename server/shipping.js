import crypto from "crypto";
import Stripe from "stripe";
import { pool } from "./db.js";
import {
  ORDER_OFFSET,
  moncashConfigured,
  moncashMode,
  moncashOffer,
  createMoncashPayment,
  retrieveMoncashPayment,
  getUsdToHtg,
  setUsdToHtg,
} from "./moncash.js";
import {
  paypalConfigured,
  paypalMode,
  createPaypalOrder,
  capturePaypalOrder,
} from "./paypal.js";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

// Order matters: this is the journey of a shipment once it is approved.
export const STATUS_FLOW = [
  "approved",
  "cargo_received",
  "loaded",
  "departed",
  "in_transit",
  "arrived_haiti",
  "customs",
  "out_for_delivery",
  "delivered",
];

const CONTAINER_SIZES = ["20ft", "40ft", "40ft_hc", "partial", "not_sure"];
const CARGO_TYPES = [
  "household",
  "food",
  "building",
  "electronics",
  "vehicle",
  "commercial",
  "clothing",
  "other",
];
const LANGS = ["ht", "fr"];
const TRACKING_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O/1/I/L

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

const buckets = new Map();
// Tiny in-memory rate limiter for the public endpoints (per IP + route key).
export function rateLimit(key, max, windowMs) {
  return (req, res, next) => {
    const id = `${key}:${req.ip}`;
    const now = Date.now();
    const hits = (buckets.get(id) || []).filter((t) => now - t < windowMs);
    if (hits.length >= max) {
      return res.status(429).json({ error: "too_many_requests" });
    }
    hits.push(now);
    buckets.set(id, hits);
    next();
  };
}

const str = (v, max) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";
const optNum = (v) => {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
};
const optDate = (v) => {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
};

// pg returns DATE columns as local-midnight Date objects; send plain YYYY-MM-DD.
const dateOnly = (v) => {
  if (!(v instanceof Date)) return v || null;
  const p = (n) => String(n).padStart(2, "0");
  return `${v.getFullYear()}-${p(v.getMonth() + 1)}-${p(v.getDate())}`;
};
const fixDates = (row) => ({
  ...row,
  estimated_delivery: dateOnly(row.estimated_delivery),
  preferred_ship_date: dateOnly(row.preferred_ship_date),
});

function generateTrackingNumber() {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += TRACKING_ALPHABET[crypto.randomInt(TRACKING_ALPHABET.length)];
  }
  return `PPS-${code}`;
}

const normalizeTracking = (v) =>
  String(v || "").trim().toUpperCase().replace(/\s+/g, "");

const daysBetween = (from, to) =>
  from ? Math.max(0, Math.floor((to - new Date(from)) / 86400000)) : null;

async function paidTotal(shipmentId) {
  const r = await pool.query(
    "SELECT COALESCE(SUM(amount),0) AS total FROM shipment_payments WHERE shipment_id = $1",
    [shipmentId]
  );
  return Number(r.rows[0].total);
}

async function refreshPaymentStatus(shipmentId) {
  const total = await paidTotal(shipmentId);
  const s = (
    await pool.query("SELECT quote_amount FROM shipments WHERE id = $1", [shipmentId])
  ).rows[0];
  const quote = s?.quote_amount === null ? null : Number(s?.quote_amount);
  let status = "unpaid";
  if (total > 0) status = quote !== null && total >= quote ? "paid" : "partial";
  await pool.query(
    `UPDATE shipments SET amount_paid = $2, payment_status = $3::varchar,
       paid_at = CASE WHEN $3::varchar = 'paid' THEN COALESCE(paid_at, NOW()) ELSE NULL END,
       cash_pending = CASE WHEN $3::varchar = 'paid' THEN FALSE ELSE cash_pending END,
       updated_at = NOW() WHERE id = $1`,
    [shipmentId, total, status]
  );
}

async function recordPayment({ shipmentId, amount, method, reference, note }) {
  await pool.query(
    `INSERT INTO shipment_payments (shipment_id, amount, method, reference, note)
     VALUES ($1,$2,$3,$4,$5) ON CONFLICT (reference) DO NOTHING`,
    [shipmentId, amount, method, reference || null, note || null]
  );
  await refreshPaymentStatus(shipmentId);
}

// ----- Which payment methods are switched on (admin can disable any of them) -----
const METHOD_KEYS = ["card", "paypal", "moncash", "cash"];

export async function getEnabledMethods() {
  const r = await pool.query("SELECT value FROM app_settings WHERE key = 'pay_methods'");
  let saved = {};
  try { saved = JSON.parse(r.rows[0]?.value || "{}"); } catch { /* defaults */ }
  return Object.fromEntries(METHOD_KEYS.map((k) => [k, saved[k] !== false]));
}

// ---------------------------------------------------------------------------
// Database
// ---------------------------------------------------------------------------

export async function ensureShippingTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS shipments (
      id SERIAL PRIMARY KEY,
      tracking_number VARCHAR(20) UNIQUE NOT NULL,
      status VARCHAR(30) NOT NULL DEFAULT 'submitted',
      language VARCHAR(2) DEFAULT 'ht',
      sender_name VARCHAR(120) NOT NULL,
      sender_phone VARCHAR(40) NOT NULL,
      sender_email VARCHAR(160),
      origin_city VARCHAR(120) NOT NULL,
      origin_state VARCHAR(40),
      pickup_needed BOOLEAN DEFAULT FALSE,
      origin_address TEXT,
      destination_city VARCHAR(120) NOT NULL,
      home_delivery BOOLEAN DEFAULT FALSE,
      destination_address TEXT,
      recipient_name VARCHAR(120) NOT NULL,
      recipient_phone VARCHAR(40) NOT NULL,
      container_size VARCHAR(20) NOT NULL,
      container_qty INTEGER DEFAULT 1,
      cargo_type VARCHAR(30) NOT NULL,
      cargo_description TEXT NOT NULL,
      est_weight_lbs INTEGER,
      declared_value_usd NUMERIC(12,2),
      preferred_ship_date DATE,
      notes TEXT,
      quote_amount NUMERIC(12,2),
      amount_paid NUMERIC(12,2) DEFAULT 0,
      payment_status VARCHAR(20) DEFAULT 'unpaid',
      paid_at TIMESTAMPTZ,
      estimated_delivery DATE,
      public_note TEXT,
      admin_notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      approved_at TIMESTAMPTZ,
      departed_at TIMESTAMPTZ,
      delivered_at TIMESTAMPTZ,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`);
  // Cash: acceptance stays pending until the admin confirms the cash was received
  await pool.query("ALTER TABLE shipments ADD COLUMN IF NOT EXISTS cash_pending BOOLEAN DEFAULT FALSE");
  await pool.query("ALTER TABLE shipments ADD COLUMN IF NOT EXISTS cash_requested_at TIMESTAMPTZ");
  await pool.query(`
    CREATE TABLE IF NOT EXISTS shipment_events (
      id SERIAL PRIMARY KEY,
      shipment_id INTEGER NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
      status VARCHAR(30) NOT NULL,
      location VARCHAR(160),
      note TEXT,
      occurred_at TIMESTAMPTZ DEFAULT NOW(),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS shipment_payments (
      id SERIAL PRIMARY KEY,
      shipment_id INTEGER NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
      amount NUMERIC(12,2) NOT NULL,
      method VARCHAR(30) NOT NULL,
      reference VARCHAR(200) UNIQUE,
      note TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS callback_requests (
      id SERIAL PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      phone VARCHAR(40) NOT NULL,
      email VARCHAR(160),
      preferred_time VARCHAR(20) DEFAULT 'anytime',
      topic VARCHAR(30) DEFAULT 'quote',
      language VARCHAR(2) DEFAULT 'ht',
      message TEXT,
      status VARCHAR(20) DEFAULT 'new',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`);
}

// ---------------------------------------------------------------------------
// Stripe payment recording (shared by the return-URL confirm and the webhook)
// ---------------------------------------------------------------------------

async function recordStripeSession(session) {
  if (!session || session.payment_status !== "paid") return false;
  const tracking = normalizeTracking(session.metadata?.tracking_number);
  const s = (
    await pool.query("SELECT id FROM shipments WHERE tracking_number = $1", [tracking])
  ).rows[0];
  if (!s) return false;
  await pool.query(
    `INSERT INTO shipment_payments (shipment_id, amount, method, reference, note)
     VALUES ($1, $2, 'card', $3, 'Stripe Checkout')
     ON CONFLICT (reference) DO NOTHING`,
    [s.id, (session.amount_total || 0) / 100, session.id]
  );
  await refreshPaymentStatus(s.id);
  return true;
}

// Must be registered BEFORE express.json(): Stripe signatures need the raw body.
export function registerStripeWebhook(app, express) {
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
        return res.status(503).json({ error: "webhook_not_configured" });
      }
      let event;
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          req.headers["stripe-signature"],
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch {
        return res.status(400).send("Invalid signature");
      }
      try {
        if (
          event.type === "checkout.session.completed" ||
          event.type === "checkout.session.async_payment_succeeded"
        ) {
          await recordStripeSession(event.data.object);
        }
        res.json({ received: true });
      } catch (err) {
        console.error("Stripe webhook error:", err);
        res.status(500).json({ error: "server_error" });
      }
    }
  );
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

function publicShipment(s, events, paid, moncash = { available: false, rate: null, amountHtg: null }, enabled = { card: true, paypal: true, moncash: true, cash: true }) {
  const approved = s.status !== "submitted" && s.status !== "rejected";
  const now = new Date();
  const quote = s.quote_amount === null ? null : Number(s.quote_amount);
  const balance = quote === null ? null : Math.max(0, +(quote - paid).toFixed(2));
  const end = s.delivered_at ? new Date(s.delivered_at) : now;
  const methods = {
    card: Boolean(stripe) && enabled.card,
    paypal: paypalConfigured() && enabled.paypal,
    moncash: moncash.available && enabled.moncash,
    cash: enabled.cash,
  };

  return {
    trackingNumber: s.tracking_number,
    status: s.status,
    approved,
    senderFirstName: (s.sender_name || "").split(" ")[0],
    route: {
      originCity: s.origin_city,
      originState: s.origin_state,
      destinationCity: s.destination_city,
    },
    containerSize: s.container_size,
    containerQty: s.container_qty,
    cargoType: s.cargo_type,
    submittedAt: s.created_at,
    approvedAt: s.approved_at,
    departedAt: s.departed_at,
    deliveredAt: s.delivered_at,
    estimatedDelivery: dateOnly(s.estimated_delivery),
    daysSinceApproved: approved ? daysBetween(s.approved_at, end) : null,
    daysInTransit: s.departed_at ? daysBetween(s.departed_at, end) : null,
    daysToDelivery:
      s.estimated_delivery && !s.delivered_at
        ? Math.ceil((new Date(s.estimated_delivery) - now) / 86400000)
        : null,
    publicNote: s.public_note || null,
    events: events.map((e) => ({
      status: e.status,
      location: e.location,
      note: e.note,
      occurredAt: e.occurred_at,
    })),
    payment: {
      quoteAmount: quote,
      amountPaid: paid,
      balance,
      status: s.payment_status,
      canPay: approved && quote !== null && quote > 0 && balance > 0 && Object.values(methods).some(Boolean),
      onlinePaymentAvailable: Boolean(methods.card || methods.paypal || methods.moncash),
      cashPending: Boolean(s.cash_pending),
      methods: {
        card: methods.card,
        paypal: methods.paypal,
        moncash: methods.moncash ? { rate: moncash.rate, amountHtg: moncash.amountHtg } : null,
        cash: methods.cash,
      },
    },
  };
}

async function loadPublicShipment(trackingNumber) {
  const s = (
    await pool.query("SELECT * FROM shipments WHERE tracking_number = $1", [
      normalizeTracking(trackingNumber),
    ])
  ).rows[0];
  if (!s) return null;
  const approved = s.status !== "submitted" && s.status !== "rejected";
  // Before approval the customer only sees that the request was received.
  const events = (
    await pool.query(
      `SELECT * FROM shipment_events WHERE shipment_id = $1
       ${approved ? "" : "AND status IN ('submitted','rejected')"}
       ORDER BY occurred_at ASC, id ASC`,
      [s.id]
    )
  ).rows;
  const paid = await paidTotal(s.id);
  const quote = s.quote_amount === null ? null : Number(s.quote_amount);
  const balance = quote === null ? 0 : Math.max(0, +(quote - paid).toFixed(2));
  return { s, events, paid, moncash: await moncashOffer(balance), enabled: await getEnabledMethods() };
}

export function registerShippingRoutes(app, { authenticateAdmin, allowedOrigin }) {
  // ----- Public: create a shipment request -----
  app.post("/api/shipments", rateLimit("ship-create", 8, 10 * 60 * 1000), async (req, res) => {
    try {
      const b = req.body || {};
      const d = {
        language: LANGS.includes(b.language) ? b.language : "ht",
        sender_name: str(b.senderName, 120),
        sender_phone: str(b.senderPhone, 40),
        sender_email: str(b.senderEmail, 160) || null,
        origin_city: str(b.originCity, 120),
        origin_state: str(b.originState, 40) || null,
        pickup_needed: Boolean(b.pickupNeeded),
        origin_address: str(b.originAddress, 300) || null,
        destination_city: str(b.destinationCity, 120),
        home_delivery: Boolean(b.homeDelivery),
        destination_address: str(b.destinationAddress, 300) || null,
        recipient_name: str(b.recipientName, 120),
        recipient_phone: str(b.recipientPhone, 40),
        container_size: str(b.containerSize, 20),
        container_qty: Math.min(20, Math.max(1, parseInt(b.containerQty, 10) || 1)),
        cargo_type: str(b.cargoType, 30),
        cargo_description: str(b.cargoDescription, 2000),
        est_weight_lbs: optNum(b.estWeightLbs),
        declared_value_usd: optNum(b.declaredValueUsd),
        preferred_ship_date: optDate(b.preferredShipDate),
        notes: str(b.notes, 2000) || null,
      };

      const required = [
        "sender_name", "sender_phone", "origin_city", "destination_city",
        "recipient_name", "recipient_phone", "cargo_description",
      ];
      const missing = required.filter((k) => !d[k]);
      if (missing.length) return res.status(400).json({ error: "missing_fields", fields: missing });
      if (!CONTAINER_SIZES.includes(d.container_size) || !CARGO_TYPES.includes(d.cargo_type)) {
        return res.status(400).json({ error: "invalid_option" });
      }
      if (d.sender_email && !/^\S+@\S+\.\S+$/.test(d.sender_email)) {
        return res.status(400).json({ error: "invalid_email" });
      }
      if (d.pickup_needed && !d.origin_address) {
        return res.status(400).json({ error: "missing_fields", fields: ["origin_address"] });
      }
      if (d.home_delivery && !d.destination_address) {
        return res.status(400).json({ error: "missing_fields", fields: ["destination_address"] });
      }

      const cols = Object.keys(d);
      let created = null;
      for (let attempt = 0; attempt < 5 && !created; attempt++) {
        const tracking = generateTrackingNumber();
        try {
          const r = await pool.query(
            `INSERT INTO shipments (tracking_number, ${cols.join(", ")})
             VALUES ($1, ${cols.map((_, i) => `$${i + 2}`).join(", ")}) RETURNING id, tracking_number`,
            [tracking, ...cols.map((c) => d[c])]
          );
          created = r.rows[0];
        } catch (err) {
          if (err.code !== "23505") throw err; // retry only on tracking collision
        }
      }
      if (!created) return res.status(500).json({ error: "server_error" });

      await pool.query(
        "INSERT INTO shipment_events (shipment_id, status) VALUES ($1, 'submitted')",
        [created.id]
      );
      res.status(201).json({ success: true, trackingNumber: created.tracking_number });
    } catch (err) {
      console.error("Create shipment error:", err);
      res.status(500).json({ error: "server_error" });
    }
  });

  // ----- Public: track by number -----
  app.get("/api/shipments/track/:number", rateLimit("ship-track", 60, 60 * 1000), async (req, res) => {
    try {
      const found = await loadPublicShipment(req.params.number);
      if (!found) return res.status(404).json({ error: "not_found" });
      res.json(publicShipment(found.s, found.events, found.paid, found.moncash, found.enabled));
    } catch (err) {
      console.error("Track error:", err);
      res.status(500).json({ error: "server_error" });
    }
  });

  // ----- Public: start an online payment (Stripe Checkout) -----
  app.post("/api/shipments/track/:number/pay", rateLimit("ship-pay", 10, 10 * 60 * 1000), async (req, res) => {
    try {
      if (!stripe) return res.status(503).json({ error: "payments_not_configured" });
      const found = await loadPublicShipment(req.params.number);
      if (!found) return res.status(404).json({ error: "not_found" });
      const pub = publicShipment(found.s, found.events, found.paid, found.moncash, found.enabled);
      if (!pub.payment.canPay || !pub.payment.methods.card) return res.status(400).json({ error: "nothing_to_pay" });

      const origin = allowedOrigin(req.body?.returnOrigin);
      if (!origin) return res.status(400).json({ error: "invalid_return_origin" });
      const base = `${origin}/shipping/track/${pub.trackingNumber}`;

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        locale: found.s.language === "fr" ? "fr" : "auto",
        client_reference_id: pub.trackingNumber,
        metadata: { tracking_number: pub.trackingNumber },
        customer_email: found.s.sender_email || undefined,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: Math.round(pub.payment.balance * 100),
              product_data: {
                name: `Pi Pwòp Shipping — ${pub.trackingNumber}`,
                description: `${found.s.origin_city} → ${found.s.destination_city}`,
              },
            },
          },
        ],
        success_url: `${base}?paid=1&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}?canceled=1`,
      });
      res.json({ url: session.url });
    } catch (err) {
      console.error("Pay error:", err);
      res.status(500).json({ error: "server_error" });
    }
  });

  // ----- Public: confirm a payment after Stripe redirects back -----
  app.post("/api/shipments/track/:number/pay/confirm", rateLimit("ship-confirm", 20, 10 * 60 * 1000), async (req, res) => {
    try {
      if (!stripe) return res.status(503).json({ error: "payments_not_configured" });
      const sessionId = str(req.body?.sessionId, 200);
      if (!sessionId) return res.status(400).json({ error: "missing_session" });
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      // The session must belong to THIS tracking number.
      if (normalizeTracking(session.metadata?.tracking_number) !== normalizeTracking(req.params.number)) {
        return res.status(400).json({ error: "session_mismatch" });
      }
      const ok = await recordStripeSession(session);
      res.json({ success: ok });
    } catch (err) {
      console.error("Confirm payment error:", err);
      res.status(500).json({ error: "server_error" });
    }
  });

  // ----- Public: start a MonCash payment -----
  app.post("/api/shipments/track/:number/pay/moncash", rateLimit("ship-moncash", 10, 10 * 60 * 1000), async (req, res) => {
    try {
      if (!moncashConfigured()) return res.status(503).json({ error: "payments_not_configured" });
      const found = await loadPublicShipment(req.params.number);
      if (!found) return res.status(404).json({ error: "not_found" });
      const pub = publicShipment(found.s, found.events, found.paid, found.moncash, found.enabled);
      if (!pub.payment.canPay || !pub.payment.methods.moncash) {
        return res.status(400).json({ error: "nothing_to_pay" });
      }
      const { rate, amountHtg } = pub.payment.methods.moncash;
      const order = (
        await pool.query(
          "INSERT INTO moncash_orders (shipment_id, amount_usd, amount_htg, rate) VALUES ($1,$2,$3,$4) RETURNING id",
          [found.s.id, pub.payment.balance, amountHtg, rate]
        )
      ).rows[0];
      const orderId = ORDER_OFFSET + order.id;
      try {
        const url = await createMoncashPayment(amountHtg, orderId);
        res.json({ url, orderId, trackingNumber: pub.trackingNumber });
      } catch (err) {
        await pool.query("UPDATE moncash_orders SET status = 'failed' WHERE id = $1", [order.id]);
        console.error("MonCash create payment failed:", err.message);
        res.status(502).json({ error: "moncash_unavailable" });
      }
    } catch (err) {
      console.error("MonCash pay error:", err);
      res.status(500).json({ error: "server_error" });
    }
  });

  // ----- Public: MonCash return page calls this. The payment is always re-verified
  // with MonCash server-side, so nothing the browser sends can fake a payment. -----
  app.post("/api/moncash/confirm", rateLimit("moncash-confirm", 30, 10 * 60 * 1000), async (req, res) => {
    try {
      if (!moncashConfigured()) return res.status(503).json({ error: "payments_not_configured" });
      const transactionId = str(String(req.body?.transactionId ?? ""), 60);
      const orderId = str(String(req.body?.orderId ?? ""), 20);
      if (!transactionId && !orderId) return res.status(400).json({ error: "missing_reference" });

      const payment = await retrieveMoncashPayment({ transactionId, orderId });
      if (!payment || String(payment.message).toLowerCase() !== "successful") {
        return res.json({ success: false, reason: "not_completed" });
      }
      const orderRowId = Number(payment.reference) - ORDER_OFFSET;
      const order = Number.isInteger(orderRowId)
        ? (await pool.query("SELECT * FROM moncash_orders WHERE id = $1", [orderRowId])).rows[0]
        : null;
      if (!order) return res.json({ success: false, reason: "unknown_order" });
      if (Number(payment.cost) < order.amount_htg) {
        return res.json({ success: false, reason: "amount_mismatch" });
      }

      await pool.query(
        `INSERT INTO shipment_payments (shipment_id, amount, method, reference, note)
         VALUES ($1, $2, 'moncash', $3, $4) ON CONFLICT (reference) DO NOTHING`,
        [order.shipment_id, order.amount_usd, `moncash:${payment.transaction_id}`, `${payment.cost} HTG @ ${order.rate}`]
      );
      await pool.query(
        "UPDATE moncash_orders SET status = 'paid', transaction_id = $2, payer = $3, paid_at = NOW() WHERE id = $1",
        [order.id, String(payment.transaction_id), String(payment.payer || "")]
      );
      await refreshPaymentStatus(order.shipment_id);
      const tracking = (await pool.query("SELECT tracking_number FROM shipments WHERE id = $1", [order.shipment_id])).rows[0];
      res.json({ success: true, trackingNumber: tracking.tracking_number });
    } catch (err) {
      console.error("MonCash confirm error:", err);
      res.status(500).json({ error: "server_error" });
    }
  });

  // ----- Public: start a PayPal payment -----
  app.post("/api/shipments/track/:number/pay/paypal", rateLimit("ship-paypal", 10, 10 * 60 * 1000), async (req, res) => {
    try {
      if (!paypalConfigured()) return res.status(503).json({ error: "payments_not_configured" });
      const found = await loadPublicShipment(req.params.number);
      if (!found) return res.status(404).json({ error: "not_found" });
      const pub = publicShipment(found.s, found.events, found.paid, found.moncash, found.enabled);
      if (!pub.payment.canPay || !pub.payment.methods.paypal) return res.status(400).json({ error: "nothing_to_pay" });
      const origin = allowedOrigin(req.body?.returnOrigin);
      if (!origin) return res.status(400).json({ error: "invalid_return_origin" });
      const base = `${origin}/shipping/track/${pub.trackingNumber}`;

      const { orderId, url } = await createPaypalOrder({
        amountUsd: pub.payment.balance,
        trackingNumber: pub.trackingNumber,
        description: `Pi Pwòp Shipping ${pub.trackingNumber}`,
        returnUrl: `${base}?paypal=1`,
        cancelUrl: `${base}?canceled=1`,
      });
      await pool.query(
        "INSERT INTO paypal_orders (order_id, shipment_id, amount_usd) VALUES ($1,$2,$3)",
        [orderId, found.s.id, pub.payment.balance]
      );
      res.json({ url });
    } catch (err) {
      console.error("PayPal pay error:", err.message);
      res.status(502).json({ error: "paypal_unavailable" });
    }
  });

  // ----- Public: capture the PayPal payment after the customer approves it -----
  app.post("/api/shipments/track/:number/pay/paypal/confirm", rateLimit("ship-paypal-confirm", 20, 10 * 60 * 1000), async (req, res) => {
    try {
      if (!paypalConfigured()) return res.status(503).json({ error: "payments_not_configured" });
      const orderId = str(req.body?.orderId, 64);
      if (!orderId) return res.status(400).json({ error: "missing_order" });
      const order = (
        await pool.query(
          `SELECT o.*, s.tracking_number FROM paypal_orders o JOIN shipments s ON s.id = o.shipment_id WHERE o.order_id = $1`,
          [orderId]
        )
      ).rows[0];
      // The order must belong to THIS tracking number and be one we created.
      if (!order || normalizeTracking(order.tracking_number) !== normalizeTracking(req.params.number)) {
        return res.status(400).json({ error: "order_mismatch" });
      }
      if (order.status === "paid") return res.json({ success: true });

      const cap = await capturePaypalOrder(orderId);
      if (!cap.completed || Math.abs(cap.amount - Number(order.amount_usd)) > 0.009) {
        return res.json({ success: false });
      }
      await recordPayment({
        shipmentId: order.shipment_id,
        amount: order.amount_usd,
        method: "paypal",
        reference: `paypal:${cap.captureId}`,
        note: "PayPal",
      });
      await pool.query("UPDATE paypal_orders SET status = 'paid', capture_id = $2, paid_at = NOW() WHERE order_id = $1", [orderId, cap.captureId]);
      res.json({ success: true });
    } catch (err) {
      console.error("PayPal confirm error:", err.message);
      res.status(500).json({ error: "server_error" });
    }
  });

  // ----- Public: choose to pay CASH. Acceptance stays pending until the admin confirms. -----
  app.post("/api/shipments/track/:number/pay/cash", rateLimit("ship-cash", 10, 10 * 60 * 1000), async (req, res) => {
    try {
      const found = await loadPublicShipment(req.params.number);
      if (!found) return res.status(404).json({ error: "not_found" });
      const pub = publicShipment(found.s, found.events, found.paid, found.moncash, found.enabled);
      if (!pub.payment.canPay || !pub.payment.methods.cash) return res.status(400).json({ error: "nothing_to_pay" });
      await pool.query(
        "UPDATE shipments SET cash_pending = TRUE, cash_requested_at = COALESCE(cash_requested_at, NOW()), updated_at = NOW() WHERE id = $1",
        [found.s.id]
      );
      res.json({ success: true });
    } catch (err) {
      console.error("Cash choose error:", err);
      res.status(500).json({ error: "server_error" });
    }
  });

  // ----- Public: change my mind about cash -----
  app.post("/api/shipments/track/:number/pay/cash/cancel", rateLimit("ship-cash-cancel", 10, 10 * 60 * 1000), async (req, res) => {
    try {
      await pool.query("UPDATE shipments SET cash_pending = FALSE, updated_at = NOW() WHERE tracking_number = $1", [normalizeTracking(req.params.number)]);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "server_error" });
    }
  });

  // ----- Public: request a callback -----
  app.post("/api/callbacks", rateLimit("callback", 6, 10 * 60 * 1000), async (req, res) => {
    try {
      const b = req.body || {};
      const name = str(b.name, 120);
      const phone = str(b.phone, 40);
      if (!name || !phone) return res.status(400).json({ error: "missing_fields" });
      const email = str(b.email, 160) || null;
      if (email && !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: "invalid_email" });
      const time = ["morning", "afternoon", "evening", "anytime"].includes(b.preferredTime) ? b.preferredTime : "anytime";
      const topic = ["quote", "tracking", "payment", "other"].includes(b.topic) ? b.topic : "other";
      await pool.query(
        `INSERT INTO callback_requests (name, phone, email, preferred_time, topic, language, message)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [name, phone, email, time, topic, LANGS.includes(b.language) ? b.language : "ht", str(b.message, 2000) || null]
      );
      res.status(201).json({ success: true });
    } catch (err) {
      console.error("Callback error:", err);
      res.status(500).json({ error: "server_error" });
    }
  });

  // =========================== ADMIN ===========================

  app.get("/api/admin/shipments", authenticateAdmin, async (req, res) => {
    try {
      const status = str(req.query.status, 30);
      const r = await pool.query(
        `SELECT s.*, COALESCE(p.total,0) AS paid_total
         FROM shipments s
         LEFT JOIN (SELECT shipment_id, SUM(amount) AS total FROM shipment_payments GROUP BY shipment_id) p
           ON p.shipment_id = s.id
         ${status ? "WHERE s.status = $1" : ""}
         ORDER BY s.created_at DESC LIMIT 500`,
        status ? [status] : []
      );
      res.json(r.rows.map(fixDates));
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "server_error" });
    }
  });

  app.get("/api/admin/shipments/:id", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const s = (await pool.query("SELECT * FROM shipments WHERE id = $1", [id])).rows[0];
      if (!s) return res.status(404).json({ error: "not_found" });
      const events = (
        await pool.query("SELECT * FROM shipment_events WHERE shipment_id = $1 ORDER BY occurred_at ASC, id ASC", [id])
      ).rows;
      const payments = (
        await pool.query("SELECT * FROM shipment_payments WHERE shipment_id = $1 ORDER BY created_at ASC", [id])
      ).rows;
      res.json({ ...fixDates(s), events, payments });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "server_error" });
    }
  });

  // Edit quote / ETA / notes
  app.patch("/api/admin/shipments/:id", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const b = req.body || {};
      const sets = [];
      const vals = [];
      const add = (col, val) => { vals.push(val); sets.push(`${col} = $${vals.length}`); };
      if ("quoteAmount" in b) add("quote_amount", optNum(b.quoteAmount));
      if ("estimatedDelivery" in b) add("estimated_delivery", optDate(b.estimatedDelivery));
      if ("publicNote" in b) add("public_note", str(b.publicNote, 1000) || null);
      if ("adminNotes" in b) add("admin_notes", str(b.adminNotes, 4000) || null);
      if (!sets.length) return res.status(400).json({ error: "nothing_to_update" });
      vals.push(id);
      const r = await pool.query(
        `UPDATE shipments SET ${sets.join(", ")}, updated_at = NOW() WHERE id = $${vals.length} RETURNING id`,
        vals
      );
      if (!r.rows[0]) return res.status(404).json({ error: "not_found" });
      await refreshPaymentStatus(id); // quote may have changed
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "server_error" });
    }
  });

  // Approve: from here on the customer can track with their number
  app.post("/api/admin/shipments/:id/approve", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const b = req.body || {};
      const s = (await pool.query("SELECT status FROM shipments WHERE id = $1", [id])).rows[0];
      if (!s) return res.status(404).json({ error: "not_found" });
      if (s.status !== "submitted" && s.status !== "rejected") {
        return res.status(400).json({ error: "already_approved" });
      }
      await pool.query(
        `UPDATE shipments SET status = 'approved', approved_at = NOW(),
           quote_amount = COALESCE($2, quote_amount),
           estimated_delivery = COALESCE($3, estimated_delivery),
           public_note = COALESCE($4, public_note), updated_at = NOW()
         WHERE id = $1`,
        [id, optNum(b.quoteAmount), optDate(b.estimatedDelivery), str(b.publicNote, 1000) || null]
      );
      await pool.query(
        "INSERT INTO shipment_events (shipment_id, status, note) VALUES ($1,'approved',$2)",
        [id, str(b.note, 500) || null]
      );
      await refreshPaymentStatus(id);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "server_error" });
    }
  });

  app.post("/api/admin/shipments/:id/reject", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const reason = str(req.body?.reason, 1000) || null;
      const r = await pool.query(
        "UPDATE shipments SET status = 'rejected', public_note = $2, updated_at = NOW() WHERE id = $1 AND status IN ('submitted','rejected') RETURNING id",
        [id, reason]
      );
      if (!r.rows[0]) return res.status(400).json({ error: "cannot_reject" });
      await pool.query("INSERT INTO shipment_events (shipment_id, status, note) VALUES ($1,'rejected',$2)", [id, reason]);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "server_error" });
    }
  });

  // Add a tracking update (moves the shipment forward)
  app.post("/api/admin/shipments/:id/events", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const b = req.body || {};
      const status = str(b.status, 30);
      if (!STATUS_FLOW.includes(status)) return res.status(400).json({ error: "invalid_status" });
      const s = (await pool.query("SELECT status FROM shipments WHERE id = $1", [id])).rows[0];
      if (!s) return res.status(404).json({ error: "not_found" });
      if (s.status === "submitted" || s.status === "rejected") {
        return res.status(400).json({ error: "approve_first" });
      }
      const when = b.occurredAt && !Number.isNaN(new Date(b.occurredAt).getTime()) ? new Date(b.occurredAt) : new Date();
      await pool.query(
        "INSERT INTO shipment_events (shipment_id, status, location, note, occurred_at) VALUES ($1,$2,$3,$4,$5)",
        [id, status, str(b.location, 160) || null, str(b.note, 500) || null, when]
      );
      await syncStatusFromEvents(id);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "server_error" });
    }
  });

  app.delete("/api/admin/shipments/:id/events/:eventId", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const ev = (
        await pool.query("SELECT status FROM shipment_events WHERE id = $1 AND shipment_id = $2", [parseInt(req.params.eventId, 10), id])
      ).rows[0];
      if (!ev) return res.status(404).json({ error: "not_found" });
      if (ev.status === "submitted" || ev.status === "approved" || ev.status === "rejected") {
        return res.status(400).json({ error: "cannot_delete" });
      }
      await pool.query("DELETE FROM shipment_events WHERE id = $1", [parseInt(req.params.eventId, 10)]);
      await syncStatusFromEvents(id);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "server_error" });
    }
  });

  // Cash: the customer said they will pay cash. Confirming records the payment
  // and lifts the "acceptance pending" hold.
  app.post("/api/admin/shipments/:id/cash/confirm", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const s = (await pool.query("SELECT quote_amount, cash_pending FROM shipments WHERE id = $1", [id])).rows[0];
      if (!s) return res.status(404).json({ error: "not_found" });
      const balance = s.quote_amount === null ? null : Math.max(0, Number(s.quote_amount) - (await paidTotal(id)));
      const amount = optNum(req.body?.amount) ?? balance;
      if (!amount || amount <= 0) return res.status(400).json({ error: "invalid_amount" });
      await recordPayment({ shipmentId: id, amount, method: "cash", reference: null, note: str(req.body?.note, 300) || null });
      // Cash received (even a partial amount) confirms acceptance.
      await pool.query("UPDATE shipments SET cash_pending = FALSE, updated_at = NOW() WHERE id = $1", [id]);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "server_error" });
    }
  });

  app.post("/api/admin/shipments/:id/cash/dismiss", authenticateAdmin, async (req, res) => {
    try {
      await pool.query("UPDATE shipments SET cash_pending = FALSE, updated_at = NOW() WHERE id = $1", [parseInt(req.params.id, 10)]);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "server_error" });
    }
  });

  // Record a manual payment (cash, Zelle, wire, …)
  app.post("/api/admin/shipments/:id/payments", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const amount = optNum(req.body?.amount);
      if (!amount || amount <= 0) return res.status(400).json({ error: "invalid_amount" });
      const exists = (await pool.query("SELECT 1 FROM shipments WHERE id = $1", [id])).rows[0];
      if (!exists) return res.status(404).json({ error: "not_found" });
      await pool.query(
        "INSERT INTO shipment_payments (shipment_id, amount, method, note) VALUES ($1,$2,$3,$4)",
        [id, amount, str(req.body?.method, 30) || "manual", str(req.body?.note, 300) || null]
      );
      await refreshPaymentStatus(id);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "server_error" });
    }
  });

  app.delete("/api/admin/shipments/:id", authenticateAdmin, async (req, res) => {
    try {
      await pool.query("DELETE FROM shipments WHERE id = $1", [parseInt(req.params.id, 10)]);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "server_error" });
    }
  });

  // Payment settings: which methods are on, the MonCash rate, and what is configured
  app.get("/api/admin/payment-settings", authenticateAdmin, async (_req, res) => {
    try {
      res.json({
        usdToHtg: await getUsdToHtg(),
        enabled: await getEnabledMethods(),
        configured: {
          card: Boolean(stripe),
          paypal: paypalConfigured(),
          moncash: moncashConfigured(),
          cash: true,
        },
        modes: { paypal: paypalMode(), moncash: moncashMode() },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "server_error" });
    }
  });

  app.put("/api/admin/payment-settings", authenticateAdmin, async (req, res) => {
    try {
      if ("usdToHtg" in (req.body || {})) {
        const rate = Number(req.body.usdToHtg);
        if (!Number.isFinite(rate) || rate <= 0 || rate > 10000) return res.status(400).json({ error: "invalid_rate" });
        await setUsdToHtg(rate);
      }
      if (req.body?.enabled && typeof req.body.enabled === "object") {
        const next = await getEnabledMethods();
        for (const k of METHOD_KEYS) if (typeof req.body.enabled[k] === "boolean") next[k] = req.body.enabled[k];
        await pool.query(
          "INSERT INTO app_settings (key, value) VALUES ('pay_methods', $1) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
          [JSON.stringify(next)]
        );
      }
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "server_error" });
    }
  });

  // Callback requests
  app.get("/api/admin/callbacks", authenticateAdmin, async (_req, res) => {
    try {
      const r = await pool.query("SELECT * FROM callback_requests ORDER BY created_at DESC LIMIT 500");
      res.json(r.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "server_error" });
    }
  });

  app.patch("/api/admin/callbacks/:id", authenticateAdmin, async (req, res) => {
    try {
      const status = ["new", "called", "done"].includes(req.body?.status) ? req.body.status : null;
      if (!status) return res.status(400).json({ error: "invalid_status" });
      await pool.query("UPDATE callback_requests SET status = $2 WHERE id = $1", [parseInt(req.params.id, 10), status]);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "server_error" });
    }
  });
}

// Current status = the most recent event by time; keeps timestamps in sync.
async function syncStatusFromEvents(id) {
  const latest = (
    await pool.query(
      "SELECT status FROM shipment_events WHERE shipment_id = $1 AND status <> 'submitted' ORDER BY occurred_at DESC, id DESC LIMIT 1",
      [id]
    )
  ).rows[0];
  const departed = (
    await pool.query("SELECT MIN(occurred_at) AS t FROM shipment_events WHERE shipment_id = $1 AND status = 'departed'", [id])
  ).rows[0].t;
  const delivered = (
    await pool.query("SELECT MAX(occurred_at) AS t FROM shipment_events WHERE shipment_id = $1 AND status = 'delivered'", [id])
  ).rows[0].t;
  await pool.query(
    "UPDATE shipments SET status = $2, departed_at = $3, delivered_at = $4, updated_at = NOW() WHERE id = $1",
    [id, latest?.status || "approved", departed, delivered]
  );
}

// Used by the chat assistant to answer "where is my container?"
export async function lookupPublicShipment(trackingNumber) {
  const found = await loadPublicShipment(trackingNumber);
  return found ? publicShipment(found.s, found.events, found.paid, found.moncash, found.enabled) : null;
}

export async function shippingSummary() {
  const r = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM shipments WHERE status = 'submitted') AS pending_shipments,
      (SELECT COUNT(*) FROM shipments WHERE cash_pending = TRUE) AS pending_cash,
      (SELECT COUNT(*) FROM callback_requests WHERE status = 'new') AS new_callbacks`);
  return {
    pendingCash: Number(r.rows[0].pending_cash),
    pendingShipments: Number(r.rows[0].pending_shipments),
    newCallbacks: Number(r.rows[0].new_callbacks),
  };
}
