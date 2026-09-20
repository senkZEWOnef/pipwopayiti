export function ContainerIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="10" rx="1.5" />
      <path d="M8 5v10M12 5v10M16 5v10" />
      <path d="M2 19c1.7 0 1.7-1 3.3-1s1.7 1 3.4 1 1.7-1 3.3-1 1.7 1 3.3 1 1.7-1 3.4-1 1.7 1 3.3 1" />
    </svg>
  );
}

// variant="light" is for use on dark/navy backgrounds
export default function Logo({ size = "text-2xl", variant = "default" }) {
  const light = variant === "light";
  return (
    <div className={`flex items-center gap-2.5 font-bold ${size}`}>
      <span
        className={`inline-flex h-[1.4em] w-[1.4em] items-center justify-center rounded-lg ${
          light ? "bg-white/15 text-white" : "bg-pp-navy text-white dark:bg-dark-accent-blue"
        }`}
      >
        <ContainerIcon className="h-[0.9em] w-[0.9em]" />
      </span>
      <span className="flex items-baseline gap-1.5 leading-none tracking-tight">
        <span className={light ? "text-white" : "text-pp-navy dark:text-dark-text"}>Pi Pwòp</span>
        <span className={light ? "text-pp-gold" : "text-pp-blue dark:text-dark-accent-blue"}>Shipping</span>
      </span>
    </div>
  );
}
