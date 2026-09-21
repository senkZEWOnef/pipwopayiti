import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../components/FormBits";
import { STORE_ITEMS, STORE_CATEGORIES, CATEGORY_TO_SERVICE, findItem } from "../data/store";

export default function StorePage() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const cat = STORE_CATEGORIES.includes(params.get("cat")) ? params.get("cat") : "all";
  const openId = findItem(params.get("item")) ? params.get("item") : null;

  const shown = useMemo(
    () => (cat === "all" ? STORE_ITEMS : STORE_ITEMS.filter((i) => i.category === cat)),
    [cat]
  );

  const setCat = (c) => setParams(c === "all" ? {} : { cat: c });
  const open = (id) => setParams((p) => { const n = new URLSearchParams(p); n.set("item", id); return n; });
  const close = useCallback(() => setParams((p) => { const n = new URLSearchParams(p); n.delete("item"); return n; }), [setParams]);

  // Lightbox: Esc closes, arrows move through the visible items, page doesn't scroll behind it
  const step = useCallback(
    (dir) => {
      const list = shown.some((i) => i.id === openId) ? shown : STORE_ITEMS;
      const idx = list.findIndex((i) => i.id === openId);
      const next = list[(idx + dir + list.length) % list.length];
      setParams((p) => { const n = new URLSearchParams(p); n.set("item", next.id); return n; }, { replace: true });
    },
    [shown, openId, setParams]
  );

  useEffect(() => {
    if (!openId) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [openId, close, step]);

  useEffect(() => { document.title = `${t("store.title")} — Pi Pwòp Shipping`; }, [t]);

  const current = openId ? findItem(openId) : null;
  const quoteLink = (item) =>
    `/contact?service=${CATEGORY_TO_SERVICE[item.category]}&item=${item.id}`;

  return (
    <div className="bg-pp-gray pb-20 dark:bg-dark-bg">
      <PageHeader icon="🛋️" title={t("store.title")} subtitle={t("store.subtitle")} />

      <div className="mx-auto max-w-7xl px-6 pt-8">
        {/* Category tabs */}
        <div className="mb-8 flex flex-wrap justify-center gap-3" role="tablist">
          {["all", ...STORE_CATEGORIES].map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={cat === c}
              onClick={() => setCat(c)}
              className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                cat === c
                  ? "bg-pp-navy text-white dark:bg-dark-accent-blue"
                  : "bg-white text-pp-deep shadow-soft-card hover:bg-pp-blue/10 dark:bg-dark-card dark:text-dark-text"
              }`}
            >
              {c === "all" ? t("store.all") : t(`store.categories.${c}`)}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {shown.map((item) => (
            <button
              key={item.id}
              onClick={() => open(item.id)}
              className="group overflow-hidden rounded-3xl bg-white text-left shadow-soft-card transition hover:-translate-y-1 hover:shadow-glow dark:bg-dark-card dark:shadow-dark-card"
            >
              <div className="aspect-[4/5] overflow-hidden bg-pp-gray dark:bg-dark-surface">
                <img
                  src={item.image}
                  alt={t(`store.items.${item.id}.name`)}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-pp-blue dark:text-dark-accent-blue">
                  {t(`store.categories.${item.category}`)}
                </p>
                <p className="font-bold text-pp-deep dark:text-dark-text">{t(`store.items.${item.id}.name`)}</p>
                <p className="mt-1 text-sm font-semibold text-pp-deep/60 dark:text-dark-text-secondary">{t("store.madeToOrder")}</p>
              </div>
            </button>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-pp-deep/60 dark:text-dark-text-secondary">{t("store.illustrationNote")}</p>

        <div className="mt-8 text-center">
          <Link to="/contact" className="rounded-full bg-pp-gold px-8 py-4 text-lg font-bold text-pp-navy shadow-lg transition hover:brightness-110">
            {t("store.customCta")}
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t(`store.items.${current.id}.name`)}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-3 md:p-8"
          onClick={close}
        >
          <div
            className="relative flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-dark-card md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex min-h-0 flex-1 items-center justify-center bg-black">
              <img
                src={current.image}
                alt={t(`store.items.${current.id}.name`)}
                className="max-h-[55vh] w-full object-contain md:max-h-[85vh]"
              />
            </div>

            <div className="flex flex-col justify-between gap-6 overflow-y-auto p-6 md:w-[340px]">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-pp-blue dark:text-dark-accent-blue">
                  {t(`store.categories.${current.category}`)}
                </p>
                <h2 className="mb-3 text-2xl font-bold text-pp-deep dark:text-dark-text">{t(`store.items.${current.id}.name`)}</h2>
                <p className="text-pp-deep/80 dark:text-dark-text-secondary">{t(`store.items.${current.id}.desc`)}</p>
                <p className="mt-3 text-sm font-semibold text-pp-deep/60 dark:text-dark-text-secondary">{t("store.madeToOrder")}</p>
              </div>
              <div className="space-y-3">
                <Link to={quoteLink(current)} className="block rounded-full bg-pp-gold px-6 py-3 text-center font-bold text-pp-navy transition hover:brightness-110">
                  {t("store.requestQuote")}
                </Link>
                <div className="flex gap-3">
                  <button onClick={() => step(-1)} className="flex-1 rounded-full border-2 border-pp-navy py-2 font-semibold text-pp-navy dark:border-dark-accent-blue dark:text-dark-accent-blue" aria-label={t("store.prev")}>←</button>
                  <button onClick={() => step(1)} className="flex-1 rounded-full border-2 border-pp-navy py-2 font-semibold text-pp-navy dark:border-dark-accent-blue dark:text-dark-accent-blue" aria-label={t("store.next")}>→</button>
                </div>
              </div>
            </div>

            <button onClick={close} aria-label={t("store.close")} className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-xl text-white hover:bg-black/80">
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
