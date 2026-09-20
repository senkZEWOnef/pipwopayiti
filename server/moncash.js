import { pool } from "./db.js";

// MonCash (Digicel Haiti) REST API — https://sandbox.moncashbutton.digicelgroup.com/Moncash-business/resources/doc/RestAPI_MonCash_doc.pdf
//   POST {API}/oauth/token            (Basic client_id:client_secret, form: scope=read,write&grant_type=client_credentials)
//   POST {API}/v1/CreatePayment       {amount (HTG), orderId}  -> payment_token.token
//   customer is redirected to         {GATEWAY}/Payment/Redirect?token=<token>
//   POST {API}/v1/RetrieveTransactionPayment {transactionId}
//   POST {API}/v1/RetrieveOrderPayment       {orderId}
// The customer's return URL is configured in the MonCash business portal (not per request).

const MODE = process.env.MONCASH_MODE === "live" ? "live" : "sandbox";
const HOST = MODE === "live" ? "moncashbutton.digicelgroup.com" : "sandbox.moncashbutton.digicelgroup.com";
const API_URL = process.env.MONCASH_API_URL || `https://${HOST}/Api`;
const GATEWAY_URL = process.env.MONCASH_GATEWAY_URL || `https://${HOST}/Moncash-middleware`;

const CLIENT_ID = process.env.MONCASH_CLIENT_ID;
const CLIENT_SECRET = process.env.MONCASH_CLIENT_SECRET;

// Order ids sent to MonCash are numeric (100000 + our row id): unique, simple, and map back to a row.
export const ORDER_OFFSET = 100000;

export const moncashConfigured = () => Boolean(CLIENT_ID && CLIENT_SECRET);
export const moncashMode = () => MODE;

export async function ensureMoncashTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_settings (
      key VARCHAR(60) PRIMARY KEY,
      value TEXT
    )`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS moncash_orders (
      id SERIAL PRIMARY KEY,
      shipment_id INTEGER NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
      amount_usd NUMERIC(12,2) NOT NULL,
      amount_htg INTEGER NOT NULL,
      rate NUMERIC(12,4) NOT NULL,
      status VARCHAR(20) DEFAULT 'pending',
      transaction_id VARCHAR(60),
      payer VARCHAR(40),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      paid_at TIMESTAMPTZ
    )`);
}

// ----- USD → HTG rate (editable by the admin; falls back to the env var) -----

export async function getUsdToHtg() {
  const r = await pool.query("SELECT value FROM app_settings WHERE key = 'usd_to_htg'");
  const n = Number(r.rows[0]?.value ?? process.env.MONCASH_USD_TO_HTG);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export async function setUsdToHtg(rate) {
  await pool.query(
    "INSERT INTO app_settings (key, value) VALUES ('usd_to_htg', $1) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
    [String(rate)]
  );
}

// What the customer is offered for a given USD balance.
export async function moncashOffer(balanceUsd) {
  if (!moncashConfigured() || !balanceUsd || balanceUsd <= 0) {
    return { available: false, rate: null, amountHtg: null };
  }
  const rate = await getUsdToHtg();
  if (!rate) return { available: false, rate: null, amountHtg: null };
  return { available: true, rate, amountHtg: Math.ceil(balanceUsd * rate) };
}

// ----- API calls -----

async function moncashFetch(url, { headers = {}, body, form } = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: { Accept: "application/json", ...headers },
    body: form ? new URLSearchParams(form) : body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON body */
  }
  return { ok: res.ok, status: res.status, data };
}

// Tokens are short-lived, so fetch a fresh one per operation.
async function getAccessToken() {
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const r = await moncashFetch(`${API_URL}/oauth/token`, {
    headers: { Authorization: `Basic ${basic}` },
    form: { scope: "read,write", grant_type: "client_credentials" },
  });
  if (!r.ok || !r.data?.access_token) throw new Error(`moncash_auth_failed_${r.status}`);
  return r.data.access_token;
}

export async function createMoncashPayment(amountHtg, orderId) {
  const token = await getAccessToken();
  const r = await moncashFetch(`${API_URL}/v1/CreatePayment`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: { amount: amountHtg, orderId: String(orderId) },
  });
  const paymentToken = r.data?.payment_token?.token;
  if (!r.ok || !paymentToken) throw new Error(`moncash_create_failed_${r.status}`);
  return `${GATEWAY_URL}/Payment/Redirect?token=${encodeURIComponent(paymentToken)}`;
}

// Returns MonCash's `payment` object ({reference, transaction_id, cost, message, payer}) or null.
export async function retrieveMoncashPayment({ transactionId, orderId }) {
  const token = await getAccessToken();
  const byTx = Boolean(transactionId);
  const r = await moncashFetch(`${API_URL}/v1/${byTx ? "RetrieveTransactionPayment" : "RetrieveOrderPayment"}`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: byTx ? { transactionId: String(transactionId) } : { orderId: String(orderId) },
  });
  if (!r.ok) return null; // e.g. the customer never completed the payment
  return r.data?.payment || null;
}
