import { pool } from "./db.js";

// PayPal Orders v2 (https://developer.paypal.com/docs/api/orders/v2/)
//   POST /v1/oauth2/token           (Basic client_id:secret, grant_type=client_credentials)
//   POST /v2/checkout/orders        intent CAPTURE  -> links[rel=payer-action|approve]
//   buyer approves on PayPal, returns to return_url with ?token=<orderId>&PayerID=...
//   POST /v2/checkout/orders/{id}/capture

const MODE = process.env.PAYPAL_MODE === "live" ? "live" : "sandbox";
const API_URL =
  process.env.PAYPAL_API_URL || (MODE === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com");
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

export const paypalConfigured = () => Boolean(CLIENT_ID && CLIENT_SECRET);
export const paypalMode = () => MODE;

export async function ensurePaypalTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS paypal_orders (
      order_id VARCHAR(64) PRIMARY KEY,
      shipment_id INTEGER NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
      amount_usd NUMERIC(12,2) NOT NULL,
      status VARCHAR(20) DEFAULT 'pending',
      capture_id VARCHAR(64),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      paid_at TIMESTAMPTZ
    )`);
}

async function ppFetch(path, { token, basic, body, form } = {}) {
  const headers = { Accept: "application/json" };
  if (basic) headers.Authorization = `Basic ${basic}`;
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined || token) headers["Content-Type"] = "application/json";
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: form ? { ...headers, "Content-Type": "application/x-www-form-urlencoded" } : headers,
    body: form ? new URLSearchParams(form) : body !== undefined ? JSON.stringify(body) : token ? "{}" : undefined,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* empty body */
  }
  return { ok: res.ok, status: res.status, data };
}

async function accessToken() {
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const r = await ppFetch("/v1/oauth2/token", { basic, form: { grant_type: "client_credentials" } });
  if (!r.ok || !r.data?.access_token) throw new Error(`paypal_auth_failed_${r.status}`);
  return r.data.access_token;
}

// Returns { orderId, url } — send the customer to `url` to approve the payment.
export async function createPaypalOrder({ amountUsd, trackingNumber, description, returnUrl, cancelUrl }) {
  const token = await accessToken();
  const r = await ppFetch("/v2/checkout/orders", {
    token,
    body: {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: trackingNumber,
          custom_id: trackingNumber,
          description,
          amount: { currency_code: "USD", value: amountUsd.toFixed(2) },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            brand_name: "Pi Pwòp Shipping",
            user_action: "PAY_NOW",
            shipping_preference: "NO_SHIPPING",
            return_url: returnUrl,
            cancel_url: cancelUrl,
          },
        },
      },
    },
  });
  const link = (r.data?.links || []).find((l) => l.rel === "payer-action" || l.rel === "approve");
  if (!r.ok || !r.data?.id || !link) throw new Error(`paypal_create_failed_${r.status}`);
  return { orderId: r.data.id, url: link.href };
}

// Capture the approved order. Returns { completed, captureId, amount } (amount as number, USD).
export async function capturePaypalOrder(orderId) {
  const token = await accessToken();
  let r = await ppFetch(`/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, { token });
  if (!r.ok) {
    // Already captured (e.g. the customer refreshed the page): read the order instead.
    const res = await fetch(`${API_URL}/v2/checkout/orders/${encodeURIComponent(orderId)}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
    r = { ok: res.ok, data: await res.json().catch(() => null) };
    if (!r.ok) return { completed: false };
  }
  const capture = r.data?.purchase_units?.[0]?.payments?.captures?.[0];
  if (r.data?.status !== "COMPLETED" || capture?.status !== "COMPLETED") return { completed: false };
  return { completed: true, captureId: capture.id, amount: Number(capture.amount?.value) };
}
