import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Logo from "./Logo";
import { normalizeTracking } from "../data/shipping";

const PHONE_DISPLAY = "+509 1234 5678";
const PHONE_HREF = "tel:+50912345678";

export function ShippingHero({ showLogo = true }) {
  const { t } = useTranslation();

  const route = [
    { icon: "📦", label: t("shipping.routeSend") },
    { icon: "🚢", label: t("shipping.routeShip") },
    { icon: "🏠", label: t("shipping.routeReceive") },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-pp-navy via-pp-deep to-pp-blue dark:from-dark-bg dark:via-dark-surface dark:to-pp-deep text-white">
      {/* decorative container stripes + glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-pp-sky/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-pp-gold/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:repeating-linear-gradient(90deg,#fff_0,#fff_2px,transparent_2px,transparent_56px)]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:py-24 lg:grid-cols-[1.15fr_1fr]">
        <div className="space-y-7">
          {showLogo && <div className="hidden md:block"><Logo size="text-2xl md:text-3xl" variant="light" /></div>}

          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-semibold tracking-wide backdrop-blur-sm">
            🇺🇸 <span className="text-pp-gold">→</span> 🇭🇹 <span>{t("shipping.badge")}</span>
          </span>

          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            {t("shipping.heroTitle")}
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-white/85 md:text-xl">
            {t("shipping.heroDesc")}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/shipping/request"
              className="rounded-full bg-pp-gold px-8 py-4 text-lg font-bold text-pp-navy shadow-lg transition-all duration-300 hover:scale-105 hover:brightness-110"
            >
              {t("shipping.ctaQuote")}
            </Link>
            <Link
              to="/shipping/track"
              className="rounded-full border-2 border-white/80 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-pp-navy"
            >
              {t("shipping.ctaTrack")}
            </Link>
          </div>
        </div>

        {/* Route card */}
        <div className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md md:p-8">
          <div className="flex items-center justify-between text-center">
            <div>
              <div className="text-5xl md:text-6xl">🇺🇸</div>
              <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-white/80">
                {t("shipping.routeFrom")}
              </p>
            </div>
            <div className="mx-3 flex flex-1 items-center" aria-hidden="true">
              <div className="h-0.5 flex-1 border-t-2 border-dashed border-white/50" />
              <span className="mx-2 text-3xl md:text-4xl">🚢</span>
              <div className="h-0.5 flex-1 border-t-2 border-dashed border-white/50" />
            </div>
            <div>
              <div className="text-5xl md:text-6xl">🇭🇹</div>
              <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-white/80">
                {t("shipping.routeTo")}
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {route.map((r) => (
              <div key={r.label} className="rounded-2xl bg-white/10 px-2 py-4 text-center">
                <div className="text-2xl">{r.icon}</div>
                <p className="mt-1 text-xs font-semibold text-white/90 md:text-sm">{r.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ShippingServices() {
  const { t } = useTranslation();
  const items = t("shipping.services", { returnObjects: true });

  return (
    <section className="bg-white py-20 transition-colors duration-300 dark:bg-dark-bg">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="mb-4 text-4xl font-bold text-pp-deep dark:text-dark-text">
            {t("shipping.servicesTitle")}
          </h2>
          <p className="text-lg text-pp-deep/70 dark:text-dark-text-secondary">
            {t("shipping.servicesSubtitle")}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="group rounded-3xl border border-pp-gray bg-white p-7 shadow-soft-card transition-all duration-300 hover:-translate-y-1 hover:border-pp-blue/30 hover:shadow-glow dark:border-dark-border dark:bg-dark-card dark:shadow-dark-card"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-pp-blue/10 text-3xl transition-transform group-hover:scale-110 dark:bg-dark-accent-blue/20">
                {item.icon}
              </div>
              <h3 className="mb-2 text-lg font-bold text-pp-deep transition-colors group-hover:text-pp-blue dark:text-dark-text dark:group-hover:text-dark-accent-blue">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-pp-deep/70 dark:text-dark-text-secondary">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ShippingSteps() {
  const { t } = useTranslation();
  const steps = t("shipping.steps", { returnObjects: true });

  return (
    <section className="bg-pp-gray py-20 transition-colors duration-300 dark:bg-dark-surface">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="mb-4 text-4xl font-bold text-pp-deep dark:text-dark-text">
            {t("shipping.howTitle")}
          </h2>
          <p className="text-lg text-pp-deep/70 dark:text-dark-text-secondary">
            {t("shipping.howSubtitle")}
          </p>
        </div>

        <ol className="grid gap-6 md:grid-cols-4">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="relative rounded-3xl bg-white p-7 shadow-soft-card dark:bg-dark-card dark:shadow-dark-card"
            >
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-pp-navy text-lg font-bold text-white dark:bg-dark-accent-blue">
                {i + 1}
              </span>
              <h3 className="mb-2 text-lg font-bold text-pp-deep dark:text-dark-text">{step.title}</h3>
              <p className="text-sm leading-relaxed text-pp-deep/70 dark:text-dark-text-secondary">
                {step.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ShippingActions() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [number, setNumber] = useState("");

  const cards = [
    { key: "request", icon: "📦", to: "/shipping/request", accent: "bg-pp-gold text-pp-navy" },
    { key: "track", icon: "📍", to: "/shipping/track", accent: "bg-pp-navy text-white dark:bg-dark-accent-blue" },
    { key: "call", icon: "📞", to: "/shipping/call", accent: "bg-pp-blue text-white" },
  ];
  const features = t("shipping.features", { returnObjects: true });

  const goTrack = (e) => {
    e.preventDefault();
    const n = normalizeTracking(number);
    navigate(n ? `/shipping/track/${n}` : "/shipping/track");
  };

  return (
    <section className="bg-white py-16 transition-colors duration-300 dark:bg-dark-bg">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-10 text-center text-3xl font-bold text-pp-deep dark:text-dark-text md:text-4xl">
          {t("shipping.actionsTitle")}
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((c) => (
            <Link
              key={c.key}
              to={c.to}
              className="group flex flex-col rounded-3xl border border-pp-gray bg-white p-8 shadow-soft-card transition-all duration-300 hover:-translate-y-1 hover:shadow-glow dark:border-dark-border dark:bg-dark-card dark:shadow-dark-card"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-pp-blue/10 text-3xl dark:bg-dark-accent-blue/20">
                {c.icon}
              </div>
              <h3 className="mb-2 text-xl font-bold text-pp-deep dark:text-dark-text">
                {t(`shipping.actions.${c.key}.title`)}
              </h3>
              <p className="mb-6 flex-1 text-sm leading-relaxed text-pp-deep/70 dark:text-dark-text-secondary">
                {t(`shipping.actions.${c.key}.desc`)}
              </p>
              <span className={`inline-flex w-fit items-center gap-2 rounded-full px-5 py-2 text-sm font-bold transition-transform group-hover:translate-x-1 ${c.accent}`}>
                {t(`shipping.actions.${c.key}.cta`)} →
              </span>
            </Link>
          ))}
        </div>

        {/* Quick tracking */}
        <form
          onSubmit={goTrack}
          className="mx-auto mt-10 flex max-w-2xl flex-col items-stretch gap-3 rounded-3xl bg-pp-gray p-5 dark:bg-dark-surface sm:flex-row sm:items-center"
        >
          <label htmlFor="quick-track" className="font-semibold text-pp-deep dark:text-dark-text sm:whitespace-nowrap">
            {t("shipping.quickTrackTitle")}
          </label>
          <input
            id="quick-track"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder={t("shipping.track.placeholder")}
            className="min-w-0 flex-1 rounded-full border border-pp-gray bg-white px-5 py-3 font-mono uppercase tracking-wider text-pp-deep outline-none focus:border-pp-blue dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
          />
          <button className="rounded-full bg-pp-navy px-6 py-3 font-bold text-white transition hover:bg-pp-deep dark:bg-dark-accent-blue">
            {t("shipping.track.button")}
          </button>
        </form>

        <ul className="mt-8 flex flex-wrap justify-center gap-3">
          {features.map((f) => (
            <li key={f} className="rounded-full bg-pp-blue/10 px-4 py-2 text-sm font-semibold text-pp-deep dark:bg-dark-accent-blue/15 dark:text-dark-text">
              ✓ {f}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ShippingCTA() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-pp-navy py-16 text-white dark:bg-dark-surface">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t("shipping.ctaTitle")}</h2>
        <p className="mb-8 text-lg text-white/85">{t("shipping.ctaDesc")}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/shipping/request"
            className="rounded-full bg-pp-gold px-8 py-4 text-lg font-bold text-pp-navy shadow-lg transition-all duration-300 hover:scale-105 hover:brightness-110"
          >
            {t("shipping.ctaQuote")}
          </Link>
          <Link
            to="/shipping/call"
            className="rounded-full border-2 border-white/60 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:bg-white hover:text-pp-navy"
          >
            {t("shipping.ctaCall")}
          </Link>
          <a
            href={PHONE_HREF}
            className="rounded-full border-2 border-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:bg-white hover:text-pp-navy"
          >
            {t("shipping.ctaCall")} {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </section>
  );
}
