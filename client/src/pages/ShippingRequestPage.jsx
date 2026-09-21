import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../api";
import { Field, Card, PageHeader, inputClass } from "../components/FormBits";
import {
  CONTAINER_SIZES,
  CARGO_TYPES,
  US_STATES,
  HAITI_CITIES,
  rememberShipment,
} from "../data/shipping";

const OTHER = "__other__";

const EMPTY = {
  originCity: "",
  originState: "",
  pickupNeeded: false,
  originAddress: "",
  destinationCity: "",
  destinationOther: "",
  homeDelivery: false,
  destinationAddress: "",
  containerSize: "",
  containerQty: 1,
  cargoType: "",
  cargoDescription: "",
  estWeightLbs: "",
  declaredValueUsd: "",
  preferredShipDate: "",
  notes: "",
  recipientName: "",
  recipientPhone: "",
  senderName: "",
  senderPhone: "",
  senderEmail: "",
  confirm: false,
};

export default function ShippingRequestPage() {
  const { t, i18n } = useTranslation();
  const [f, setF] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [tracking, setTracking] = useState(null);
  const [copied, setCopied] = useState(false);

  const set = (k) => (e) =>
    setF((prev) => ({ ...prev, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const destinationCity = f.destinationCity === OTHER ? f.destinationOther.trim() : f.destinationCity;
      const { trackingNumber } = await api("/api/shipments", {
        method: "POST",
        body: { ...f, destinationCity, language: i18n.language === "fr" ? "fr" : "ht" },
      });
      rememberShipment(trackingNumber);
      setTracking(trackingNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const key =
        err.status === 429 ? "tooMany" : err.code === "missing_fields" ? "missing" : err.code === "invalid_email" ? "email" : "generic";
      setError(t(`shipping.request.errors.${key}`));
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(tracking);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  // ---------- success screen ----------
  if (tracking) {
    return (
      <div className="bg-pp-gray pb-20 dark:bg-dark-bg">
        <PageHeader icon="🎉" title={t("shipping.request.success.title")} />
        <div className="relative z-10 mx-auto -mt-8 max-w-2xl space-y-6 px-6">
          <Card>
            <p className="mb-2 text-center text-sm font-semibold uppercase tracking-wider text-pp-deep/60 dark:text-dark-text-secondary">
              {t("shipping.request.success.numberLabel")}
            </p>
            <p className="mb-4 select-all text-center font-mono text-4xl font-bold tracking-widest text-pp-navy dark:text-dark-text md:text-5xl">
              {tracking}
            </p>
            <div className="flex justify-center">
              <button
                onClick={copy}
                className="rounded-full bg-pp-gold px-6 py-2 text-sm font-bold text-pp-navy transition hover:brightness-110"
              >
                {copied ? t("shipping.request.success.copied") : `📋 ${t("shipping.request.success.copy")}`}
              </button>
            </div>
            <p className="mt-5 rounded-2xl bg-pp-gold/15 p-4 text-center text-sm font-semibold text-pp-deep dark:text-dark-text">
              {t("shipping.request.success.saveIt")}
            </p>
          </Card>

          <Card title={t("shipping.request.success.nextTitle")}>
            <ol className="space-y-3 text-pp-deep/80 dark:text-dark-text-secondary">
              {["next1", "next2", "next3"].map((k, i) => (
                <li key={k} className="flex gap-3">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-pp-navy text-sm font-bold text-white dark:bg-dark-accent-blue">
                    {i + 1}
                  </span>
                  <span>{t(`shipping.request.success.${k}`)}</span>
                </li>
              ))}
            </ol>
          </Card>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to={`/shipping/track/${tracking}`}
              className="rounded-full bg-pp-navy px-8 py-3 font-bold text-white transition hover:bg-pp-deep dark:bg-dark-accent-blue"
            >
              {t("shipping.request.success.trackNow")} →
            </Link>
            <button
              onClick={() => { setTracking(null); setF(EMPTY); }}
              className="rounded-full border-2 border-pp-navy px-8 py-3 font-semibold text-pp-navy transition hover:bg-pp-navy hover:text-white dark:border-dark-accent-blue dark:text-dark-accent-blue"
            >
              {t("shipping.request.success.another")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const opt = t("shipping.request.optional");
  const q = (k) => t(`shipping.request.${k}`);

  return (
    <div className="bg-pp-gray pb-20 dark:bg-dark-bg">
      <PageHeader icon="📦" title={q("title")} subtitle={q("subtitle")} />

      <form onSubmit={submit} className="relative z-10 mx-auto -mt-8 max-w-3xl space-y-6 px-6">
        {/* 1. Route */}
        <Card title={q("sections.route")}>
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label={q("originCity")} required className="sm:col-span-2">
              <input required className={inputClass} value={f.originCity} onChange={set("originCity")} autoComplete="address-level2" />
            </Field>
            <Field label={q("originState")} optionalLabel={opt}>
              <select className={inputClass} value={f.originState} onChange={set("originState")}>
                <option value="">{q("select")}</option>
                {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <label className="mt-5 flex items-start gap-3 text-sm text-pp-deep dark:text-dark-text">
            <input type="checkbox" className="mt-1 h-4 w-4 accent-pp-blue" checked={f.pickupNeeded} onChange={set("pickupNeeded")} />
            <span>{q("pickupNeeded")}</span>
          </label>
          {f.pickupNeeded && (
            <Field label={q("originAddress")} required className="mt-4">
              <input required className={inputClass} value={f.originAddress} onChange={set("originAddress")} autoComplete="street-address" />
            </Field>
          )}

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label={q("destinationCity")} required>
              <select required className={inputClass} value={f.destinationCity} onChange={set("destinationCity")}>
                <option value="">{q("select")}</option>
                {HAITI_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                <option value={OTHER}>{q("destinationOther")}…</option>
              </select>
            </Field>
            {f.destinationCity === OTHER && (
              <Field label={q("destinationOther")} required>
                <input required className={inputClass} placeholder={q("destinationOtherPlaceholder")} value={f.destinationOther} onChange={set("destinationOther")} />
              </Field>
            )}
          </div>

          <label className="mt-5 flex items-start gap-3 text-sm text-pp-deep dark:text-dark-text">
            <input type="checkbox" className="mt-1 h-4 w-4 accent-pp-blue" checked={f.homeDelivery} onChange={set("homeDelivery")} />
            <span>{q("homeDelivery")}</span>
          </label>
          {f.homeDelivery && (
            <Field label={q("destinationAddress")} required className="mt-4">
              <input required className={inputClass} value={f.destinationAddress} onChange={set("destinationAddress")} />
            </Field>
          )}
        </Card>

        {/* 2. Container & cargo */}
        <Card title={q("sections.cargo")}>
          <p className="mb-2 text-sm font-semibold text-pp-deep dark:text-dark-text">
            {q("containerSize")} <span className="text-red-500">*</span>
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {CONTAINER_SIZES.map((size) => {
              const active = f.containerSize === size;
              return (
                <label
                  key={size}
                  className={`cursor-pointer rounded-2xl border-2 p-4 transition ${
                    active
                      ? "border-pp-blue bg-pp-blue/5 dark:border-dark-accent-blue dark:bg-dark-accent-blue/10"
                      : "border-pp-gray hover:border-pp-blue/40 dark:border-dark-border"
                  }`}
                >
                  <input
                    type="radio"
                    name="containerSize"
                    value={size}
                    required
                    checked={active}
                    onChange={set("containerSize")}
                    className="sr-only"
                  />
                  <span className="block font-bold text-pp-deep dark:text-dark-text">
                    {t(`shipping.options.containers.${size}.label`)}
                  </span>
                  <span className="mt-1 block text-xs text-pp-deep/60 dark:text-dark-text-secondary">
                    {t(`shipping.options.containers.${size}.hint`)}
                  </span>
                </label>
              );
            })}
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label={q("containerQty")}>
              <input type="number" min="1" max="20" className={inputClass} value={f.containerQty} onChange={set("containerQty")} />
            </Field>
            <Field label={q("cargoType")} required>
              <select required className={inputClass} value={f.cargoType} onChange={set("cargoType")}>
                <option value="">{q("select")}</option>
                {CARGO_TYPES.map((c) => <option key={c} value={c}>{t(`shipping.options.cargo.${c}`)}</option>)}
              </select>
            </Field>
          </div>

          <Field label={q("cargoDescription")} required className="mt-5">
            <textarea required rows={3} className={inputClass} placeholder={q("cargoDescriptionPlaceholder")} value={f.cargoDescription} onChange={set("cargoDescription")} />
          </Field>

          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <Field label={q("estWeight")} optionalLabel={opt}>
              <input type="number" min="0" inputMode="numeric" className={inputClass} value={f.estWeightLbs} onChange={set("estWeightLbs")} />
            </Field>
            <Field label={q("declaredValue")} optionalLabel={opt}>
              <input type="number" min="0" inputMode="decimal" className={inputClass} value={f.declaredValueUsd} onChange={set("declaredValueUsd")} />
            </Field>
            <Field label={q("preferredShipDate")} optionalLabel={opt}>
              <input type="date" className={inputClass} value={f.preferredShipDate} onChange={set("preferredShipDate")} />
            </Field>
          </div>

          <Field label={q("notes")} optionalLabel={opt} className="mt-5">
            <textarea rows={2} className={inputClass} placeholder={q("notesPlaceholder")} value={f.notes} onChange={set("notes")} />
          </Field>
        </Card>

        {/* 3. Recipient */}
        <Card title={q("sections.recipient")}>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={q("recipientName")} required>
              <input required className={inputClass} value={f.recipientName} onChange={set("recipientName")} />
            </Field>
            <Field label={q("recipientPhone")} required>
              <input required type="tel" className={inputClass} placeholder="+509 ..." value={f.recipientPhone} onChange={set("recipientPhone")} />
            </Field>
          </div>
        </Card>

        {/* 4. Sender */}
        <Card title={q("sections.sender")}>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={q("senderName")} required>
              <input required className={inputClass} value={f.senderName} onChange={set("senderName")} autoComplete="name" />
            </Field>
            <Field label={q("senderPhone")} required>
              <input required type="tel" className={inputClass} value={f.senderPhone} onChange={set("senderPhone")} autoComplete="tel" />
            </Field>
            <Field label={q("senderEmail")} optionalLabel={opt} className="sm:col-span-2">
              <input type="email" className={inputClass} value={f.senderEmail} onChange={set("senderEmail")} autoComplete="email" />
            </Field>
          </div>

          <label className="mt-6 flex items-start gap-3 text-sm text-pp-deep dark:text-dark-text">
            <input required type="checkbox" className="mt-1 h-4 w-4 accent-pp-blue" checked={f.confirm} onChange={set("confirm")} />
            <span>{q("confirm")}</span>
          </label>
        </Card>

        {error && (
          <p role="alert" className="rounded-2xl bg-red-50 p-4 text-center font-semibold text-red-700 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </p>
        )}

        <button
          disabled={busy}
          className="w-full rounded-full bg-pp-gold px-8 py-4 text-lg font-bold text-pp-navy shadow-lg transition hover:brightness-110 disabled:opacity-60"
        >
          {busy ? q("submitting") : `${q("submit")} →`}
        </button>
      </form>
    </div>
  );
}
