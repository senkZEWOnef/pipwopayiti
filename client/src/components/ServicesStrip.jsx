import { useEffect, useState } from "react";

const ICONS = {
  "cleaning-products": "🧼",
  "kitchens-vanities": "🍳",
  closets: "🚪",
  "delivery-install": "🚚"
};

export default function ServicesStrip() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/services")
      .then((res) => res.json())
      .then(setServices)
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="border-y border-pp-gray bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4 text-xs md:text-sm">
        {services.map((s) => (
          <div
            key={s.id}
            className="flex items-center gap-2 rounded-full bg-pp-gray px-3 py-1"
          >
            <span className="text-lg">{ICONS[s.slug] || "✨"}</span>
            <span className="font-medium text-pp-deep">{s.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}