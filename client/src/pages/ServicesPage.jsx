import { useState } from "react";
import { useTranslation } from "react-i18next";

const SERVICES_HT = [
  {
    id: 1,
    title: "Sèvis Netwayaj Kay",
    price: "$50-150",
    duration: "2-4 èdtan",
    description: "Netwayaj konplè kay ou ak pwodwi ki bon",
    features: ["Kwizin ak banyè", "Sal ak chanm", "Pwodwi nou yo", "Pwofesyonèl ekspè"],
    icon: "🏠"
  },
  {
    id: 2,
    title: "Enstalasyon Kwizin PVC",
    price: "$800-2000",
    duration: "1-3 jou",
    description: "Enstalasyon kwizin modèn ak kabinè PVC",
    features: ["Mezirasyon gratis", "Kabinè PVC kalite wo", "Comptoir ak sink", "Garanti 2 an"],
    icon: "🔧"
  },
  {
    id: 3,
    title: "Òganizasyon Closet",
    price: "$200-600",
    duration: "4-8 èdtan",
    description: "Kreye sistèm òganizasyon nan closet ou",
    features: ["Analiz espas", "Sistèm òganizasyon", "Aksèswa modèn", "Konsèy pèsonèl"],
    icon: "👔"
  },
  {
    id: 4,
    title: "Livrezon ak Konfigirasyon",
    price: "$25-75",
    duration: "1-2 èdtan",
    description: "Livrezon ak konfigirasyon pwodwi yo lakay ou",
    features: ["Livrezon rapid", "Konfigirasyon konplè", "Test fonksyonalite", "Fòmasyon itilizatè"],
    icon: "🚚"
  }
];

const SERVICES_FR = [
  {
    id: 1,
    title: "Service de Nettoyage Domestique",
    price: "$50-150",
    duration: "2-4 heures",
    description: "Nettoyage complet de votre maison avec des produits de qualité",
    features: ["Cuisine et salle de bain", "Salon et chambres", "Nos produits", "Professionnels expérimentés"],
    icon: "🏠"
  },
  {
    id: 2,
    title: "Installation Cuisine PVC",
    price: "$800-2000",
    duration: "1-3 jours",
    description: "Installation de cuisine moderne avec armoires PVC",
    features: ["Mesure gratuite", "Armoires PVC qualité supérieure", "Comptoir et évier", "Garantie 2 ans"],
    icon: "🔧"
  },
  {
    id: 3,
    title: "Organisation de Placards",
    price: "$200-600",
    duration: "4-8 heures",
    description: "Créer un système d'organisation dans vos placards",
    features: ["Analyse de l'espace", "Système d'organisation", "Accessoires modernes", "Conseil personnalisé"],
    icon: "👔"
  },
  {
    id: 4,
    title: "Livraison et Installation",
    price: "$25-75",
    duration: "1-2 heures",
    description: "Livraison et installation de produits chez vous",
    features: ["Livraison rapide", "Installation complète", "Test de fonctionnalité", "Formation utilisateur"],
    icon: "🚚"
  }
];

export default function ServicesPage() {
  const { t, i18n } = useTranslation();
  
  // Get services based on current language
  const SERVICES = i18n.language === 'fr' ? SERVICES_FR : SERVICES_HT;
  
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    date: "",
    time: "",
    notes: ""
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Booking submitted:", { service: selectedService, ...formData });
    alert(t('booking.thankYou'));
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      date: "",
      time: "",
      notes: ""
    });
    setSelectedService(null);
  };

  return (
    <div className="min-h-screen bg-pp-gray dark:bg-dark-bg transition-colors duration-300">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-pp-navy to-pp-deep dark:from-dark-surface dark:to-dark-card text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{t('services.title')}</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            {t('services.subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
          {SERVICES.map(service => (
            <div key={service.id} className="bg-white dark:bg-dark-card rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-soft-card dark:shadow-dark-card hover:shadow-lg dark:hover:shadow-glow transition-all duration-300 border border-transparent dark:border-dark-border">
              
              {/* Service Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6">
                <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-0">
                  <div className="text-3xl sm:text-4xl">{service.icon}</div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-pp-deep dark:text-dark-text">{service.title}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-pp-deep/70 dark:text-dark-text-secondary mt-1 space-y-1 sm:space-y-0">
                      <span>💰 {service.price}</span>
                      <span>⏱️ {service.duration}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Description */}
              <p className="text-pp-deep/80 dark:text-dark-text-secondary mb-6">{service.description}</p>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-pp-blue/10 dark:bg-dark-accent-blue/20 rounded-full flex items-center justify-center">
                      <span className="text-pp-blue dark:text-dark-accent-blue text-xs">✓</span>
                    </div>
                    <span className="text-sm text-pp-deep dark:text-dark-text">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Book Button */}
              <button
                onClick={() => setSelectedService(service)}
                className="w-full bg-pp-blue dark:bg-dark-accent-blue text-white py-3 rounded-full font-semibold hover:bg-pp-deep dark:hover:bg-blue-600 transition-colors duration-300"
              >
                {t('services.bookAppointment')}
              </button>
            </div>
          ))}
        </div>

        {/* Booking Form Modal */}
        {selectedService && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-dark-card rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 max-w-2xl w-full max-h-[95vh] md:max-h-[90vh] overflow-y-auto border border-transparent dark:border-dark-border">
              
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-4 md:mb-6">
                <div className="flex-1 pr-4">
                  <h2 className="text-xl md:text-2xl font-bold text-pp-deep dark:text-dark-text">Pran Randevou</h2>
                  <p className="text-sm md:text-base text-pp-deep/70 dark:text-dark-text-secondary">{selectedService.title}</p>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="text-pp-deep/50 dark:text-dark-text-secondary hover:text-pp-deep dark:hover:text-dark-text text-xl md:text-2xl flex-shrink-0"
                >
                  ×
                </button>
              </div>

              {/* Booking Form */}
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                
                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-pp-deep dark:text-dark-text mb-2">
                      {t('booking.nameRequired')}
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={t('booking.namePlaceholder')}
                      className="w-full px-4 py-3 border border-pp-gray dark:border-dark-border rounded-xl bg-white dark:bg-dark-surface text-pp-deep dark:text-dark-text focus:ring-2 focus:ring-pp-blue dark:focus:ring-dark-accent-blue focus:border-transparent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-pp-deep dark:text-dark-text mb-2">
                      {t('booking.phoneRequired')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder={t('booking.phonePlaceholder')}
                      className="w-full px-4 py-3 border border-pp-gray dark:border-dark-border rounded-xl bg-white dark:bg-dark-surface text-pp-deep dark:text-dark-text focus:ring-2 focus:ring-pp-blue dark:focus:ring-dark-accent-blue focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-pp-deep dark:text-dark-text mb-2">
                    {t('booking.emailOptional')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t('booking.emailPlaceholder')}
                    className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-pp-deep dark:text-dark-text mb-2">
                    {t('booking.addressRequired')}
                  </label>
                  <textarea
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder={t('booking.addressPlaceholder')}
                    rows="3"
                    className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                  />
                </div>

                {/* Schedule */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-pp-deep dark:text-dark-text mb-2">
                      {t('booking.preferredDate')}
                    </label>
                    <input
                      type="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-pp-gray dark:border-dark-border rounded-xl bg-white dark:bg-dark-surface text-pp-deep dark:text-dark-text focus:ring-2 focus:ring-pp-blue dark:focus:ring-dark-accent-blue focus:border-transparent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-pp-deep dark:text-dark-text mb-2">
                      {t('booking.preferredTime')}
                    </label>
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-pp-gray dark:border-dark-border rounded-xl bg-white dark:bg-dark-surface text-pp-deep dark:text-dark-text focus:ring-2 focus:ring-pp-blue dark:focus:ring-dark-accent-blue focus:border-transparent transition-colors"
                    >
                      <option value="">{t('booking.timeSelectPlaceholder')}</option>
                      <option value="morning">{t('booking.timeMorning')}</option>
                      <option value="afternoon">{t('booking.timeAfternoon')}</option>
                      <option value="evening">{t('booking.timeEvening')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-pp-deep dark:text-dark-text mb-2">
                    {t('booking.additionalNotes')}
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder={t('booking.notesPlaceholder')}
                    rows="4"
                    className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                  />
                </div>

                {/* Service Summary */}
                <div className="bg-pp-gray dark:bg-dark-surface p-4 rounded-xl">
                  <h4 className="font-semibold text-pp-deep dark:text-dark-text mb-2">{t('booking.serviceSummary')}</h4>
                  <div className="text-sm space-y-1 text-pp-deep dark:text-dark-text">
                    <p><strong>{t('booking.service')}:</strong> {selectedService.title}</p>
                    <p><strong>{t('booking.estimatedPrice')}:</strong> {selectedService.price}</p>
                    <p><strong>{t('booking.duration')}:</strong> {selectedService.duration}</p>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    type="button"
                    onClick={() => setSelectedService(null)}
                    className="flex-1 border-2 border-pp-gray dark:border-dark-border text-pp-deep dark:text-dark-text py-3 rounded-full font-semibold hover:bg-pp-gray dark:hover:bg-dark-surface transition-colors duration-300"
                  >
{t('booking.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-pp-blue dark:bg-dark-accent-blue text-white py-3 rounded-full font-semibold hover:bg-pp-deep dark:hover:bg-blue-600 transition-colors duration-300"
                  >
{t('booking.confirmAppointment')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="bg-white dark:bg-dark-card rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-soft-card dark:shadow-dark-card border border-transparent dark:border-dark-border">
          <h2 className="text-xl md:text-2xl font-bold text-pp-deep dark:text-dark-text mb-6 text-center">
            {i18n.language === 'fr' ? 'Comment Nous Fonctionnons' : 'Kijan Nou Fonksyone'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-pp-blue/10 dark:bg-dark-accent-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl md:text-2xl">📞</span>
              </div>
              <h3 className="font-semibold text-pp-deep dark:text-dark-text mb-2">
                {i18n.language === 'fr' ? '1. Appelez-nous' : '1. Rele Nou'}
              </h3>
              <p className="text-sm text-pp-deep/70 dark:text-dark-text-secondary">
                {i18n.language === 'fr' ? 'Prenez rendez-vous avec notre équipe' : 'Pran randevou ak ekip nou an'}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-pp-blue/10 dark:bg-dark-accent-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl md:text-2xl">📋</span>
              </div>
              <h3 className="font-semibold text-pp-deep dark:text-dark-text mb-2">
                {i18n.language === 'fr' ? '2. Évaluation' : '2. Evalyasyon'}
              </h3>
              <p className="text-sm text-pp-deep/70 dark:text-dark-text-secondary">
                {i18n.language === 'fr' ? 'Nous venons évaluer et vous donner un devis' : 'Nou vin gade ak ba ou yon devis'}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-pp-blue/10 dark:bg-dark-accent-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl md:text-2xl">✨</span>
              </div>
              <h3 className="font-semibold text-pp-deep dark:text-dark-text mb-2">
                {i18n.language === 'fr' ? '3. Réalisation' : '3. Fè Travay La'}
              </h3>
              <p className="text-sm text-pp-deep/70 dark:text-dark-text-secondary">
                {i18n.language === 'fr' ? 'Nous effectuons le travail avec une qualité supérieure' : 'Nou fè travay la ak kalite segondè'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}