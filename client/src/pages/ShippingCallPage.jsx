import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../api";
import { Field, Card, PageHeader, inputClass } from "../components/FormBits";

const TIMES = ["anytime", "morning", "afternoon", "evening"];
const TOPICS = ["quote", "tracking", "payment", "other"];
const EMPTY = { name: "", phone: "", email: "", preferredTime: "anytime", topic: "quote", message: "" };

export default function ShippingCallPage() {
  const { t, i18n } = useTranslation();
  const [f, setF] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const c = (k) => t(`shipping.call.${k}`);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!f.name.trim() || !f.phone.trim()) return setError(c("missing"));
    setBusy(true);
    try {
      await api("/api/callbacks", { method: "POST", body: { ...f, language: i18n.language === "fr" ? "fr" : "ht" } });
      setDone(true);
    } catch (err) {
      setError(err.status === 429 ? t("shipping.request.errors.tooMany") : c("error"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-pp-gray pb-20 dark:bg-dark-bg">
      <PageHeader icon="📞" title={c("title")} subtitle={c("subtitle")} />
      <div className="mx-auto -mt-8 max-w-2xl px-6">
        {done ? (
          <Card>
            <div className="text-center">
              <div className="mb-3 text-5xl">✅</div>
              <h2 className="mb-2 text-2xl font-bold text-pp-deep dark:text-dark-text">{c("successTitle")}</h2>
              <p className="mb-6 text-pp-deep/70 dark:text-dark-text-secondary">{c("successDesc")}</p>
              <div className="flex flex-wrap justify-center gap-3">
                <button onClick={() => { setF(EMPTY); setDone(false); }} className="rounded-full border-2 border-pp-navy px-6 py-3 font-semibold text-pp-navy transition hover:bg-pp-navy hover:text-white dark:border-dark-accent-blue dark:text-dark-accent-blue">
                  {c("another")}
                </button>
                <Link to="/shipping" className="rounded-full bg-pp-navy px-6 py-3 font-bold text-white transition hover:bg-pp-deep dark:bg-dark-accent-blue">
                  {t("nav.shipping")} →
                </Link>
              </div>
            </div>
          </Card>
        ) : (
          <form onSubmit={submit}>
            <Card>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={c("name")} required>
                  <input required className={inputClass} value={f.name} onChange={set("name")} autoComplete="name" />
                </Field>
                <Field label={c("phone")} required>
                  <input required type="tel" className={inputClass} value={f.phone} onChange={set("phone")} autoComplete="tel" />
                </Field>
                <Field label={c("email")} className="sm:col-span-2">
                  <input type="email" className={inputClass} value={f.email} onChange={set("email")} autoComplete="email" />
                </Field>
                <Field label={c("preferredTime")}>
                  <select className={inputClass} value={f.preferredTime} onChange={set("preferredTime")}>
                    {TIMES.map((k) => <option key={k} value={k}>{t(`shipping.call.times.${k}`)}</option>)}
                  </select>
                </Field>
                <Field label={c("topic")}>
                  <select className={inputClass} value={f.topic} onChange={set("topic")}>
                    {TOPICS.map((k) => <option key={k} value={k}>{t(`shipping.call.topics.${k}`)}</option>)}
                  </select>
                </Field>
                <Field label={c("message")} className="sm:col-span-2">
                  <textarea rows={3} className={inputClass} value={f.message} onChange={set("message")} />
                </Field>
              </div>

              {error && <p role="alert" className="mt-5 rounded-2xl bg-red-50 p-3 text-center font-semibold text-red-700 dark:bg-red-900/20 dark:text-red-300">{error}</p>}

              <button disabled={busy} className="mt-6 w-full rounded-full bg-pp-gold px-8 py-4 text-lg font-bold text-pp-navy shadow-lg transition hover:brightness-110 disabled:opacity-60">
                {busy ? c("submitting") : `📞 ${c("submit")}`}
              </button>
            </Card>
          </form>
        )}
      </div>
    </div>
  );
}
