export const inputClass =
  "w-full rounded-xl border border-pp-gray bg-white px-4 py-3 text-pp-deep outline-none transition focus:border-pp-blue focus:ring-2 focus:ring-pp-blue/20 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text dark:focus:border-dark-accent-blue";

export function Field({ label, required, optionalLabel, hint, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-semibold text-pp-deep dark:text-dark-text">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
        {!required && optionalLabel && (
          <span className="ml-2 text-xs font-normal text-pp-deep/50 dark:text-dark-text-secondary">({optionalLabel})</span>
        )}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-pp-deep/60 dark:text-dark-text-secondary">{hint}</span>}
    </label>
  );
}

export function Card({ title, children }) {
  return (
    <section className="rounded-3xl border border-pp-gray bg-white p-6 shadow-soft-card dark:border-dark-border dark:bg-dark-card dark:shadow-dark-card md:p-8">
      {title && <h2 className="mb-6 text-xl font-bold text-pp-deep dark:text-dark-text">{title}</h2>}
      {children}
    </section>
  );
}

export function PageHeader({ icon, title, subtitle }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-pp-navy via-pp-deep to-pp-blue py-14 text-white dark:from-dark-bg dark:via-dark-surface dark:to-pp-deep">
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-pp-sky/20 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <div className="mb-3 text-5xl">{icon}</div>
        <h1 className="mb-3 text-3xl font-bold md:text-5xl">{title}</h1>
        {subtitle && <p className="text-lg text-white/85">{subtitle}</p>}
      </div>
    </section>
  );
}
