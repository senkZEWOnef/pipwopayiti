import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation();

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

            <div className="grid grid-cols-2 gap-6">
              {[
                { title: t('homepage.cleaningProducts'), desc: "Detèjan, savon, ak plis ankò", icon: "🧴", count: "50+" },
                { title: t('homepage.pvcKitchen'), desc: "Modèn ak rezistan", icon: "🏠", count: "100+" },
                { title: t('homepage.closets'), desc: "Òganizasyon ak style", icon: "👔", count: "75+" },
                { title: t('homepage.delivery'), desc: "Nan tout Ayiti", icon: "🚚", count: "24/7" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <div className="text-2xl font-bold text-pp-sky">{item.count}</div>
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-white/80">{item.desc}</p>
                </div>
              ))}
            </div>
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

    </div>
  );
}