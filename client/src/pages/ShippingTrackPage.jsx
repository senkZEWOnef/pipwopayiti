import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../api";
import { Card, PageHeader } from "../components/FormBits";
import {
  STATUS_FLOW,
  STATUS_ICONS,
  myShipments,
  rememberShipment,
  normalizeTracking,
} from "../data/shipping";

const money = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n ?? 0);

function useFormatters() {
  const loc = "fr-FR"; // French month names read fine for Kreyòl too
  return {
    date: (v) =>
      v
        ? new Date(String(v).length === 10 ? `${v}T12:00:00` : v).toLocaleDateString(loc, { day: "numeric", month: "long", year: "numeric" })
        : "—",
    dateTime: (v) =>
      new Date(v).toLocaleString(loc, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
  };
}

function Stat({ label, value, sub }) {
  return (
    <div className="rounded-2xl bg-pp-gray p-4 text-center dark:bg-dark-surface">
      <p className="text-xs font-semibold uppercase tracking-wider text-pp-deep/60 dark:text-dark-text-secondary">{label}</p>
      <p className="mt-1 text-2xl font-bold text-pp-navy dark:text-dark-text">{value}</p>
      {sub && <p className="text-xs text-pp-deep/60 dark:text-dark-text-secondary">{sub}</p>}
    </div>
  );
}

function Progress({ status, t }) {
  const current = STATUS_FLOW.indexOf(status);
  return (
    <>
      {/* Phones: vertical list */}
      <ol className="space-y-1 md:hidden">
        {STATUS_FLOW.map((s, i) => {
          const done = i <= current;
          return (
            <li key={s} className="relative flex items-center gap-3 py-1.5">
              {i < STATUS_FLOW.length - 1 && (
                <span
                  aria-hidden="true"
                  className={`absolute left-[17px] top-9 h-full w-0.5 ${i < current ? "bg-pp-blue dark:bg-dark-accent-blue" : "bg-pp-gray dark:bg-dark-border"}`}
                />
              )}
              <span
                className={`relative z-10 flex h-9 w-9 flex-none items-center justify-center rounded-full text-base ${
                  done ? "bg-pp-blue text-white dark:bg-dark-accent-blue" : "bg-pp-gray text-pp-deep/40 dark:bg-dark-border dark:text-dark-text-secondary"
                } ${i === current ? "ring-4 ring-pp-gold/60" : ""}`}
              >
                {STATUS_ICONS[s]}
              </span>
              <span className={`font-semibold ${i === current ? "text-pp-deep dark:text-dark-text" : done ? "text-pp-deep/80 dark:text-dark-text-secondary" : "text-pp-deep/40 dark:text-dark-text-secondary"}`}>
                {t(`shipping.status.${s}`)}
              </span>
            </li>
          );
        })}
      </ol>

      {/* Tablet / desktop: horizontal */}
      <div className="hidden overflow-x-auto pb-2 md:block">
        <ol className="flex min-w-[720px] items-start px-2">
          {STATUS_FLOW.map((s, i) => {
            const done = i <= current;
            return (
              <li key={s} className="relative flex flex-1 flex-col items-center text-center">
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className={`absolute right-1/2 top-5 h-1 w-full ${i <= current ? "bg-pp-blue dark:bg-dark-accent-blue" : "bg-pp-gray dark:bg-dark-border"}`}
                  />
                )}
                <span
                  className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-lg ${
                    done ? "bg-pp-blue text-white dark:bg-dark-accent-blue" : "bg-pp-gray text-pp-deep/40 dark:bg-dark-border dark:text-dark-text-secondary"
                  } ${i === current ? "ring-4 ring-pp-gold/60" : ""}`}
                >
                  {STATUS_ICONS[s]}
                </span>
                <span className={`mt-2 px-1 text-xs font-semibold ${done ? "text-pp-deep dark:text-dark-text" : "text-pp-deep/40 dark:text-dark-text-secondary"}`}>
                  {t(`shipping.status.${s}`)}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}

export function PaymentCard({ data, onPay, onCash, onCashCancel, paying, payError, banner, t }) {
  const p = data.payment;
  const pt = (k, o) => t(`shipping.track.payment.${k}`, o);
  const moncash = p.methods?.moncash;
  const [cashOpen, setCashOpen] = useState(false);
  const busy = Boolean(paying);

  const btn = "rounded-2xl px-6 py-4 text-left font-bold shadow-lg transition disabled:opacity-60 sm:min-w-[230px] sm:flex-1";

  return (
    <Card title={`💳 ${pt("title")}`}>
      {banner && (
        <p className={`mb-4 rounded-2xl p-3 text-sm font-semibold ${banner.ok ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300" : "bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200"}`}>
          {banner.text}
        </p>
      )}

      {p.quoteAmount === null ? (
        <p className="text-pp-deep/80 dark:text-dark-text-secondary">{pt("awaitingQuote")}</p>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label={pt("quote")} value={money(p.quoteAmount)} />
            <Stat label={pt("paid")} value={money(p.amountPaid)} />
            <Stat label={pt("balance")} value={money(p.balance)} />
          </div>

          {p.balance <= 0 ? (
            <p className="mt-5 text-center font-bold text-green-700 dark:text-green-400">{pt("paidFull")}</p>
          ) : p.canPay ? (
            <div className="mt-6">
              {p.cashPending && (
                <div className="mb-4 rounded-2xl border-2 border-dashed border-pp-gold bg-pp-gold/10 p-4 text-center">
                  <p className="font-bold text-pp-deep dark:text-dark-text">💵 {pt("cashPendingTitle")}</p>
                  <p className="mt-1 text-sm text-pp-deep/80 dark:text-dark-text-secondary">{pt("cashPendingDesc")}</p>
                  <button onClick={onCashCancel} className="mt-2 text-sm font-semibold text-pp-blue underline dark:text-dark-accent-blue">
                    {pt("cashChange")}
                  </button>
                </div>
              )}

              {cashOpen && !p.cashPending ? (
                <div className="rounded-2xl bg-pp-gray p-5 text-center dark:bg-dark-surface">
                  <p className="mb-1 text-lg font-bold text-pp-deep dark:text-dark-text">💵 {pt("cashTitle")}</p>
                  <p className="mb-4 text-sm text-pp-deep/80 dark:text-dark-text-secondary">{pt("cashDesc")}</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      disabled={busy}
                      onClick={async () => { await onCash(); setCashOpen(false); }}
                      className="rounded-full bg-pp-navy px-6 py-3 font-bold text-white transition hover:bg-pp-deep disabled:opacity-60 dark:bg-dark-accent-blue"
                    >
                      {paying === "cash" ? pt("paying") : pt("cashConfirm")}
                    </button>
                    <button onClick={() => setCashOpen(false)} className="rounded-full border-2 border-pp-navy px-6 py-3 font-semibold text-pp-navy dark:border-dark-accent-blue dark:text-dark-accent-blue">
                      {pt("cashBack")}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="mb-3 text-center text-sm font-semibold text-pp-deep/70 dark:text-dark-text-secondary">{pt("chooseMethod")}</p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    {p.methods?.card && (
                      <button onClick={() => onPay("card")} disabled={busy} className={`${btn} bg-pp-navy text-white hover:bg-pp-deep dark:bg-dark-accent-blue`}>
                        <span className="block text-lg">{paying === "card" ? pt("paying") : `💳 ${pt("payCard")}`}</span>
                        <span className="block text-sm font-semibold text-white/80">{money(p.balance)}</span>
                      </button>
                    )}
                    {p.methods?.paypal && (
                      <button onClick={() => onPay("paypal")} disabled={busy} className={`${btn} bg-[#0070ba] text-white hover:bg-[#005c99]`}>
                        <span className="block text-lg">{paying === "paypal" ? pt("paying") : `🅿️ ${pt("payPaypal")}`}</span>
                        <span className="block text-sm font-semibold text-white/80">{money(p.balance)}</span>
                      </button>
                    )}
                    {moncash && (
                      <button onClick={() => onPay("moncash")} disabled={busy} className={`${btn} bg-red-600 text-white hover:bg-red-700`}>
                        <span className="block text-lg">{paying === "moncash" ? pt("paying") : `📱 ${pt("payMoncash")}`}</span>
                        <span className="block text-sm font-semibold text-white/90">
                          {pt("moncashAmount", { amount: new Intl.NumberFormat("fr-FR").format(moncash.amountHtg), rate: moncash.rate })}
                        </span>
                      </button>
                    )}
                    {p.methods?.cash && !p.cashPending && (
                      <button onClick={() => setCashOpen(true)} disabled={busy} className={`${btn} bg-pp-gold text-pp-navy hover:brightness-110`}>
                        <span className="block text-lg">💵 {pt("payCash")}</span>
                        <span className="block text-sm font-semibold text-pp-navy/80">{money(p.balance)}</span>
                      </button>
                    )}
                  </div>
                  <p className="mt-3 text-center text-xs text-pp-deep/60 dark:text-dark-text-secondary">🔒 {pt("secureGeneric")}</p>
                </>
              )}
              {payError && <p className="mt-3 text-center font-semibold text-red-600">{payError}</p>}
            </div>
          ) : (
            <p className="mt-5 text-center text-sm text-pp-deep/70 dark:text-dark-text-secondary">{pt("notAvailable")}</p>
          )}
        </>
      )}
    </Card>
  );
}

export default function ShippingTrackPage() {
  const { t } = useTranslation();
  const fmt = useFormatters();
  const navigate = useNavigate();
  const { number } = useParams();
  const [params, setParams] = useSearchParams();

  const [input, setInput] = useState(number || "");
  const [data, setData] = useState(null);
  const [state, setState] = useState("idle"); // idle | loading | notfound | error
  const [paying, setPaying] = useState(null);
  const [payError, setPayError] = useState("");
  const [banner, setBanner] = useState(null);
  const recent = myShipments();

  const load = useCallback(async (n) => {
    setState("loading");
    try {
      const d = await api(`/api/shipments/track/${encodeURIComponent(n)}`);
      setData(d);
      setState("idle");
      rememberShipment(d.trackingNumber);
    } catch (err) {
      setData(null);
      setState(err.status === 404 ? "notfound" : "error");
    }
  }, []);

  // Load whenever the URL has a number; handle the return from Stripe first.
  useEffect(() => {
    if (!number) { setData(null); setState("idle"); return; }
    setInput(number);
    const sessionId = params.get("session_id");
    (async () => {
      if (params.get("paid") === "1" && sessionId) {
        setBanner({ ok: true, text: t("shipping.track.payment.confirming") });
        try {
          const r = await api(`/api/shipments/track/${encodeURIComponent(number)}/pay/confirm`, { method: "POST", body: { sessionId } });
          setBanner(r.success
            ? { ok: true, text: t("shipping.track.payment.success") }
            : { ok: false, text: t("shipping.track.payment.confirmFail") });
        } catch {
          setBanner({ ok: false, text: t("shipping.track.payment.confirmFail") });
        }
        setParams({}, { replace: true });
      } else if (params.get("paypal") === "1" && params.get("token")) {
        setBanner({ ok: true, text: t("shipping.track.payment.paypalConfirming") });
        try {
          const r = await api(`/api/shipments/track/${encodeURIComponent(number)}/pay/paypal/confirm`, { method: "POST", body: { orderId: params.get("token") } });
          setBanner(r.success
            ? { ok: true, text: t("shipping.track.payment.success") }
            : { ok: false, text: t("shipping.track.payment.paypalFail") });
        } catch {
          setBanner({ ok: false, text: t("shipping.track.payment.paypalFail") });
        }
        setParams({}, { replace: true });
      } else if (params.get("moncash") === "paid") {
        setBanner({ ok: true, text: t("shipping.track.payment.success") });
        setParams({}, { replace: true });
      } else if (params.get("canceled") === "1") {
        setBanner({ ok: false, text: t("shipping.track.payment.canceled") });
        setParams({}, { replace: true });
      }
      load(number);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [number]);

  const submit = (e) => {
    e.preventDefault();
    const n = normalizeTracking(input);
    if (!n) return;
    if (n === number) load(n);
    else navigate(`/shipping/track/${n}`);
  };

  const payBase = () => `/api/shipments/track/${encodeURIComponent(data.trackingNumber)}/pay`;

  const pay = async (method) => {
    setPaying(method);
    setPayError("");
    try {
      if (method === "moncash") {
        const { url, orderId, trackingNumber } = await api(`${payBase()}/moncash`, { method: "POST" });
        try {
          localStorage.setItem("pps_moncash_pending", JSON.stringify({ orderId, trackingNumber }));
        } catch {
          /* storage unavailable: MonCash also sends transactionId back */
        }
        window.location.href = url;
      } else {
        // card (Stripe) and PayPal both redirect to a hosted page and come back to this page
        const path = method === "paypal" ? `${payBase()}/paypal` : payBase();
        const { url } = await api(path, { method: "POST", body: { returnOrigin: window.location.origin } });
        window.location.href = url;
      }
    } catch {
      const key = { moncash: "moncashError", paypal: "paypalError" }[method] || "error";
      setPayError(t(`shipping.track.payment.${key}`));
      setPaying(null);
    }
  };

  const chooseCash = async () => {
    setPaying("cash");
    setPayError("");
    try {
      await api(`${payBase()}/cash`, { method: "POST" });
      await load(data.trackingNumber);
    } catch {
      setPayError(t("shipping.track.payment.cashError"));
    } finally {
      setPaying(null);
    }
  };

  const cancelCash = async () => {
    try {
      await api(`${payBase()}/cash/cancel`, { method: "POST" });
      await load(data.trackingNumber);
    } catch {
      setPayError(t("shipping.track.payment.cashError"));
    }
  };

  const openChat = () => window.dispatchEvent(new Event("pps:open-chat"));
  const tt = (k, o) => t(`shipping.track.${k}`, o);

  return (
    <div className="bg-pp-gray pb-20 dark:bg-dark-bg">
      <PageHeader icon="📍" title={tt("title")} subtitle={tt("subtitle")} />

      <div className="relative z-10 mx-auto -mt-8 max-w-3xl space-y-6 px-6">
        {/* Search */}
        <Card>
          <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={tt("placeholder")}
              aria-label={tt("title")}
              autoCapitalize="characters"
              className="min-w-0 flex-1 rounded-full border border-pp-gray bg-white px-6 py-3 font-mono text-lg uppercase tracking-widest text-pp-deep outline-none focus:border-pp-blue dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
            />
            <button className="rounded-full bg-pp-navy px-8 py-3 font-bold text-white transition hover:bg-pp-deep dark:bg-dark-accent-blue">
              {state === "loading" ? tt("searching") : tt("button")}
            </button>
          </form>

          {!number && recent.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold text-pp-deep/70 dark:text-dark-text-secondary">{tt("recent")}</p>
              <div className="flex flex-wrap gap-2">
                {recent.map((n) => (
                  <Link key={n} to={`/shipping/track/${n}`} className="rounded-full bg-pp-blue/10 px-4 py-1.5 font-mono text-sm font-bold text-pp-deep hover:bg-pp-blue/20 dark:bg-dark-accent-blue/15 dark:text-dark-text">
                    {n}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Card>

        {state === "notfound" && (
          <p role="alert" className="rounded-2xl bg-yellow-50 p-4 text-center font-semibold text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
            {tt("notFound")}
          </p>
        )}
        {state === "error" && (
          <p role="alert" className="rounded-2xl bg-red-50 p-4 text-center font-semibold text-red-700 dark:bg-red-900/20 dark:text-red-300">
            {tt("error")}
          </p>
        )}

        {data && (
          <>
            {/* Header */}
            <Card>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-pp-deep/60 dark:text-dark-text-secondary">{tt("hello", { name: data.senderFirstName })}</p>
                  <p className="font-mono text-3xl font-bold tracking-widest text-pp-navy dark:text-dark-text">{data.trackingNumber}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-2 rounded-full bg-pp-gold px-4 py-2 font-bold text-pp-navy">
                    {STATUS_ICONS[data.status] || "📦"} {t(`shipping.status.${data.status}`)}
                  </span>
                  <div>
                    <button onClick={() => load(data.trackingNumber)} className="mt-2 text-sm font-semibold text-pp-blue hover:underline dark:text-dark-accent-blue">
                      ↻ {tt("refresh")}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 rounded-2xl bg-pp-gray p-4 dark:bg-dark-surface sm:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-pp-deep/60 dark:text-dark-text-secondary">{tt("route")}</p>
                  <p className="font-semibold text-pp-deep dark:text-dark-text">
                    {data.route.originCity}{data.route.originState ? `, ${data.route.originState}` : ""} → {data.route.destinationCity}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-pp-deep/60 dark:text-dark-text-secondary">{tt("container")}</p>
                  <p className="font-semibold text-pp-deep dark:text-dark-text">
                    {data.containerQty > 1 ? `${data.containerQty} × ` : ""}{t(`shipping.options.containers.${data.containerSize}.label`)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-pp-deep/60 dark:text-dark-text-secondary">{tt("cargo")}</p>
                  <p className="font-semibold text-pp-deep dark:text-dark-text">{t(`shipping.options.cargo.${data.cargoType}`)}</p>
                </div>
              </div>
            </Card>

            {/* Pending / rejected */}
            {data.status === "submitted" && (
              <Card>
                <div className="text-center">
                  <div className="mb-3 text-5xl">⏳</div>
                  <h2 className="mb-2 text-xl font-bold text-pp-deep dark:text-dark-text">{tt("pendingTitle")}</h2>
                  <p className="text-pp-deep/70 dark:text-dark-text-secondary">{tt("pendingDesc")}</p>
                </div>
              </Card>
            )}
            {data.status === "rejected" && (
              <Card>
                <div className="text-center">
                  <div className="mb-3 text-5xl">⛔</div>
                  <h2 className="mb-2 text-xl font-bold text-pp-deep dark:text-dark-text">{tt("rejectedTitle")}</h2>
                  <p className="text-pp-deep/70 dark:text-dark-text-secondary">{tt("rejectedDesc")}</p>
                </div>
              </Card>
            )}

            {/* Approved: progress, stats, timeline, payment */}
            {data.approved && (
              <>
                {data.payment.cashPending && (
                  <Card>
                    <div className="text-center">
                      <div className="mb-2 text-4xl">⏳💵</div>
                      <h2 className="mb-1 text-lg font-bold text-pp-deep dark:text-dark-text">{tt("cashBanner.title")}</h2>
                      <p className="text-sm text-pp-deep/80 dark:text-dark-text-secondary">{tt("cashBanner.desc")}</p>
                    </div>
                  </Card>
                )}
                <Card>
                  <Progress status={data.status} t={t} />
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <Stat label={tt("daysSinceApproved")} value={tt("days", { count: data.daysSinceApproved ?? 0 })} />
                    {data.daysInTransit !== null && (
                      <Stat label={tt("daysInTransit")} value={tt("days", { count: data.daysInTransit })} />
                    )}
                    {data.deliveredAt ? (
                      <Stat label={tt("deliveredOn")} value={fmt.date(data.deliveredAt)} />
                    ) : data.estimatedDelivery ? (
                      <Stat
                        label={tt("estimatedDelivery")}
                        value={fmt.date(data.estimatedDelivery)}
                        sub={data.daysToDelivery !== null && data.daysToDelivery >= 0 ? `${tt("daysToDelivery")}: ${data.daysToDelivery}` : undefined}
                      />
                    ) : null}
                  </div>
                </Card>

                {data.publicNote && (
                  <Card>
                    <p className="mb-1 text-sm font-semibold text-pp-deep/60 dark:text-dark-text-secondary">💬 {tt("teamNote")}</p>
                    <p className="text-pp-deep dark:text-dark-text">{data.publicNote}</p>
                  </Card>
                )}

                <Card title={tt("timeline")}>
                  {data.events.length === 0 ? (
                    <p className="text-pp-deep/60 dark:text-dark-text-secondary">{tt("noEvents")}</p>
                  ) : (
                    <ol className="relative space-y-6 border-l-2 border-pp-gray pl-6 dark:border-dark-border">
                      {[...data.events].reverse().map((e, i) => (
                        <li key={`${e.status}-${e.occurredAt}-${i}`} className="relative">
                          <span className={`absolute -left-[37px] flex h-7 w-7 items-center justify-center rounded-full text-sm ${i === 0 ? "bg-pp-gold" : "bg-pp-gray dark:bg-dark-border"}`}>
                            {STATUS_ICONS[e.status] || "•"}
                          </span>
                          <p className="font-bold text-pp-deep dark:text-dark-text">{t(`shipping.status.${e.status}`)}</p>
                          <p className="text-sm text-pp-deep/60 dark:text-dark-text-secondary">
                            {fmt.dateTime(e.occurredAt)}{e.location ? ` · ${e.location}` : ""}
                          </p>
                          {e.note && <p className="mt-1 text-sm text-pp-deep/80 dark:text-dark-text-secondary">{e.note}</p>}
                        </li>
                      ))}
                    </ol>
                  )}
                </Card>

                <PaymentCard data={data} onPay={pay} onCash={chooseCash} onCashCancel={cancelCash} paying={paying} payError={payError} banner={banner} t={t} />
              </>
            )}

            {/* Help */}
            <Card title={tt("helpTitle")}>
              <div className="flex flex-wrap gap-3">
                <button onClick={openChat} className="rounded-full bg-pp-navy px-6 py-3 font-bold text-white transition hover:bg-pp-deep dark:bg-dark-accent-blue">
                  💬 {tt("helpChat")}
                </button>
                <Link to="/shipping/call" className="rounded-full border-2 border-pp-navy px-6 py-3 font-semibold text-pp-navy transition hover:bg-pp-navy hover:text-white dark:border-dark-accent-blue dark:text-dark-accent-blue">
                  📞 {tt("helpCall")}
                </Link>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
