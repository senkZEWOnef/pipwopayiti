import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import ProductCarousel from "../components/ProductCarousel";

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const [productCounts, setProductCounts] = useState({
    cleaning: 0,
    kitchen: 0,
    organization: 0,
    electronics: 0
  });

  useEffect(() => {
    fetchProductCounts();
  }, []);

  const fetchProductCounts = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/products');
      if (response.ok) {
        const products = await response.json();
        const counts = {
          cleaning: products.filter(p => p.category === 'cleaning').length,
          kitchen: products.filter(p => p.category === 'kitchen').length,
          organization: products.filter(p => p.category === 'organization').length,
          electronics: products.filter(p => p.category === 'electronics').length
        };
        setProductCounts(counts);
      }
    } catch (error) {
      console.error('Error fetching product counts:', error);
    }
  };

  return (
    <div>
      {/* Clean, Modern Hero Section */}
      <section className="relative bg-white dark:bg-dark-bg overflow-hidden pt-8 pb-16">
        {/* Minimal background pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-pp-gray/30 to-transparent dark:from-dark-surface/30"></div>
          <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gradient-to-t from-pp-sky/5 to-transparent dark:from-dark-accent-blue/5"></div>
        </div>

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="space-y-8">
            {/* Main heading */}
            <div className="space-y-4">
              <h1 className="text-6xl lg:text-8xl font-bold text-pp-navy dark:text-dark-text tracking-tight leading-none">
                {t('homepage.title')}
              </h1>
              <h2 className="text-2xl lg:text-3xl font-light text-pp-deep/80 dark:text-dark-text-secondary">
                {t('homepage.subtitle')}
              </h2>
            </div>
            
            {/* Description */}
            <p className="text-lg text-pp-deep/70 dark:text-dark-text-secondary leading-relaxed max-w-xl mx-auto">
              {t('homepage.description')}
            </p>

            {/* Call-to-action buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/products"
                className="bg-pp-navy dark:bg-dark-accent-blue text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-pp-deep dark:hover:bg-blue-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {t('homepage.viewProducts')}
              </Link>
              <Link
                to="/services"
                className="border-2 border-pp-navy dark:border-dark-accent-blue text-pp-navy dark:text-dark-accent-blue px-8 py-4 rounded-full font-semibold text-lg hover:bg-pp-navy dark:hover:bg-dark-accent-blue hover:text-white transition-all duration-300 hover:scale-105"
              >
                {t('homepage.ourServices')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Products Preview Section */}
      <section className="py-20 bg-pp-gray dark:bg-dark-surface transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-pp-deep dark:text-dark-text mb-4">
              {t('nav.products')}
            </h2>
            <p className="text-lg text-pp-deep/70 dark:text-dark-text-secondary max-w-2xl mx-auto">
              {i18n.language === 'fr' 
                ? 'Découvrez notre gamme de produits de qualité pour votre maison et votre entreprise'
                : 'Dekouvri pwodwi kalite nou yo pou kay ou ak biznis ou'
              }
            </p>
          </div>

          {/* Product Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Cleaning Products */}
            <div 
              className="group bg-white dark:bg-dark-card rounded-2xl p-6 shadow-soft-card dark:shadow-dark-card hover:shadow-glow dark:hover:shadow-glow transition-all duration-300 hover:scale-105 cursor-pointer border border-transparent dark:border-dark-border"
              onClick={() => window.location.href = '/products'}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  🧽
                </div>
                <h3 className="text-xl font-semibold text-pp-deep dark:text-dark-text mb-2">
                  {i18n.language === 'fr' ? 'Nettoyage' : 'Netwayaj'}
                </h3>
                <p className="text-sm text-pp-deep/70 dark:text-dark-text-secondary mb-4">
                  {i18n.language === 'fr' ? 'Détergents et produits de nettoyage professionnels' : 'Detèjan ak pwodwi netwayaj pwofesyonèl'}
                </p>
                <div className="text-pp-blue dark:text-dark-accent-blue font-semibold text-sm">
                  {i18n.language === 'fr' ? `${productCounts.cleaning} produits disponibles` : `${productCounts.cleaning} pwodwi disponib`}
                </div>
              </div>
            </div>

            {/* Kitchen Solutions */}
            <div 
              className="group bg-white dark:bg-dark-card rounded-2xl p-6 shadow-soft-card dark:shadow-dark-card hover:shadow-glow dark:hover:shadow-glow transition-all duration-300 hover:scale-105 cursor-pointer border border-transparent dark:border-dark-border"
              onClick={() => window.location.href = '/products'}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  🏠
                </div>
                <h3 className="text-xl font-semibold text-pp-deep dark:text-dark-text mb-2">
                  {i18n.language === 'fr' ? 'Cuisines' : 'Kwizin'}
                </h3>
                <p className="text-sm text-pp-deep/70 dark:text-dark-text-secondary mb-4">
                  {i18n.language === 'fr' ? 'Cuisines PVC modernes et vanités' : 'Kwizin PVC modèn ak vanity'}
                </p>
                <div className="text-pp-blue dark:text-dark-accent-blue font-semibold text-sm">
                  {i18n.language === 'fr' ? `${productCounts.kitchen} produits disponibles` : `${productCounts.kitchen} pwodwi disponib`}
                </div>
              </div>
            </div>

            {/* Storage Solutions */}
            <div 
              className="group bg-white dark:bg-dark-card rounded-2xl p-6 shadow-soft-card dark:shadow-dark-card hover:shadow-glow dark:hover:shadow-glow transition-all duration-300 hover:scale-105 cursor-pointer border border-transparent dark:border-dark-border"
              onClick={() => window.location.href = '/products'}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  👔
                </div>
                <h3 className="text-xl font-semibold text-pp-deep dark:text-dark-text mb-2">
                  {i18n.language === 'fr' ? 'Organisation' : 'Òganizasyon'}
                </h3>
                <p className="text-sm text-pp-deep/70 dark:text-dark-text-secondary mb-4">
                  {i18n.language === 'fr' ? 'Placards et solutions de rangement' : 'Closet ak solisyon depo'}
                </p>
                <div className="text-pp-blue dark:text-dark-accent-blue font-semibold text-sm">
                  {i18n.language === 'fr' ? `${productCounts.organization} produits disponibles` : `${productCounts.organization} pwodwi disponib`}
                </div>
              </div>
            </div>

            {/* Electronics & Solar */}
            <div 
              className="group bg-white dark:bg-dark-card rounded-2xl p-6 shadow-soft-card dark:shadow-dark-card hover:shadow-glow dark:hover:shadow-glow transition-all duration-300 hover:scale-105 cursor-pointer border border-transparent dark:border-dark-border relative"
              onClick={() => window.location.href = '/products'}
            >
              <div className="absolute top-3 right-3">
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  {i18n.language === 'fr' ? 'NOUVEAU' : 'NOUVO'}
                </span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  ⚡
                </div>
                <h3 className="text-xl font-semibold text-pp-deep dark:text-dark-text mb-2">
                  {i18n.language === 'fr' ? 'Électronique' : 'Elektwonik'}
                </h3>
                <p className="text-sm text-pp-deep/70 dark:text-dark-text-secondary mb-4">
                  {i18n.language === 'fr' ? 'Solutions solaires et électroniques' : 'Solisyon solè ak elektwonik'}
                </p>
                <div className="text-pp-blue dark:text-dark-accent-blue font-semibold text-sm">
                  {i18n.language === 'fr' ? `${productCounts.electronics} produits disponibles` : `${productCounts.electronics} pwodwi disponib`}
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 bg-pp-navy dark:bg-dark-accent-blue text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-pp-deep dark:hover:bg-blue-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span>{i18n.language === 'fr' ? 'Voir tous les produits' : 'Gade tout pwodwi yo'}</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-pp-gray dark:bg-dark-surface transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-pp-deep dark:text-dark-text mb-6">
              {t('homepage.whyChoose')}
            </h2>
            <p className="text-lg text-pp-deep/80 dark:text-dark-text-secondary leading-relaxed">
              {t('homepage.whyChooseDesc')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: t('homepage.qualityFirst'),
                desc: t('homepage.qualityFirstDesc'),
                icon: "⭐",
                accent: "from-yellow-400 to-orange-500"
              },
              {
                title: t('homepage.professionalInstall'),
                desc: t('homepage.professionalInstallDesc'),
                icon: "🔧",
                accent: "from-blue-400 to-blue-600"
              },
              {
                title: t('homepage.afterSalesService'),
                desc: t('homepage.afterSalesServiceDesc'),
                icon: "🛡️",
                accent: "from-green-400 to-green-600"
              }
            ].map((feature, idx) => (
              <div key={idx} className="group bg-white dark:bg-dark-card p-8 rounded-3xl shadow-soft-card dark:shadow-dark-card hover:shadow-glow dark:hover:shadow-glow transition-all duration-500 hover:scale-105 border border-transparent dark:border-dark-border hover:border-pp-blue/20 dark:hover:border-dark-accent-blue/20 animate-slide-up" style={{animationDelay: `${idx * 0.1}s`}}>
                <div className="relative mb-6">
                  <div className={`absolute -inset-4 bg-gradient-to-r ${feature.accent} opacity-20 rounded-full blur group-hover:opacity-30 transition-opacity`}></div>
                  <div className="relative text-4xl">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-pp-deep dark:text-dark-text mb-3 group-hover:text-pp-blue dark:group-hover:text-dark-accent-blue transition-colors">{feature.title}</h3>
                <p className="text-pp-deep/70 dark:text-dark-text-secondary leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team Section */}
      <section className="py-20 bg-gradient-to-br from-pp-navy via-pp-deep to-pp-blue dark:from-dark-surface dark:via-dark-card dark:to-dark-bg text-white relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {i18n.language === 'fr' ? 'Rejoignez l\'équipe Pi Pwòp!' : 'Vin nan ekip Pi Pwòp la!'} 💼
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
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
                <p className="text-white/80 text-sm">
                  {i18n.language === 'fr' ? 'Installation professionnelle' : 'Enstalasyon pwofesyonèl'}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl mb-3">🧹</div>
                <h3 className="font-semibold mb-2">
                  {i18n.language === 'fr' ? 'Nettoyeurs Professionnels' : 'Nètoyè Pwofesyonèl'}
                </h3>
                <p className="text-white/80 text-sm">
                  {i18n.language === 'fr' ? 'Services de nettoyage' : 'Sèvis netwayaj'}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl mb-3">🚚</div>
                <h3 className="font-semibold mb-2">
                  {i18n.language === 'fr' ? 'Chauffeurs Livraison' : 'Chofè Livrezon'}
                </h3>
                <p className="text-white/80 text-sm">
                  {i18n.language === 'fr' ? 'Livraison et installation' : 'Livrezon ak enstalasyon'}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/apply"
                className="bg-white text-pp-navy px-8 py-4 rounded-full font-bold text-lg hover:bg-pp-sky hover:scale-105 transition-all duration-300 shadow-lg"
              >
                {i18n.language === 'fr' ? 'Postuler Maintenant!' : 'Aplike Kounye a!'} 🚀
              </Link>
              <a
                href="tel:+50912345678"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-pp-navy transition-all duration-300"
              >
                {i18n.language === 'fr' ? 'Appelez-nous:' : 'Rele nou:'} +509 1234 5678
              </a>
            </div>
            
            <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 max-w-2xl mx-auto">
              <h4 className="font-semibold mb-2">
                ✨ {i18n.language === 'fr' ? 'Pourquoi Travailler Avec Nous?' : 'Poukisa Travay Ak Nou?'}
              </h4>
              <div className="grid md:grid-cols-2 gap-4 text-white/80 text-sm">
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