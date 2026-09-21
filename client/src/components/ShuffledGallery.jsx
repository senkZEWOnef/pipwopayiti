import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { pickRandom } from "../data/store";

// A strip of random showroom photos (different on every visit), each linking to the store.
export default function ShuffledGallery({ count = 4, className = "", dark = false }) {
  const { t } = useTranslation();
  const items = useMemo(() => pickRandom(count), [count]);

  return (
    <section className={`border-t border-pp-gray py-14 dark:border-dark-border ${dark ? "bg-pp-gray dark:bg-dark-surface" : "bg-white dark:bg-dark-bg"} ${className}`}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold text-pp-deep dark:text-dark-text">{t("store.galleryTitle")}</h2>
            <p className="text-pp-deep/70 dark:text-dark-text-secondary">{t("store.gallerySubtitle")}</p>
          </div>
          <Link to="/store" className="font-bold text-pp-blue hover:underline dark:text-dark-accent-blue">
            {t("store.viewAll")} →
          </Link>
        </div>

        <div className={`grid grid-cols-2 gap-4 ${count >= 4 ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
          {items.map((item) => (
            <Link
              key={item.id}
              to={`/store?item=${item.id}`}
              className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-pp-gray shadow-soft-card dark:bg-dark-card dark:shadow-dark-card"
            >
              <img
                src={item.image}
                alt={t(`store.items.${item.id}.name`)}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-10">
                <p className="text-xs font-semibold uppercase tracking-wide text-pp-gold">
                  {t(`store.categories.${item.category}`)}
                </p>
                <p className="text-sm font-bold text-white">{t(`store.items.${item.id}.name`)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
