import { useTranslation } from "react-i18next";
import ContactForm from "../components/ContactForm";

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pp-navy via-pp-deep to-pp-blue">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pp-sky rounded-full blur-2xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-pp-sky rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-28 h-28 bg-white rounded-full blur-2xl"></div>
      </div>
      
      <div className="relative mx-auto max-w-7xl px-6 py-20">
        
        {/* Page Header */}
        <div className="text-center text-white mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {t('nav.contact')}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Nou la pou reponn tout kesyon ou yo ak ede w ak pwojè w la
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left side - Contact Info */}
          <div className="text-white space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                {t('contact.title')}
              </h2>
              <p className="text-xl text-white/90 leading-relaxed mb-8">
                {t('contact.description')}
              </p>
            </div>
            
            {/* Contact Methods */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="flex items-center justify-center w-12 h-12 bg-pp-sky rounded-xl">
                  <span className="text-2xl">📱</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t('contact.phone')}</h3>
                  <p className="text-white/80 mb-2">+509 1234 5678</p>
                  <p className="text-sm text-white/70">Disponib 24/7 pou emerjensi</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="flex items-center justify-center w-12 h-12 bg-pp-sky rounded-xl">
                  <span className="text-2xl">📧</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t('contact.email')}</h3>
                  <p className="text-white/80 mb-2">info@pipwop.com</p>
                  <p className="text-sm text-white/70">Nou pral reponn nan 24 èdtan</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="flex items-center justify-center w-12 h-12 bg-pp-sky rounded-xl">
                  <span className="text-2xl">📍</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t('contact.whereWeAre')}</h3>
                  <p className="text-white/80 mb-2">{t('contact.location')}</p>
                  <p className="text-sm text-white/70">Nou sèvi tout Ayiti</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="flex items-center justify-center w-12 h-12 bg-pp-sky rounded-xl">
                  <span className="text-2xl">⏰</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Èdtan Travay</h3>
                  <p className="text-white/80 mb-1">Lendi - Vandredi: 8am - 6pm</p>
                  <p className="text-white/80 mb-2">Samdi: 9am - 4pm</p>
                  <p className="text-sm text-white/70">Emerjensi: 24/7</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Swiv nou sou</h3>
              <div className="flex space-x-4">
                <a href="#" className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-pp-sky hover:scale-110 transition-all duration-300">
                  <span className="text-2xl">📘</span>
                </a>
                <a href="#" className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-pp-sky hover:scale-110 transition-all duration-300">
                  <span className="text-2xl">📱</span>
                </a>
                <a href="#" className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-pp-sky hover:scale-110 transition-all duration-300">
                  <span className="text-2xl">📧</span>
                </a>
                <a href="#" className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-pp-sky hover:scale-110 transition-all duration-300">
                  <span className="text-2xl">📞</span>
                </a>
              </div>
            </div>
          </div>
          
          {/* Right side - Contact Form */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-pp-deep mb-2">
                {t('contact.startNow')}
              </h3>
              <p className="text-pp-deep/70">
                {t('contact.fillForm')}
              </p>
            </div>
            
            <ContactForm isMainPage={true} />
          </div>
        </div>
      </div>
    </div>
  );
}