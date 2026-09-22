import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import ShuffledGallery from "../components/ShuffledGallery";
import Logo from "../components/Logo";
import { API_BASE } from "../api";

const HERO_IMAGES = [
  { src: "/store/k2.webp", item: "k2", className: "col-span-2 aspect-[16/10]" },
  { src: "/store/v3.webp", item: "v3", className: "aspect-square" },
  { src: "/store/c2.webp", item: "c2", className: "aspect-square" },
];

function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-white dark:bg-dark-bg">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-pp-sky/20 blur-3xl dark:bg-dark-accent-blue/10" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-pp-gold/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-14 lg:grid-cols-2 lg:py-20">
        <div>
          <Logo size="text-xl sm:text-2xl" />
          <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-pp-gray bg-pp-gray/60 px-4 py-1.5 text-sm font-semibold text-pp-deep dark:border-dark-border dark:bg-dark-surface dark:text-dark-text">
            {t("homepage.heroChip")}
          </span>

          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-pp-navy dark:text-dark-text sm:text-5xl lg:text-6xl">
            {t("homepage.heroTitle")}
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-pp-deep/75 dark:text-dark-text-secondary">
            {t("homepage.heroSubtitle")}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/store"
              className="rounded-full bg-pp-navy px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-pp-deep dark:bg-dark-accent-blue"
            >
              {t("homepage.heroCtaPrimary")}
            </Link>
            <Link
              to="/contact"
              className="rounded-full border-2 border-pp-navy px-8 py-4 text-lg font-semibold text-pp-navy transition-all duration-300 hover:scale-105 hover:bg-pp-navy hover:text-white dark:border-dark-accent-blue dark:text-dark-accent-blue"
            >
              {t("homepage.heroCtaSecondary")}
            </Link>
          </div>
        </div>

        {/* Photo collage */}
        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            {HERO_IMAGES.map((img) => (
              <Link
                key={img.item}
                to={`/store?item=${img.item}`}
                className={`group overflow-hidden rounded-3xl bg-pp-gray shadow-soft-card dark:bg-dark-card dark:shadow-dark-card ${img.className}`}
              >
                <img
                  src={img.src}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
            ))}
          </div>

          <div className="absolute -left-4 bottom-6 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-xl dark:bg-dark-card sm:-left-8">
            <span className="text-2xl">🛋️</span>
            <span className="text-sm font-bold text-pp-deep dark:text-dark-text">{t("homepage.heroBadge1")}</span>
          </div>
          <div className="absolute -right-2 -top-4 flex items-center gap-2 rounded-2xl bg-pp-navy px-4 py-3 text-white shadow-xl dark:bg-dark-accent-blue sm:-right-6">
            <span className="text-lg">🚢</span>
            <span className="text-sm font-bold">{t("homepage.heroBadge2")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pillars() {
  const { t } = useTranslation();
  const items = [
    { key: "shipping", icon: "🚢", to: "/shipping", accent: "bg-pp-blue/10 dark:bg-dark-accent-blue/15" },
    { key: "store", icon: "🛋️", to: "/store", accent: "bg-pp-gold/15" },
    { key: "products", icon: "🧴", to: "/products", accent: "bg-green-500/10" },
  ];

  return (
    <section className="bg-pp-gray py-16 dark:bg-dark-surface">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-pp-deep dark:text-dark-text sm:text-4xl">{t("homepage.pillarsTitle")}</h2>
          <p className="mt-2 text-pp-deep/70 dark:text-dark-text-secondary">{t("homepage.pillarsSubtitle")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {items.map((it) => (
            <Link
              key={it.key}
              to={it.to}
              className="group flex flex-col rounded-3xl bg-white p-8 shadow-soft-card transition-all duration-300 hover:-translate-y-1 hover:shadow-glow dark:bg-dark-card dark:shadow-dark-card"
            >
              <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${it.accent}`}>{it.icon}</div>
              <h3 className="mb-2 text-xl font-bold text-pp-deep dark:text-dark-text">{t(`homepage.pillars.${it.key}.title`)}</h3>
              <p className="mb-6 flex-1 text-sm leading-relaxed text-pp-deep/70 dark:text-dark-text-secondary">
                {t(`homepage.pillars.${it.key}.desc`)}
              </p>
              <span className="inline-flex w-fit items-center gap-2 font-bold text-pp-blue transition-transform group-hover:translate-x-1 dark:text-dark-accent-blue">
                {t(`homepage.pillars.${it.key}.cta`)} →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function PopularCategories({ counts }) {
  const { t, i18n } = useTranslation();
  const fr = i18n.language === "fr";
  const cats = [
    { key: "cleaning", icon: "🧽", label: fr ? "Nettoyage" : "Netwayaj", count: counts.cleaning },
    { key: "kitchen", icon: "🏠", label: fr ? "Cuisines" : "Kwizin", count: counts.kitchen },
    { key: "organization", icon: "👔", label: fr ? "Organisation" : "Òganizasyon", count: counts.organization },
    { key: "electronics", icon: "⚡", label: fr ? "Électronique" : "Elektwonik", count: counts.electronics },
  ];

  return (
    <section className="bg-white py-16 dark:bg-dark-bg">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold text-pp-deep dark:text-dark-text">{t("homepage.categoriesTitle")}</h2>
            <p className="text-pp-deep/70 dark:text-dark-text-secondary">{t("homepage.categoriesSubtitle")}</p>
          </div>
          <Link to="/products" className="font-bold text-pp-blue hover:underline dark:text-dark-accent-blue">
            {t("homepage.categoriesCta")} →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {cats.map((c) => (
            <Link
              key={c.key}
              to="/products"
              className="group flex flex-col items-center gap-2 rounded-2xl border border-pp-gray bg-white p-5 text-center shadow-soft-card transition hover:-translate-y-0.5 hover:border-pp-blue/30 dark:border-dark-border dark:bg-dark-card dark:shadow-dark-card"
            >
              <span className="text-3xl transition-transform group-hover:scale-110">{c.icon}</span>
              <span className="font-bold text-pp-deep dark:text-dark-text">{c.label}</span>
              <span className="text-xs font-semibold text-pp-deep/50 dark:text-dark-text-secondary">
                {c.count} {fr ? "produits" : "pwodwi"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyChoose() {
  const { t } = useTranslation();
  const features = [
    { title: t("homepage.qualityFirst"), desc: t("homepage.qualityFirstDesc"), icon: "⭐", accent: "from-yellow-400 to-orange-500" },
    { title: t("homepage.professionalInstall"), desc: t("homepage.professionalInstallDesc"), icon: "🔧", accent: "from-blue-400 to-blue-600" },
    { title: t("homepage.afterSalesService"), desc: t("homepage.afterSalesServiceDesc"), icon: "🛡️", accent: "from-green-400 to-green-600" },
  ];

  return (
    <section className="bg-pp-gray py-20 transition-colors duration-300 dark:bg-dark-surface">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-6 text-4xl font-bold text-pp-deep dark:text-dark-text">{t("homepage.whyChoose")}</h2>
          <p className="text-lg leading-relaxed text-pp-deep/80 dark:text-dark-text-secondary">{t("homepage.whyChooseDesc")}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((f, idx) => (
            <div
              key={f.title}
              className="group rounded-3xl border border-transparent bg-white p-8 shadow-soft-card transition-all duration-500 hover:-translate-y-1 hover:border-pp-blue/20 hover:shadow-glow dark:border-dark-border dark:bg-dark-card dark:shadow-dark-card dark:hover:border-dark-accent-blue/20"
            >
              <div className="relative mb-6">
                <div className={`absolute -inset-4 rounded-full bg-gradient-to-r ${f.accent} opacity-20 blur transition-opacity group-hover:opacity-30`} />
                <div className="relative text-4xl">{f.icon}</div>
              </div>
              <h3 className="mb-3 text-xl font-bold text-pp-deep transition-colors group-hover:text-pp-blue dark:text-dark-text dark:group-hover:text-dark-accent-blue">
                {f.title}
              </h3>
              <p className="leading-relaxed text-pp-deep/70 dark:text-dark-text-secondary">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function JoinTeam() {
  const { i18n } = useTranslation();
  const fr = i18n.language === "fr";
  const roles = [
    { icon: "🔧", title: fr ? "Installateurs Cuisine" : "Enstalè Kwizin", desc: fr ? "Installation professionnelle" : "Enstalasyon pwofesyonèl" },
    { icon: "🧹", title: fr ? "Nettoyeurs Professionnels" : "Nètoyè Pwofesyonèl", desc: fr ? "Services de nettoyage" : "Sèvis netwayaj" },
    { icon: "🚚", title: fr ? "Chauffeurs Livraison" : "Chofè Livrezon", desc: fr ? "Livraison et installation" : "Livrezon ak enstalasyon" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-pp-navy via-pp-deep to-pp-blue py-20 text-white dark:from-dark-surface dark:via-dark-card dark:to-dark-bg">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h2 className="mb-6 text-3xl font-bold md:text-4xl">
          {fr ? "Rejoignez l'équipe Pi Pwòp Shipping !" : "Vin nan ekip Pi Pwòp Shipping la!"} 💼
        </h2>
        <p className="mx-auto mb-8 max-w-3xl text-xl text-white/90">
          {fr
            ? "Nous recrutons des professionnels qualifiés pour l'installation de cuisines, le nettoyage, la livraison, et plus encore ! Travaillez avec des horaires flexibles comme entrepreneur indépendant."
            : "Nou ap rekrite pwofesyonèl ak ekspètiz pou enstalasyon kwizin, netwayaj, livrezon, ak anpil lòt bagay! Travay ak orè fleksib kòm kontrakte endepandan."}
        </p>

        <div className="mb-12 grid gap-8 md:grid-cols-3">
          {roles.map((r) => (
            <div key={r.title} className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-3 text-3xl">{r.icon}</div>
              <h3 className="mb-2 font-semibold">{r.title}</h3>
              <p className="text-sm text-white/80">{r.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/apply"
            className="rounded-full bg-white px-8 py-4 text-lg font-bold text-pp-navy shadow-lg transition-all duration-300 hover:scale-105 hover:bg-pp-sky"
          >
            {fr ? "Postuler Maintenant !" : "Aplike Kounye a!"} 🚀
          </Link>
          <a
            href="tel:+50912345678"
            className="rounded-full border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white hover:text-pp-navy"
          >
            {fr ? "Appelez-nous :" : "Rele nou:"} +509 1234 5678
          </a>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [productCounts, setProductCounts] = useState({ cleaning: 0, kitchen: 0, organization: 0, electronics: 0 });

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${API_BASE}/api/products`);
        if (response.ok) {
          const products = await response.json();
          setProductCounts({
            cleaning: products.filter((p) => p.category === "cleaning").length,
            kitchen: products.filter((p) => p.category === "kitchen").length,
            organization: products.filter((p) => p.category === "organization").length,
            electronics: products.filter((p) => p.category === "electronics").length,
          });
        }
      } catch (error) {
        console.error("Error fetching product counts:", error);
      }
    })();
  }, []);

  return (
    <div>
      <Hero />
      <Pillars />
      <PopularCategories counts={productCounts} />
      <ShuffledGallery count={4} />
      <WhyChoose />
      <JoinTeam />
    </div>
  );
}
