import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-pp-navy text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-pp-sky rounded-lg flex items-center justify-center">
                <span className="text-pp-navy font-bold">PP</span>
              </div>
              <div>
                <h3 className="font-bold text-xl">Pi Pwòp</h3>
                <p className="text-white/70 text-sm">{t('footer.tagline')}</p>
              </div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{t('footer.navigation')}</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-white/80 hover:text-pp-sky transition-colors">
                {t('nav.home')}
              </Link>
              <Link to="/products" className="block text-white/80 hover:text-pp-sky transition-colors">
                {t('nav.products')}
              </Link>
              <Link to="/services" className="block text-white/80 hover:text-pp-sky transition-colors">
                {t('nav.services')}
              </Link>
              <a href="#contact" className="block text-white/80 hover:text-pp-sky transition-colors">
                {t('nav.contact')}
              </a>
              <Link to="/apply" className="block text-white/80 hover:text-pp-sky transition-colors">
                💼 Apply for Work
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{t('footer.ourServices')}</h4>
            <div className="space-y-2 text-sm">
              <p className="text-white/80">{t('footer.cleaningProducts')}</p>
              <p className="text-white/80">{t('footer.pvcKitchen')}</p>
              <p className="text-white/80">{t('footer.closetsWardrobes')}</p>
              <p className="text-white/80">{t('footer.deliveryInstall')}</p>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{t('footer.contactUs')}</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <span className="text-pp-sky">📞</span>
                <span className="text-white/80">+509 1234 5678</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-pp-sky">📧</span>
                <span className="text-white/80">info@pipwop.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-pp-sky">📍</span>
                <span className="text-white/80">Port-au-Prince, Ayiti</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4 mt-6">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-pp-sky hover:text-pp-navy transition-all">
                <span>📘</span>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-pp-sky hover:text-pp-navy transition-all">
                <span>📱</span>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-pp-sky hover:text-pp-navy transition-all">
                <span>📧</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} Pi Pwòp. {t('footer.allRightsReserved')}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
              {t('footer.terms')}
            </a>
            <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
              {t('footer.privacy')}
            </a>
            <Link to="/admin" className="text-white/60 hover:text-white text-sm transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}