import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProductCarousel from "../components/ProductCarousel";

export default function HomePage() {
  const { t, i18n } = useTranslation();

  return (
    <div>
      {/* Modern Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pp-navy via-pp-deep to-pp-blue">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative mx-auto max-w-7xl px-6 py-20 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                  {t('homepage.title')}
                  <span className="block text-pp-sky">{t('homepage.subtitle')}</span>
                </h1>
                <p className="text-xl text-white/90 leading-relaxed">
                  {t('homepage.description')}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="bg-pp-sky text-pp-navy px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  {t('homepage.viewProducts')}
                </Link>
                <Link
                  to="/services"
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-pp-navy transition-all duration-300"
                >
                  {t('homepage.ourServices')}
                </Link>
              </div>
            </div>

            <ProductCarousel />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-pp-gray">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-pp-deep mb-6">
              {t('homepage.whyChoose')}
            </h2>
            <p className="text-lg text-pp-deep/80">
              {t('homepage.whyChooseDesc')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: t('homepage.qualityFirst'),
                desc: t('homepage.qualityFirstDesc'),
                icon: "⭐"
              },
              {
                title: t('homepage.professionalInstall'),
                desc: t('homepage.professionalInstallDesc'),
                icon: "🔧"
              },
              {
                title: t('homepage.afterSalesService'),
                desc: t('homepage.afterSalesServiceDesc'),
                icon: "🛡️"
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl shadow-soft-card">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-pp-deep mb-3">{feature.title}</h3>
                <p className="text-pp-deep/70">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {i18n.language === 'fr' ? 'Rejoignez l\'équipe Pi Pwòp!' : 'Vin nan ekip Pi Pwòp la!'} 💼
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
              {i18n.language === 'fr' 
                ? 'Nous recrutons des professionnels qualifiés pour l\'installation de cuisines, le nettoyage, la livraison, et plus encore! Travaillez avec des horaires flexibles comme entrepreneur indépendant.'
                : 'Nou ap rekrite pwofesyonèl ak ekspètiz pou enstalasyon kwizin, netwayaj, livrezon, ak anpil lòt bagay! Travay ak orè fleksib kòm kontrakte endepandan.'
              }
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl mb-3">🔧</div>
                <h3 className="font-semibold mb-2">
                  {i18n.language === 'fr' ? 'Installateurs Cuisine' : 'Enstalè Kwizin'}
                </h3>
                <p className="text-green-100 text-sm">
                  {i18n.language === 'fr' ? 'Installation professionnelle' : 'Enstalasyon pwofesyonèl'}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl mb-3">🧹</div>
                <h3 className="font-semibold mb-2">
                  {i18n.language === 'fr' ? 'Nettoyeurs Professionnels' : 'Nètoyè Pwofesyonèl'}
                </h3>
                <p className="text-green-100 text-sm">
                  {i18n.language === 'fr' ? 'Services de nettoyage' : 'Sèvis netwayaj'}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl mb-3">🚚</div>
                <h3 className="font-semibold mb-2">
                  {i18n.language === 'fr' ? 'Chauffeurs Livraison' : 'Chofè Livrezon'}
                </h3>
                <p className="text-green-100 text-sm">
                  {i18n.language === 'fr' ? 'Livraison et installation' : 'Livrezon ak enstalasyon'}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/apply"
                className="bg-white text-green-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-green-50 hover:scale-105 transition-all duration-300 shadow-lg"
              >
                {i18n.language === 'fr' ? 'Postuler Maintenant!' : 'Aplike Kounye a!'} 🚀
              </Link>
              <a
                href="tel:+50912345678"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-green-600 transition-all duration-300"
              >
                {i18n.language === 'fr' ? 'Appelez-nous:' : 'Rele nou:'} +509 1234 5678
              </a>
            </div>
            
            <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 max-w-2xl mx-auto">
              <h4 className="font-semibold mb-2">
                ✨ {i18n.language === 'fr' ? 'Pourquoi Travailler Avec Nous?' : 'Poukisa Travay Ak Nou?'}
              </h4>
              <div className="grid md:grid-cols-2 gap-4 text-green-100 text-sm">
                <div>• {i18n.language === 'fr' ? 'Horaire flexible' : 'Orè travay fleksib'}</div>
                <div>• {i18n.language === 'fr' ? 'Paiements bihebdomadaires' : 'Yo peye ou chak 2 semèn'}</div>
                <div>• {i18n.language === 'fr' ? 'Entrepreneur indépendant' : 'Kontrakte endepandan'}</div>
                <div>• {i18n.language === 'fr' ? 'Opportunités de travail régulières' : 'Opòtinite travay regilyè'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}