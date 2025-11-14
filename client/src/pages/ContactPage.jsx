import { useTranslation } from "react-i18next";

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
            
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-pp-deep">
                    {t('contact.name')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      className="w-full rounded-xl border-2 border-pp-gray bg-white px-4 py-3 text-sm outline-none focus:border-pp-blue focus:ring-4 focus:ring-pp-blue/10 transition-all"
                      placeholder={t('booking.namePlaceholder')}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <span className="text-pp-deep/40">👤</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-pp-deep">
                    {t('contact.phone')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      className="w-full rounded-xl border-2 border-pp-gray bg-white px-4 py-3 text-sm outline-none focus:border-pp-blue focus:ring-4 focus:ring-pp-blue/10 transition-all"
                      placeholder={t('booking.phonePlaceholder')}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <span className="text-pp-deep/40">📱</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-pp-deep">
                  {t('contact.emailOptional')}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    className="w-full rounded-xl border-2 border-pp-gray bg-white px-4 py-3 text-sm outline-none focus:border-pp-blue focus:ring-4 focus:ring-pp-blue/10 transition-all"
                    placeholder={t('booking.emailPlaceholder')}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <span className="text-pp-deep/40">✉️</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-pp-deep">
                  {t('contact.interested')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select 
                    required
                    className="w-full rounded-xl border-2 border-pp-gray bg-white px-4 py-3 text-sm outline-none focus:border-pp-blue focus:ring-4 focus:ring-pp-blue/10 transition-all appearance-none"
                  >
                    <option value="">{t('contact.chooseService')}</option>
                    <option value="cleaning">{t('contact.cleaningProducts')}</option>
                    <option value="kitchen">{t('contact.pvcKitchen')}</option>
                    <option value="closets">{t('contact.closetsWardrobes')}</option>
                    <option value="delivery">{t('contact.deliveryInstall')}</option>
                    <option value="other">{t('contact.otherMultiple')}</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-pp-deep/40">⬇️</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-pp-deep">
                  {t('contact.message')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="5"
                  required
                  className="w-full rounded-xl border-2 border-pp-gray bg-white px-4 py-3 text-sm outline-none focus:border-pp-blue focus:ring-4 focus:ring-pp-blue/10 transition-all resize-none"
                  placeholder={t('contact.messagePlaceholder')}
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pp-blue to-pp-deep text-white py-4 rounded-xl font-semibold text-lg hover:from-pp-deep hover:to-pp-navy transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>{t('contact.sendMessage')}</span>
                  <span className="text-xl">🚀</span>
                </span>
              </button>
              
              <p className="text-center text-xs text-pp-deep/60">
                <span className="text-red-500">*</span> {t('contact.requiredFields')}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}