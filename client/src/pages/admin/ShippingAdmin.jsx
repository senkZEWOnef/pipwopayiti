import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { api, adminToken } from "../../api";
import { STATUS_FLOW, STATUS_ICONS } from "../../data/shipping";

const money = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(n) || 0);
const when = (v) =>
  v ? new Date(v).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";
const day = (v) => (v ? new Date(String(v).length === 10 ? `${v}T12:00:00` : v).toLocaleDateString("fr-FR") : "—");

const box = "rounded-2xl bg-white p-6 shadow-lg dark:bg-dark-card";
const input =
  "w-full rounded-lg border border-pp-gray bg-white px-3 py-2 text-pp-deep outline-none focus:border-pp-blue dark:border-dark-border dark:bg-dark-surface dark:text-dark-text";
const label = "mb-1 block text-xs font-semibold uppercase tracking-wide text-pp-deep/60 dark:text-dark-text-secondary";
const btnPrimary = "rounded-full bg-pp-blue px-5 py-2 text-sm font-semibold text-white transition hover:bg-pp-deep disabled:opacity-50";
const btnGhost =
  "rounded-full border border-pp-gray px-4 py-2 text-sm font-semibold text-pp-deep transition hover:bg-pp-gray dark:border-dark-border dark:text-dark-text dark:hover:bg-dark-surface";

const STATUS_COLORS = {
  submitted: "bg-yellow-100 text-yellow-800",
  rejected: "bg-red-100 text-red-800",
  delivered: "bg-green-100 text-green-800",
};
const statusBadge = (s) => STATUS_COLORS[s] || "bg-blue-100 text-blue-800";
const PAY_COLORS = { unpaid: "bg-red-100 text-red-700", partial: "bg-yellow-100 text-yellow-800", paid: "bg-green-100 text-green-800" };

function Info({ k, children }) {
  return (
    <div>
      <p className={label}>{k}</p>
      <p className="whitespace-pre-wrap text-pp-deep dark:text-dark-text">{children || "—"}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shipments
// ---------------------------------------------------------------------------

function ShipmentDetail({ id, onBack, onChanged }) {
  const { t } = useTranslation();
  const s = (k, o) => t(`shipAdmin.shipments.${k}`, o);
  const token = adminToken();
  const [d, setD] = useState(null);
  const [busy, setBusy] = useState(false);
  const [edit, setEdit] = useState({ quote: "", eta: "", publicNote: "", adminNotes: "" });
  const [saved, setSaved] = useState(false);
  const [ev, setEv] = useState({ status: "in_transit", location: "", note: "", occurredAt: "" });
  const [pay, setPay] = useState({ amount: "", method: "zelle" });
  const [rejectReason, setRejectReason] = useState("");
  const [cashAmount, setCashAmount] = useState("");

  const load = useCallback(async () => {
    const data = await api(`/api/admin/shipments/${id}`, { token });
    setD(data);
    setEdit({
      quote: data.quote_amount ?? "",
      eta: data.estimated_delivery || "",
      publicNote: data.public_note || "",
      adminNotes: data.admin_notes || "",
    });
    return data;
  }, [id, token]);

  useEffect(() => { load().catch(() => {}); }, [load]);

  const run = async (fn) => {
    setBusy(true);
    try {
      await fn();
      await load();
      onChanged?.();
    } catch {
      alert(t("shipAdmin.error"));
    } finally {
      setBusy(false);
    }
  };

  if (!d) return <div className={box}>…</div>;

  const pending = d.status === "submitted" || d.status === "rejected";
  const paid = Number(d.amount_paid) || 0;
  const quote = d.quote_amount === null ? null : Number(d.quote_amount);
  const post = (path, body, method = "POST") => api(`/api/admin/shipments/${id}${path}`, { method, token, body });

  const saveDetails = () =>
    run(async () => {
      await post("", {
        quoteAmount: edit.quote,
        estimatedDelivery: edit.eta,
        publicNote: edit.publicNote,
        adminNotes: edit.adminNotes,
      }, "PATCH");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={onBack} className={btnGhost}>{t("shipAdmin.back")}</button>
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-2xl font-bold tracking-widest text-pp-navy dark:text-dark-text">{d.tracking_number}</span>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusBadge(d.status)}`}>
            {STATUS_ICONS[d.status]} {t(`shipping.status.${d.status}`)}
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${PAY_COLORS[d.payment_status]}`}>
            {s(`paymentStatus.${d.payment_status}`)}
          </span>
        </div>
      </div>

      {d.cash_pending && (
        <div className={`${box} border-2 border-dashed border-pp-gold`}>
          <h3 className="text-lg font-bold text-pp-deep dark:text-dark-text">💵 {s("cashPendingTitle")}</h3>
          <p className="mb-3 text-sm text-pp-deep/80 dark:text-dark-text-secondary">{s("cashPendingHelp")}</p>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className={label}>{s("cashAmount")}</label>
              <input
                type="number" min="0" step="0.01" className={`${input} w-40`}
                placeholder={quote === null ? "" : String(Math.max(0, quote - paid))}
                value={cashAmount} onChange={(e) => setCashAmount(e.target.value)}
              />
            </div>
            <button
              disabled={busy}
              className="rounded-full bg-green-600 px-6 py-2 text-sm font-bold text-white transition hover:bg-green-700 disabled:opacity-50"
              onClick={() => run(async () => { await post("/cash/confirm", cashAmount ? { amount: cashAmount } : {}); setCashAmount(""); })}
            >
              ✅ {s("confirmCash")}
            </button>
            <button disabled={busy} className={btnGhost} onClick={() => run(() => post("/cash/dismiss", {}))}>
              {s("dismissCash")}
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        {/* LEFT: request details */}
        <div className={`${box} space-y-5`}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Info k={s("sender")}>{d.sender_name}</Info>
            <Info k={s("phone")}>
              <a className="text-pp-blue underline" href={`tel:${d.sender_phone}`}>{d.sender_phone}</a>
            </Info>
            <Info k={s("email")}>{d.sender_email}</Info>
            <Info k={s("language")}>{d.language === "fr" ? "🇫🇷 Français" : "🇭🇹 Kreyòl"}</Info>
          </div>
          <hr className="border-pp-gray dark:border-dark-border" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Info k={`${t("shipping.request.originCity")}`}>{d.origin_city}{d.origin_state ? `, ${d.origin_state}` : ""}</Info>
            <Info k={s("pickup")}>{d.pickup_needed ? `${t("shipAdmin.yes")} — ${d.origin_address}` : t("shipAdmin.no")}</Info>
            <Info k={t("shipping.request.destinationCity")}>{d.destination_city}</Info>
            <Info k={s("homeDelivery")}>{d.home_delivery ? `${t("shipAdmin.yes")} — ${d.destination_address}` : t("shipAdmin.no")}</Info>
          </div>
          <hr className="border-pp-gray dark:border-dark-border" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Info k={t("shipping.request.containerSize")}>
              {d.container_qty > 1 ? `${d.container_qty} × ` : ""}{t(`shipping.options.containers.${d.container_size}.label`)}
            </Info>
            <Info k={t("shipping.request.cargoType")}>{t(`shipping.options.cargo.${d.cargo_type}`)}</Info>
            <div className="sm:col-span-2"><Info k={s("cargo")}>{d.cargo_description}</Info></div>
            <Info k={s("weight")}>{d.est_weight_lbs}</Info>
            <Info k={s("value")}>{d.declared_value_usd}</Info>
            <Info k={s("shipDate")}>{day(d.preferred_ship_date)}</Info>
            <Info k={s("submittedOn")}>{when(d.created_at)}</Info>
            {d.notes && <div className="sm:col-span-2"><Info k={s("customerNotes")}>{d.notes}</Info></div>}
          </div>
          <hr className="border-pp-gray dark:border-dark-border" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Info k={s("recipient")}>{d.recipient_name}</Info>
            <Info k={s("phone")}>
              <a className="text-pp-blue underline" href={`tel:${d.recipient_phone}`}>{d.recipient_phone}</a>
            </Info>
          </div>
        </div>

        {/* RIGHT: manage */}
        <div className="space-y-6">
          {pending && (
            <div className={`${box} space-y-4`}>
              <h3 className="text-lg font-bold text-pp-deep dark:text-dark-text">{s("manage")}</h3>
              <p className="text-sm text-pp-deep/70 dark:text-dark-text-secondary">{s("approveHelp")}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={label}>{s("quote")}</label>
                  <input type="number" min="0" step="0.01" className={input} value={edit.quote} onChange={(e) => setEdit({ ...edit, quote: e.target.value })} />
                </div>
                <div>
                  <label className={label}>{s("eta")}</label>
                  <input type="date" className={input} value={edit.eta} onChange={(e) => setEdit({ ...edit, eta: e.target.value })} />
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  disabled={busy}
                  className="rounded-full bg-green-600 px-6 py-2 text-sm font-bold text-white transition hover:bg-green-700 disabled:opacity-50"
                  onClick={() => run(() => post("/approve", { quoteAmount: edit.quote, estimatedDelivery: edit.eta }))}
                >
                  ✅ {s("approve")}
                </button>
              </div>
              <hr className="border-pp-gray dark:border-dark-border" />
              <div>
                <label className={label}>{s("rejectReason")}</label>
                <input className={input} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
                <button
                  disabled={busy}
                  className="mt-3 rounded-full bg-red-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                  onClick={() => confirm(s("confirmReject")) && run(() => post("/reject", { reason: rejectReason }))}
                >
                  ⛔ {s("reject")}
                </button>
              </div>
            </div>
          )}

          {!pending && (
            <div className={`${box} space-y-4`}>
              <h3 className="text-lg font-bold text-pp-deep dark:text-dark-text">{s("addUpdate")}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={label}>{s("newStatus")}</label>
                  <select className={input} value={ev.status} onChange={(e) => setEv({ ...ev, status: e.target.value })}>
                    {STATUS_FLOW.filter((x) => x !== "approved").map((x) => (
                      <option key={x} value={x}>{STATUS_ICONS[x]} {t(`shipping.status.${x}`)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={label}>{s("location")}</label>
                  <input className={input} placeholder={s("locationPlaceholder")} value={ev.location} onChange={(e) => setEv({ ...ev, location: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <label className={label}>{s("note")}</label>
                  <input className={input} value={ev.note} onChange={(e) => setEv({ ...ev, note: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <label className={label}>{s("when")}</label>
                  <input type="datetime-local" className={input} value={ev.occurredAt} onChange={(e) => setEv({ ...ev, occurredAt: e.target.value })} />
                </div>
              </div>
              <button
                disabled={busy}
                className={btnPrimary}
                onClick={() =>
                  run(async () => {
                    await post("/events", { ...ev, occurredAt: ev.occurredAt ? new Date(ev.occurredAt).toISOString() : undefined });
                    setEv({ ...ev, location: "", note: "", occurredAt: "" });
                  })
                }
              >
                ➕ {s("addBtn")}
              </button>
            </div>
          )}

          {/* Quote / notes */}
          {!pending && (
            <div className={`${box} space-y-4`}>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={label}>{s("quote")}</label>
                  <input type="number" min="0" step="0.01" className={input} value={edit.quote} onChange={(e) => setEdit({ ...edit, quote: e.target.value })} />
                </div>
                <div>
                  <label className={label}>{s("eta")}</label>
                  <input type="date" className={input} value={edit.eta} onChange={(e) => setEdit({ ...edit, eta: e.target.value })} />
                </div>
              </div>
              <div>
                <label className={label}>{s("publicNote")}</label>
                <textarea rows={2} className={input} value={edit.publicNote} onChange={(e) => setEdit({ ...edit, publicNote: e.target.value })} />
              </div>
              <div>
                <label className={label}>{s("adminNotes")}</label>
                <textarea rows={2} className={input} value={edit.adminNotes} onChange={(e) => setEdit({ ...edit, adminNotes: e.target.value })} />
              </div>
              {quote === null && <p className="text-sm font-semibold text-yellow-700">{s("needQuoteToPay")}</p>}
              <button disabled={busy} className={btnPrimary} onClick={saveDetails}>
                {saved ? t("shipAdmin.saved") : s("saveDetails")}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Timeline */}
        <div className={box}>
          <h3 className="mb-4 text-lg font-bold text-pp-deep dark:text-dark-text">{s("timeline")}</h3>
          <ol className="space-y-3">
            {[...d.events].reverse().map((e) => (
              <li key={e.id} className="flex items-start justify-between gap-3 rounded-xl bg-pp-gray/60 p-3 dark:bg-dark-surface">
                <div>
                  <p className="font-semibold text-pp-deep dark:text-dark-text">
                    {STATUS_ICONS[e.status]} {t(`shipping.status.${e.status}`)}
                  </p>
                  <p className="text-xs text-pp-deep/60 dark:text-dark-text-secondary">
                    {when(e.occurred_at)}{e.location ? ` · ${e.location}` : ""}
                  </p>
                  {e.note && <p className="mt-1 text-sm text-pp-deep/80 dark:text-dark-text-secondary">{e.note}</p>}
                </div>
                {!["submitted", "approved", "rejected"].includes(e.status) && (
                  <button
                    title={s("removeEvent")}
                    className="text-sm text-red-500 hover:text-red-700"
                    onClick={() => run(() => post(`/events/${e.id}`, undefined, "DELETE"))}
                  >
                    ✕
                  </button>
                )}
              </li>
            ))}
          </ol>
        </div>

        {/* Payments */}
        <div className={`${box} space-y-4`}>
          <h3 className="text-lg font-bold text-pp-deep dark:text-dark-text">💳 {s("payments")}</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {[[s("quote"), quote === null ? "—" : money(quote)], [s("totalPaid"), money(paid)], [s("balance"), quote === null ? "—" : money(Math.max(0, quote - paid))]].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-pp-gray/60 p-3 text-center dark:bg-dark-surface">
                <p className={label}>{k}</p>
                <p className="text-xl font-bold text-pp-navy dark:text-dark-text">{v}</p>
              </div>
            ))}
          </div>

          {d.payments.length === 0 ? (
            <p className="text-sm text-pp-deep/60 dark:text-dark-text-secondary">{s("noPayments")}</p>
          ) : (
            <ul className="divide-y divide-pp-gray text-sm dark:divide-dark-border">
              {d.payments.map((p) => (
                <li key={p.id} className="flex justify-between py-2 text-pp-deep dark:text-dark-text">
                  <span>{when(p.created_at)} · {p.method === "card" ? s("card") : t(`shipAdmin.shipments.methods.${p.method}`, { defaultValue: p.method })}</span>
                  <span className="font-semibold">{money(p.amount)}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="grid gap-3 border-t border-pp-gray pt-4 dark:border-dark-border sm:grid-cols-3">
            <div>
              <label className={label}>{s("amount")}</label>
              <input type="number" min="0" step="0.01" className={input} value={pay.amount} onChange={(e) => setPay({ ...pay, amount: e.target.value })} />
            </div>
            <div>
              <label className={label}>{s("method")}</label>
              <select className={input} value={pay.method} onChange={(e) => setPay({ ...pay, method: e.target.value })}>
                {["zelle", "cash", "wire", "check", "other"].map((m) => <option key={m} value={m}>{s(`methods.${m}`)}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button
                disabled={busy || !Number(pay.amount)}
                className={`${btnPrimary} w-full`}
                onClick={() => run(async () => { await post("/payments", pay); setPay({ ...pay, amount: "" }); })}
              >
                {s("addPayment")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-right">
        <button
          className="text-sm font-semibold text-red-600 hover:underline"
          onClick={async () => {
            if (!confirm(s("confirmDelete"))) return;
            try { await post("", undefined, "DELETE"); onBack(); onChanged?.(); } catch { alert(t("shipAdmin.error")); }
          }}
        >
          🗑 {s("deleteShipment")}
        </button>
      </div>
    </div>
  );
}

function PaymentSettings() {
  const { t } = useTranslation();
  const ps = (k, o) => t(`shipAdmin.paymentSettings.${k}`, o);
  const token = adminToken();
  const [info, setInfo] = useState(null);
  const [rate, setRate] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api("/api/admin/payment-settings", { token })
      .then((d) => { setInfo(d); setRate(d.usdToHtg ?? ""); })
      .catch(() => {});
  }, [token]);

  if (!info) return null;

  const saveRate = async () => {
    try {
      await api("/api/admin/payment-settings", { method: "PUT", token, body: { usdToHtg: rate } });
      setInfo((p) => ({ ...p, usdToHtg: Number(rate) }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch { alert(t("shipAdmin.error")); }
  };

  const toggle = async (m) => {
    const next = !info.enabled[m];
    setInfo((p) => ({ ...p, enabled: { ...p.enabled, [m]: next } }));
    try {
      await api("/api/admin/payment-settings", { method: "PUT", token, body: { enabled: { [m]: next } } });
    } catch {
      setInfo((p) => ({ ...p, enabled: { ...p.enabled, [m]: !next } }));
      alert(t("shipAdmin.error"));
    }
  };

  const METHODS = [
    { id: "cash", icon: "💵" },
    { id: "card", icon: "💳" },
    { id: "paypal", icon: "🅿️" },
    { id: "moncash", icon: "📱" },
  ];

  return (
    <div className={`${box} mb-6`}>
      <h3 className="mb-3 text-lg font-bold text-pp-deep dark:text-dark-text">💱 {ps("title")}</h3>

      <p className={label}>{ps("methodsTitle")}</p>
      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {METHODS.map(({ id, icon }) => {
          const configured = info.configured[id];
          const on = info.enabled[id];
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              role="switch"
              aria-checked={on}
              className={`rounded-xl border-2 p-3 text-left transition ${on ? "border-green-500 bg-green-50 dark:bg-green-900/10" : "border-pp-gray opacity-70 dark:border-dark-border"}`}
            >
              <span className="flex items-center justify-between font-bold text-pp-deep dark:text-dark-text">
                <span>{icon} {ps(`methodNames.${id}`)}</span>
                <span className={`text-xs ${on ? "text-green-700" : "text-pp-deep/50"}`}>{on ? "ON" : "OFF"}</span>
              </span>
              <span className={`mt-1 block text-xs font-semibold ${configured ? "text-green-700" : "text-red-600"}`}>
                {id === "cash" ? ps("alwaysReady") : configured ? `${ps("configured")}${info.modes[id] ? ` (${info.modes[id]})` : ""}` : ps("notConfigured")}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mb-4 text-xs text-pp-deep/60 dark:text-dark-text-secondary">{ps("keysHint")}</p>

      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className={label}>{ps("rateLabel")}</label>
          <div className="flex items-center gap-2">
            <input type="number" min="0" step="0.01" className={`${input} w-32`} value={rate} onChange={(e) => setRate(e.target.value)} />
            <span className="font-semibold text-pp-deep dark:text-dark-text">{ps("htg")}</span>
          </div>
        </div>
        <button className={btnPrimary} disabled={!Number(rate)} onClick={saveRate}>{saved ? t("shipAdmin.saved") : ps("saveRate")}</button>
      </div>
      <p className="mt-2 text-xs text-pp-deep/60 dark:text-dark-text-secondary">{ps("rateHelp")}</p>
      {info.configured.moncash && !info.usdToHtg && <p className="mt-2 text-sm font-semibold text-yellow-700">{ps("noRate")}</p>}
      <p className="mt-3 text-xs text-pp-deep/60 dark:text-dark-text-secondary">
        {ps("returnUrl")} <code className="rounded bg-pp-gray px-2 py-0.5 dark:bg-dark-surface">{window.location.origin}/shipping/moncash/return</code>
      </p>
    </div>
  );
}

export function ShipmentsPanel({ onChanged }) {
  const { t } = useTranslation();
  const s = (k) => t(`shipAdmin.shipments.${k}`);
  const token = adminToken();
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    try { setRows(await api("/api/admin/shipments", { token })); } catch { /* ignore */ }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  if (selected) {
    return <ShipmentDetail id={selected} onBack={() => { setSelected(null); load(); }} onChanged={() => { load(); onChanged?.(); }} />;
  }

  const filters = ["all", "submitted", ...STATUS_FLOW, "rejected"];
  const shown = filter === "all" ? rows : rows.filter((r) => r.status === filter);
  const filterLabel = (f) => (f === "all" ? s("all") : f === "submitted" ? s("pendingFilter") : t(`shipping.status.${f}`));

  return (
    <>
    <PaymentSettings />
    <div className={box}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-pp-deep dark:text-dark-text">🚢 {s("title")}</h2>
        <div className="flex gap-3">
          <select className={`${input} w-auto`} value={filter} onChange={(e) => setFilter(e.target.value)}>
            {filters.map((f) => <option key={f} value={f}>{filterLabel(f)}</option>)}
          </select>
          <button className={btnPrimary} onClick={load}>{t("shipAdmin.refresh")}</button>
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="py-10 text-center text-pp-deep/60 dark:text-dark-text-secondary">{s("empty")}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-pp-gray text-xs uppercase tracking-wide text-pp-deep/60 dark:border-dark-border dark:text-dark-text-secondary">
                {["number", "customer", "route", "container", "status", "payment", "date"].map((h) => <th key={h} className="p-3">{s(h)}</th>)}
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => setSelected(r.id)}
                  className={`cursor-pointer border-b border-pp-gray/50 hover:bg-pp-gray/40 dark:border-dark-border dark:hover:bg-dark-surface ${r.status === "submitted" ? "bg-yellow-50/60 dark:bg-yellow-900/10" : ""}`}
                >
                  <td className="p-3 font-mono font-bold text-pp-navy dark:text-dark-text">
                    {r.tracking_number}
                    {r.cash_pending && <span className="ml-2 rounded-full bg-pp-gold px-2 py-0.5 font-sans text-[10px] font-bold text-pp-navy">💵 {t("shipAdmin.shipments.cashPending")}</span>}
                  </td>
                  <td className="p-3 text-pp-deep dark:text-dark-text">{r.sender_name}<br /><span className="text-xs text-pp-deep/60 dark:text-dark-text-secondary">{r.sender_phone}</span></td>
                  <td className="p-3 text-pp-deep dark:text-dark-text">{r.origin_city} → {r.destination_city}</td>
                  <td className="p-3 text-pp-deep dark:text-dark-text">{r.container_qty > 1 ? `${r.container_qty}× ` : ""}{t(`shipping.options.containers.${r.container_size}.label`)}</td>
                  <td className="p-3"><span className={`rounded-full px-3 py-1 text-xs font-bold ${statusBadge(r.status)}`}>{t(`shipping.status.${r.status}`)}</span></td>
                  <td className="p-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${PAY_COLORS[r.payment_status]}`}>{t(`shipAdmin.shipments.paymentStatus.${r.payment_status}`)}</span>
                    {r.quote_amount !== null && <span className="ml-2 text-xs text-pp-deep/60 dark:text-dark-text-secondary">{money(r.quote_amount)}</span>}
                  </td>
                  <td className="p-3 text-pp-deep/70 dark:text-dark-text-secondary">{when(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Callback requests
// ---------------------------------------------------------------------------

export function CallbacksPanel({ onChanged }) {
  const { t } = useTranslation();
  const c = (k) => t(`shipAdmin.callbacks.${k}`);
  const token = adminToken();
  const [rows, setRows] = useState([]);

  const load = useCallback(async () => {
    try { setRows(await api("/api/admin/callbacks", { token })); } catch { /* ignore */ }
  }, [token]);
  useEffect(() => { load(); }, [load]);

  const setStatus = async (id, status) => {
    try { await api(`/api/admin/callbacks/${id}`, { method: "PATCH", token, body: { status } }); load(); onChanged?.(); } catch { alert(t("shipAdmin.error")); }
  };
  const colors = { new: "bg-yellow-100 text-yellow-800", called: "bg-blue-100 text-blue-800", done: "bg-green-100 text-green-800" };

  return (
    <div className={box}>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-pp-deep dark:text-dark-text">📞 {c("title")}</h2>
        <button className={btnPrimary} onClick={load}>{t("shipAdmin.refresh")}</button>
      </div>
      {rows.length === 0 ? (
        <p className="py-10 text-center text-pp-deep/60 dark:text-dark-text-secondary">{c("empty")}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-pp-gray text-xs uppercase tracking-wide text-pp-deep/60 dark:border-dark-border dark:text-dark-text-secondary">
                {["name", "phone", "time", "topic", "message", "date", "status"].map((h) => <th key={h} className="p-3">{c(h)}</th>)}
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className={`border-b border-pp-gray/50 dark:border-dark-border ${r.status === "new" ? "bg-yellow-50/60 dark:bg-yellow-900/10" : ""}`}>
                  <td className="p-3 font-semibold text-pp-deep dark:text-dark-text">
                    {r.name}
                    <br /><span className="text-xs font-normal text-pp-deep/60 dark:text-dark-text-secondary">{r.language === "fr" ? "🇫🇷" : "🇭🇹"} {r.email}</span>
                  </td>
                  <td className="p-3"><a className="font-semibold text-pp-blue underline" href={`tel:${r.phone}`}>{r.phone}</a></td>
                  <td className="p-3 text-pp-deep dark:text-dark-text">{t(`shipping.call.times.${r.preferred_time}`)}</td>
                  <td className="p-3 text-pp-deep dark:text-dark-text">{t(`shipping.call.topics.${r.topic}`)}</td>
                  <td className="max-w-xs p-3 text-pp-deep/80 dark:text-dark-text-secondary">{r.message}</td>
                  <td className="p-3 text-pp-deep/70 dark:text-dark-text-secondary">{when(r.created_at)}</td>
                  <td className="p-3"><span className={`rounded-full px-3 py-1 text-xs font-bold ${colors[r.status]}`}>{c(`statuses.${r.status}`)}</span></td>
                  <td className="space-x-3 whitespace-nowrap p-3 text-xs font-semibold">
                    {r.status === "new" && <button className="text-pp-blue hover:underline" onClick={() => setStatus(r.id, "called")}>{c("markCalled")}</button>}
                    {r.status !== "done" && <button className="text-green-700 hover:underline" onClick={() => setStatus(r.id, "done")}>{c("markDone")}</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Live chat
// ---------------------------------------------------------------------------

export function ChatPanel() {
  const { t } = useTranslation();
  const c = (k) => t(`shipAdmin.chat.${k}`);
  const token = adminToken();
  const [convs, setConvs] = useState([]);
  const [summary, setSummary] = useState({ available: false, aiConfigured: false });
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const lastId = useRef(0);
  const scroller = useRef(null);

  const loadList = useCallback(async () => {
    try {
      const [list, sum] = await Promise.all([
        api("/api/admin/chat/conversations", { token }),
        api("/api/admin/chat/summary", { token }),
      ]);
      setConvs(list);
      setSummary(sum);
    } catch { /* ignore */ }
  }, [token]);

  useEffect(() => {
    loadList();
    const id = setInterval(loadList, 4000);
    return () => clearInterval(id);
  }, [loadList]);

  // Load / poll the open thread
  useEffect(() => {
    setMessages([]);
    lastId.current = 0;
    if (!selected) return undefined;
    let stop = false;
    const tick = async () => {
      try {
        const d = await api(`/api/admin/chat/conversations/${selected}/messages?after=${lastId.current}`, { token });
        if (stop || !d.messages.length) return;
        lastId.current = Math.max(lastId.current, ...d.messages.map((m) => m.id));
        setMessages((prev) => {
          const seen = new Set(prev.map((m) => m.id));
          return [...prev, ...d.messages.filter((m) => !seen.has(m.id))];
        });
      } catch { /* ignore */ }
    };
    tick();
    const id = setInterval(tick, 3000);
    return () => { stop = true; clearInterval(id); };
  }, [selected, token]);

  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [messages]);

  const toggleAvailable = async () => {
    try {
      const r = await api("/api/admin/chat/availability", { method: "PUT", token, body: { available: !summary.available } });
      setSummary((p) => ({ ...p, available: r.available }));
    } catch { alert(t("shipAdmin.error")); }
  };

  const send = async (e) => {
    e.preventDefault();
    const body = draft.trim();
    if (!body || !selected) return;
    setDraft("");
    try {
      const d = await api(`/api/admin/chat/conversations/${selected}/messages`, { method: "POST", token, body: { body } });
      lastId.current = Math.max(lastId.current, d.message.id);
      setMessages((p) => (p.some((m) => m.id === d.message.id) ? p : [...p, d.message]));
    } catch { setDraft(body); alert(t("shipAdmin.error")); }
  };

  const setStatus = async (status) => {
    try { await api(`/api/admin/chat/conversations/${selected}`, { method: "PATCH", token, body: { status } }); loadList(); } catch { alert(t("shipAdmin.error")); }
  };

  const current = convs.find((x) => x.id === selected);
  const nameOf = (x) => x.visitor_name || `${c("anonymous")} #${x.id}`;
  const senderLabel = (s) => (s === "admin" ? c("you") : s === "ai" ? `🤖 ${c("ai")}` : c("visitor"));

  return (
    <div className="space-y-4">
      {/* Availability */}
      <div className={`${box} flex flex-wrap items-center justify-between gap-4`}>
        <div>
          <h2 className="text-2xl font-bold text-pp-deep dark:text-dark-text">💬 {c("title")}</h2>
          <p className="mt-1 max-w-2xl text-sm text-pp-deep/70 dark:text-dark-text-secondary">{c("availableHelp")}</p>
          <p className="mt-2 text-sm font-semibold">
            <span className={summary.available ? "text-green-600" : "text-yellow-600"}>● {summary.available ? c("onlineNow") : c("awayNow")}</span>
            <span className="mx-2 text-pp-deep/30">|</span>
            <span className={summary.aiConfigured ? "text-green-600" : "text-red-600"}>
              {summary.aiConfigured ? `🤖 ${c("aiOn")}` : `🤖 ${c("aiOff")}`}
            </span>
          </p>
        </div>
        <button
          onClick={toggleAvailable}
          role="switch"
          aria-checked={summary.available}
          className={`flex items-center gap-3 rounded-full px-5 py-3 font-bold transition ${summary.available ? "bg-green-600 text-white" : "bg-pp-gray text-pp-deep dark:bg-dark-surface dark:text-dark-text"}`}
        >
          <span className={`inline-block h-5 w-9 rounded-full p-0.5 transition ${summary.available ? "bg-white/40" : "bg-pp-deep/20"}`}>
            <span className={`block h-4 w-4 rounded-full bg-white shadow transition ${summary.available ? "translate-x-4" : ""}`} />
          </span>
          {c("available")}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        {/* Conversations */}
        <div className={`${box} max-h-[620px] overflow-y-auto p-3`}>
          <h3 className="mb-2 px-3 pt-2 text-sm font-bold uppercase tracking-wide text-pp-deep/60 dark:text-dark-text-secondary">{c("conversations")}</h3>
          {convs.length === 0 && <p className="p-3 text-sm text-pp-deep/60 dark:text-dark-text-secondary">{c("none")}</p>}
          {convs.map((x) => (
            <button
              key={x.id}
              onClick={() => setSelected(x.id)}
              className={`mb-1 w-full rounded-xl p-3 text-left transition ${selected === x.id ? "bg-pp-blue/10" : "hover:bg-pp-gray/60 dark:hover:bg-dark-surface"}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-semibold text-pp-deep dark:text-dark-text">
                  {x.language === "fr" ? "🇫🇷" : "🇭🇹"} {nameOf(x)}
                </span>
                {x.admin_unread > 0 && x.status === "open" && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">{x.admin_unread}</span>
                )}
              </div>
              <p className="truncate text-sm text-pp-deep/60 dark:text-dark-text-secondary">
                {x.last_sender === "ai" ? "🤖 " : x.last_sender === "admin" ? `${c("you")}: ` : ""}{x.last_body}
              </p>
              <p className="text-xs text-pp-deep/40 dark:text-dark-text-secondary">
                {when(x.last_message_at)}{x.status === "closed" ? ` · ${c("closed")}` : ""}
              </p>
            </button>
          ))}
        </div>

        {/* Thread */}
        <div className={`${box} flex h-[620px] flex-col p-0`}>
          {!current ? (
            <p className="m-auto p-6 text-center text-pp-deep/60 dark:text-dark-text-secondary">{c("select")}</p>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-pp-gray p-4 dark:border-dark-border">
                <div>
                  <p className="font-bold text-pp-deep dark:text-dark-text">{nameOf(current)}</p>
                  {current.visitor_phone && <a className="text-sm text-pp-blue underline" href={`tel:${current.visitor_phone}`}>{current.visitor_phone}</a>}
                </div>
                <button className={btnGhost} onClick={() => setStatus(current.status === "open" ? "closed" : "open")}>
                  {current.status === "open" ? c("close") : c("reopen")}
                </button>
              </div>

              <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto bg-pp-gray/40 p-4 dark:bg-dark-bg">
                {messages.map((m) => {
                  const mine = m.sender === "admin";
                  return (
                    <div key={m.id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
                      <span className="mb-1 px-1 text-xs font-semibold text-pp-deep/50 dark:text-dark-text-secondary">
                        {senderLabel(m.sender)} · {when(m.createdAt)}
                      </span>
                      <div
                        className={`max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2 text-sm shadow-sm ${
                          mine ? "bg-pp-blue text-white" : m.sender === "ai" ? "bg-pp-gold/25 text-pp-deep dark:text-dark-text" : "bg-white text-pp-deep dark:bg-dark-card dark:text-dark-text"
                        }`}
                      >
                        {m.body}
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={send} className="flex gap-2 border-t border-pp-gray p-3 dark:border-dark-border">
                <input className={input} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={c("placeholder")} />
                <button disabled={!draft.trim()} className={btnPrimary}>{c("send")}</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
