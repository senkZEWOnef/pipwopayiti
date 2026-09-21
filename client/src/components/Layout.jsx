import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Footer from "./Footer";
import ContactForm from "./ContactForm";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";
import ChatWidget from "./ChatWidget";

export default function Layout({ children }) {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isAdmin = location.pathname.startsWith('/admin');
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu after navigating, and scroll each new page to the top
  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const NAV_LINKS = [
    { to: '/', label: t('nav.home') },
    { to: '/shipping', label: t('nav.shipping') },
    { to: '/store', label: t('nav.store') },
    { to: '/products', label: t('nav.products') },
    { to: '/services', label: t('nav.services') },
    { to: '/contact', label: t('nav.contact') },
    { to: '/apply', label: t('footer.applyWork') },
  ];
  const isActive = (to) => (to === '/' ? location.pathname === '/' : location.pathname.startsWith(to));

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'ht' ? 'fr' : 'ht';
    i18n.changeLanguage(newLanguage);
  };

  if (isAdmin) {
    return children; // Admin pages handle their own layout
  }

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-dark-bg transition-colors duration-300">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-pp-gray bg-white/95 shadow-sm backdrop-blur-md transition-colors duration-300 dark:border-dark-border dark:bg-dark-surface/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:px-6 sm:py-4">
          {/* Logo */}
          <Link to="/" className="flex min-w-0 items-center">
            <Logo size="text-lg sm:text-2xl" />
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-6 xl:gap-8 lg:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`whitespace-nowrap font-semibold transition-colors hover:text-pp-blue dark:hover:text-dark-accent-blue ${
                  isActive(l.to) ? 'text-pp-blue dark:text-dark-accent-blue' : 'text-pp-deep dark:text-dark-text'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Controls */}
          <div className="flex flex-none items-center gap-2 sm:gap-4">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <button
              onClick={toggleLanguage}
              aria-label="Language"
              className="flex items-center rounded-full border border-pp-gray px-3 py-2 transition-colors hover:border-pp-blue dark:border-dark-border dark:hover:border-dark-accent-blue"
            >
              <span className="whitespace-nowrap text-sm font-semibold text-pp-deep dark:text-dark-text">
                {i18n.language === 'ht' ? '🇭🇹 KR' : '🇫🇷 FR'}
              </span>
            </button>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menu"
              aria-expanded={menuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-full text-pp-deep hover:bg-pp-gray dark:text-dark-text dark:hover:bg-dark-card lg:hidden"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12M18 6L6 18" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu: opens as a panel over the page, closed by default */}
        {menuOpen && (
          <div className="absolute inset-x-0 top-full max-h-[calc(100vh-64px)] overflow-y-auto border-b border-pp-gray bg-white shadow-xl dark:border-dark-border dark:bg-dark-surface lg:hidden">
            <nav className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`block border-b border-pp-gray/60 py-3.5 text-lg font-semibold last:border-0 dark:border-dark-border ${
                    isActive(l.to) ? 'text-pp-blue dark:text-dark-accent-blue' : 'text-pp-deep dark:text-dark-text'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <div className="flex items-center justify-between py-4 sm:hidden">
                <span className="font-semibold text-pp-deep dark:text-dark-text">🌓</span>
                <ThemeToggle />
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>


      <Footer />
      <ChatWidget />
    </div>
  );
}