export default function SectionCard({ title, subtitle, children }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold text-pp-deep">{title}</h2>
        {subtitle && (
          <p className="text-xs text-pp-deep/60 max-w-sm text-right">
            {subtitle}
          </p>
        )}
      </div>
      <div className="grid gap-6 md:grid-cols-3">{children}</div>
    </section>
  );
}