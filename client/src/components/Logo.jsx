export default function Logo({ size = "text-2xl" }) {
  return (
    <div className={`flex items-center gap-2 font-semibold ${size}`}>
      <span className="tracking-tight">Pi Pwòp</span>
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-pp-blue/10">
        {/* little sparkle icon */}
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 text-pp-blue"
          aria-hidden="true"
        >
          <path
            d="M12 3l1.6 3.7L17 8.4l-3.4 1.7L12 14l-1.6-3.9L7 8.4l3.4-1.7L12 3z"
            fill="currentColor"
          />
        </svg>
      </span>
    </div>
  );
}