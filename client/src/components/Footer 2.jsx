import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-pp-gray bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between">
        <Logo size="text-lg" />
        <p className="text-xs text-pp-deep/60">
          © {new Date().getFullYear()} Pi Pwòp. Tout dwa rezève.
        </p>
      </div>
    </footer>
  );
}