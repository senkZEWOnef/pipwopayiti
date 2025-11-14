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
    <div className="min-h-screen bg-pp-gray">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-pp-navy to-pp-deep text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">{t('services.title')}</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {SERVICES.map(service => (
            <div key={service.id} className="bg-white rounded-3xl p-8 shadow-soft-card hover:shadow-lg transition-all duration-300">
              
              {/* Service Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{service.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-pp-deep">{service.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-pp-deep/70 mt-1">
                      <span>💰 {service.price}</span>
                      <span>⏱️ {service.duration}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Description */}
              <p className="text-pp-deep/80 mb-6">{service.description}</p>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-pp-blue/10 rounded-full flex items-center justify-center">
                      <span className="text-pp-blue text-xs">✓</span>
                    </div>
                    <span className="text-sm text-pp-deep">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Book Button */}
              <button
                onClick={() => setSelectedService(service)}
                className="w-full bg-pp-blue text-white py-3 rounded-full font-semibold hover:bg-pp-deep transition-colors duration-300"
              >
                {t('services.bookAppointment')}
              </button>
            </div>
          ))}
        </div>

        {/* Booking Form Modal */}
        {selectedService && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-pp-deep">Pran Randevou</h2>
                  <p className="text-pp-deep/70">{selectedService.title}</p>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="text-pp-deep/50 hover:text-pp-deep text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Booking Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Personal Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-pp-deep mb-2">
                      Non ou *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Jean Baptiste"
                      className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-pp-deep mb-2">
                      Telefòn *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+509 1234 5678"
                      className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-pp-deep mb-2">
                    Email (opsyonèl)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="jean@example.com"
                    className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-pp-deep mb-2">
                    Adrès *
                  </label>
                  <textarea
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Adrès konplè ak kominotè ak vil"
                    rows="3"
                    className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                  />
                </div>

                {/* Schedule */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-pp-deep mb-2">
                      Dat Prefere *
                    </label>
                    <input
                      type="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-pp-deep mb-2">
                      Lè Prefere
                    </label>
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                    >
                      <option value="">Chwazi yon lè</option>
                      <option value="morning">Maten (8am-12pm)</option>
                      <option value="afternoon">Apremidi (12pm-5pm)</option>
                      <option value="evening">Aswè (5pm-8pm)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-pp-deep mb-2">
                    Nòt Adisyonèl
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Di nou plis sou pwojè w la oswa demand espesyal ou yo"
                    rows="4"
                    className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                  />
                </div>

                {/* Service Summary */}
                <div className="bg-pp-gray p-4 rounded-xl">
                  <h4 className="font-semibold text-pp-deep mb-2">Rezime Sèvis</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Sèvis:</strong> {selectedService.title}</p>
                    <p><strong>Pri Estime:</strong> {selectedService.price}</p>
                    <p><strong>Dire:</strong> {selectedService.duration}</p>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setSelectedService(null)}
                    className="flex-1 border-2 border-pp-gray text-pp-deep py-3 rounded-full font-semibold hover:bg-pp-gray transition-colors duration-300"
                  >
                    Anile
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-pp-blue text-white py-3 rounded-full font-semibold hover:bg-pp-deep transition-colors duration-300"
                  >
                    Konfime Randevou
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="bg-white rounded-3xl p-8 shadow-soft-card">
          <h2 className="text-2xl font-bold text-pp-deep mb-6 text-center">
            Kijan Nou Fonksyone
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-pp-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📞</span>
              </div>
              <h3 className="font-semibold text-pp-deep mb-2">1. Rele Nou</h3>
              <p className="text-sm text-pp-deep/70">Pran randevou ak ekip nou an</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pp-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="font-semibold text-pp-deep mb-2">2. Evalyasyon</h3>
              <p className="text-sm text-pp-deep/70">Nou vin gade ak ba ou yon devis</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pp-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-semibold text-pp-deep mb-2">3. Fè Travay La</h3>
              <p className="text-sm text-pp-deep/70">Nou fè travay la ak kalite segondè</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}