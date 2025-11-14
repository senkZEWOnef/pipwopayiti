import Logo from "./Logo";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-pp-gray">
      {/* soft shapes */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-pp-sky/40 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-pp-blue/30 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl space-y-6">
          <Logo size="text-3xl md:text-4xl" />
          <p className="text-lg text-pp-deep/80">
            Pwodwi netwayaj, kwizin ak closets PVC, livrezon pare pou enstalasyon.
            <span className="block">
              Pi Pwòp lakay ou, depi boutèy savon rive nan dènye kabinè a.
            </span>
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#products"
              className="rounded-full bg-pp-blue px-6 py-2 text-sm font-semibold text-white shadow-soft-card hover:bg-pp-deep transition"
            >
              Gade pwodwi yo
            </a>
            <a
              href="#contact"
              className="rounded-full border border-pp-blue px-6 py-2 text-sm font-semibold text-pp-blue hover:bg-pp-blue/5 transition"
            >
              Mande yon devis
            </a>
          </div>
        </div>

        {/* Icon cluster like your banner */}
        <div className="grid w-full max-w-md grid-cols-2 gap-4 md:max-w-sm">
          {[
            { label: "Pwodwi netwayaj", icon: "🧴" },
            { label: "Kwizin PVC", icon: "🍽️" },
            { label: "Closets", icon: "👚" },
            { label: "Livrezon", icon: "🚚" }
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center rounded-2xl bg-white/80 p-4 shadow-soft-card"
            >
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-pp-sky/40 text-2xl">
                <span>{item.icon}</span>
              </div>
              <p className="text-xs font-semibold text-pp-deep text-center">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}