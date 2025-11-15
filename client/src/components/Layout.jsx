import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Footer from "./Footer";
import ContactForm from "./ContactForm";

export default function Layout({ children }) {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isAdmin = location.pathname.startsWith('/admin');

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'ht' ? 'fr' : 'ht';
    i18n.changeLanguage(newLanguage);
  };

  if (isAdmin) {
    return children; // Admin pages handle their own layout
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Modern Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-pp-gray shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex items-center gap-2 font-bold text-2xl text-pp-navy">
              <span className="tracking-tight">Pi Pwòp</span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-pp-blue/10">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-pp-blue" aria-hidden="true">
                  <path d="M12 3l1.6 3.7L17 8.4l-3.4 1.7L12 14l-1.6-3.9L7 8.4l3.4-1.7L12 3z" fill="currentColor" />
                </svg>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-semibold transition-colors hover:text-pp-blue ${
                location.pathname === '/' ? 'text-pp-blue' : 'text-pp-deep'
              }`}
            >
              {t('nav.home')}
            </Link>
            <Link 
              to="/products" 
              className={`font-semibold transition-colors hover:text-pp-blue ${
                location.pathname === '/products' ? 'text-pp-blue' : 'text-pp-deep'
              }`}
            >
              {t('nav.products')}
            </Link>
            <Link 
              to="/services" 
              className={`font-semibold transition-colors hover:text-pp-blue ${
                location.pathname === '/services' ? 'text-pp-blue' : 'text-pp-deep'
              }`}
            >
              {t('nav.services')}
            </Link>
            <Link 
              to="/contact" 
              className={`font-semibold transition-colors hover:text-pp-blue ${
                location.pathname === '/contact' ? 'text-pp-blue' : 'text-pp-deep'
              }`}
            >
              {t('nav.contact')}
            </Link>
            <Link 
              to="/apply" 
              className={`font-semibold transition-colors hover:text-pp-blue ${
                location.pathname === '/apply' ? 'text-pp-blue' : 'text-pp-deep'
              }`}
            >
              Apply for Work
            </Link>
          </nav>

          {/* Language Toggle & CTA Button */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-3 py-2 rounded-full border border-pp-gray hover:border-pp-blue transition-colors"
            >
              <span className="text-sm font-semibold text-pp-deep">
                {i18n.language === 'ht' ? '🇭🇹 KR' : '🇫🇷 FR'}
              </span>
            </button>
            
            <Link
              to="/apply"
              className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              💼 Join Our Team
            </Link>
            
            <Link
              to="/services"
              className="bg-pp-blue text-white px-6 py-2 rounded-full font-semibold hover:bg-pp-deep transition-all duration-300 hover:scale-105 shadow-lg"
            >
              {t('nav.bookAppointment')}
            </Link>
            
            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-pp-deep">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation (hidden by default) */}
        <div className="md:hidden border-t border-pp-gray bg-white">
          <nav className="px-6 py-4 space-y-3">
            <Link to="/" className="block py-2 text-pp-deep font-semibold">{t('nav.home')}</Link>
            <Link to="/products" className="block py-2 text-pp-deep font-semibold">{t('nav.products')}</Link>
            <Link to="/services" className="block py-2 text-pp-deep font-semibold">{t('nav.services')}</Link>
            <Link to="/contact" className="block py-2 text-pp-deep font-semibold">{t('nav.contact')}</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Contact Section - Only show on non-contact pages */}
      {location.pathname !== '/contact' && (
        <section className="bg-gradient-to-br from-pp-blue via-pp-deep to-pp-navy py-20">
          <div className="relative mx-auto max-w-4xl px-6">
            <div className="text-center text-white mb-12">
              <h2 className="text-4xl font-bold mb-4">
                {t('contact.title')}
              </h2>
              <p className="text-xl text-white/90">
                {t('contact.description')}
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <ContactForm />
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}