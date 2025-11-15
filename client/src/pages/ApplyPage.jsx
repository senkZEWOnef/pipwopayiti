import { useState } from "react";
import { useTranslation } from "react-i18next";

const JOB_POSITIONS = [
  {
    id: "kitchen_installer",
    title: "Enstalè Kwizin",
    titleFr: "Installateur de Cuisine",
    description: "Enstale kabinè kwizin PVC, karebò, ak fiksasyon yo",
    descriptionFr: "Installer des armoires de cuisine en PVC, comptoirs et accessoires",
    requirements: [
      "Eksperyans ak enstalasyon kabinè PVC",
      "Konèsans baz menuiserie", 
      "Gen zouti pwòp ou pi bon",
      "Gen transpò relyab"
    ],
    requirementsFr: [
      "Expérience avec l'installation d'armoires PVC",
      "Compétences de base en menuiserie",
      "Outils personnels préférés",
      "Transport fiable"
    ]
  },
  {
    id: "closet_organizer",
    title: "Òganizè Closet ak Depo", 
    titleFr: "Organisateur Placards et Rangement",
    description: "Konsèy ak enstale sistèm closet ak depo koustom",
    descriptionFr: "Concevoir et installer des solutions personnalisées de placards et rangement",
    requirements: [
      "Eksperyans ak sistèm closet",
      "Konèsans mezire ak konsèy",
      "Atansyon nan detay yo", 
      "Bon sèvis kliyan"
    ],
    requirementsFr: [
      "Expérience avec les systèmes de placards",
      "Compétences de mesure et de conception",
      "Attention aux détails",
      "Compétences en service client"
    ]
  },
  {
    id: "cleaner",
    title: "Nètoyè Pwofesyonèl",
    titleFr: "Nettoyeur Professionnel", 
    description: "Bay sèvis netwayaj kay ak biznès",
    descriptionFr: "Fournir des services de nettoyage résidentiel et commercial",
    requirements: [
      "Eksperyans nan sèvis netwayaj",
      "Serye ak onèt",
      "Kapasite fizik pou netwaye",
      "Orè travay fleksib"
    ],
    requirementsFr: [
      "Expérience dans les services de nettoyage",
      "Fiable et digne de confiance",
      "Capacité physique pour nettoyer",
      "Horaire flexible"
    ]
  },
  {
    id: "delivery_driver",
    title: "Chofè Livrezon ak Enstalasyon",
    titleFr: "Chauffeur Livraison et Installation",
    description: "Livre pwodwi yo ak ede nan enstalasyon yo",
    descriptionFr: "Livrer des produits et aider avec les installations",
    requirements: [
      "Lisans kondwi valab",
      "Gen machin oswa kamyon pwòp ou",
      "Kapasite pou leve bagay lou yo",
      "Bon dosye kondwi"
    ],
    requirementsFr: [
      "Permis de conduire valide",
      "Véhicule ou camion personnel",
      "Capacité de lever des objets lourds",
      "Bon dossier de conduite"
    ]
  },
  {
    id: "handyman",
    title: "Travayè Jeneral",
    titleFr: "Homme à Tout Faire",
    description: "Divès travay amelyorasyon ak reparasyon kay",
    descriptionFr: "Diverses tâches d'amélioration et de réparation domiciliaire",
    requirements: [
      "Eksperyans konstriksyon jeneral",
      "Plizyè konèsans travay",
      "Kapasite rezoud pwoblèm",
      "Gen zouti baz pwòp ou"
    ],
    requirementsFr: [
      "Expérience en construction générale",
      "Compétences dans plusieurs métiers",
      "Capacité de résolution de problèmes",
      "Outils de base personnels"
    ]
  }
];

export default function ApplyPage() {
  const { t, i18n } = useTranslation();
  const [selectedPosition, setSelectedPosition] = useState("");
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    position: '',
    experienceYears: '',
    previousWork: '',
    availability: '',
    hasTransportation: false,
    hasOwnTools: false,
    references: '',
    motivation: '',
    startDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/cleaners/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          position: selectedPosition,
          transportation: formData.hasTransportation,
          ownTools: formData.hasOwnTools
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          fullName: '', phone: '', email: '', address: '', position: '',
          experienceYears: '', previousWork: '', availability: '', 
          hasTransportation: false, hasOwnTools: false, references: '',
          motivation: '', startDate: ''
        });
        setSelectedPosition("");
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedJob = JOB_POSITIONS.find(job => job.id === selectedPosition);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pp-blue via-pp-deep to-pp-navy">
      <div className="pt-20">
        <div className="max-w-6xl mx-auto px-6 py-12">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Vin Nan Ekip Pi Pwòp La
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
              Nou ap chèche pwofesyonèl ak eksperyans pou vin nan ekip nou an ki ap grandi. 
              Travay ak orè fleksib, yo peye ou chak 2 semèn, ak fè pati konpani pi bon an nan Ayiti.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 max-w-2xl mx-auto">
              <h3 className="text-white font-semibold mb-2">💼 Sa Nou Ofri:</h3>
              <ul className="text-white/90 text-left space-y-1">
                <li>• Orè travay fleksib - travay lè ou vle</li>
                <li>• Yo peye ou chak 2 semèn - lajan regilyè</li>
                <li>• Estatut kontrakte endepandan</li>
                <li>• Opòtinite travay regilyè</li>
                <li>• Sipò pwofesyonèl ak fòmasyon</li>
              </ul>
            </div>
          </div>

          {/* Job Positions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {JOB_POSITIONS.map((job) => (
              <div
                key={job.id}
                className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 cursor-pointer ${
                  selectedPosition === job.id 
                    ? 'border-pp-sky bg-white/20 scale-105' 
                    : 'border-white/20 hover:border-white/40 hover:bg-white/15'
                }`}
                onClick={() => setSelectedPosition(job.id)}
              >
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {t && i18n.language === 'fr' ? job.titleFr : job.title}
                  </h3>
                </div>
                
                <p className="text-white/80 mb-4 text-sm">
                  {t && i18n.language === 'fr' ? job.descriptionFr : job.description}
                </p>
                
                <div className="bg-white/10 rounded-xl p-3 mb-4">
                  <p className="text-white font-semibold text-sm mb-2">
                    {t && i18n.language === 'fr' ? 'Exigences Principales:' : 'Kondisyon Yo:'}
                  </p>
                  <ul className="text-white/80 text-xs space-y-1">
                    {(t && i18n.language === 'fr' ? job.requirementsFr : job.requirements)
                      .slice(0, 3).map((req, idx) => (
                      <li key={idx}>• {req}</li>
                    ))}
                  </ul>
                </div>
                
                {selectedPosition === job.id && (
                  <div className="mt-4 text-center">
                    <span className="bg-pp-sky text-pp-deep px-4 py-2 rounded-full font-semibold text-sm">
                      ✓ Selected
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Application Form */}
          {selectedPosition && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {i18n.language === 'fr' ? 'Postuler pour: ' : 'Aplike pou: '}
                  {i18n.language === 'fr' ? selectedJob?.titleFr : selectedJob?.title}
                </h2>
                <p className="text-white/70">
                  {i18n.language === 'fr' 
                    ? "Remplissez la demande ci-dessous pour rejoindre notre équipe."
                    : "Ranpli aplikasyon an anba a pou vin nan ekip nou an."
                  }
                </p>
              </div>

              {/* Position Details */}
              <div className="bg-white/10 rounded-xl p-6 mb-8">
                <h3 className="text-white font-semibold mb-4">
                  {i18n.language === 'fr' ? 'Détails du Poste:' : 'Detay Travay La:'}
                </h3>
                <div>
                  <h4 className="text-pp-sky font-semibold mb-2">
                    {i18n.language === 'fr' ? 'Exigences:' : 'Kondisyon Yo:'}
                  </h4>
                  <ul className="text-white/80 text-sm space-y-1">
                    {(i18n.language === 'fr' ? selectedJob?.requirementsFr : selectedJob?.requirements)?.map((req, idx) => (
                      <li key={idx}>• {req}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      {i18n.language === 'fr' ? 'Nom Complet' : 'Non Konplè'} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm px-4 py-3 text-white placeholder-white/70 outline-none focus:border-pp-sky focus:ring-2 focus:ring-pp-sky/30 transition-all"
                      placeholder={i18n.language === 'fr' ? 'Votre nom complet' : 'Non konplè ou'}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      {i18n.language === 'fr' ? 'Numéro de Téléphone' : 'Nimewo Telefòn'} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm px-4 py-3 text-white placeholder-white/70 outline-none focus:border-pp-sky focus:ring-2 focus:ring-pp-sky/30 transition-all"
                      placeholder="+509 1234 5678"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm px-4 py-3 text-white placeholder-white/70 outline-none focus:border-pp-sky focus:ring-2 focus:ring-pp-sky/30 transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Years of Experience <span className="text-red-400">*</span>
                    </label>
                    <select
                      required
                      value={formData.experienceYears}
                      onChange={(e) => setFormData({...formData, experienceYears: e.target.value})}
                      className="w-full rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm px-4 py-3 text-white outline-none focus:border-pp-sky focus:ring-2 focus:ring-pp-sky/30 transition-all"
                    >
                      <option className="text-pp-deep" value="">Select experience level</option>
                      <option className="text-pp-deep" value="0-1">0-1 years (Beginner)</option>
                      <option className="text-pp-deep" value="2-3">2-3 years</option>
                      <option className="text-pp-deep" value="4-5">4-5 years</option>
                      <option className="text-pp-deep" value="6-10">6-10 years</option>
                      <option className="text-pp-deep" value="10+">10+ years (Expert)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    Address/Location <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm px-4 py-3 text-white placeholder-white/70 outline-none focus:border-pp-sky focus:ring-2 focus:ring-pp-sky/30 transition-all"
                    placeholder="Port-au-Prince, Delmas, Carrefour, etc."
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    Previous Work Experience <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows="4"
                    required
                    value={formData.previousWork}
                    onChange={(e) => setFormData({...formData, previousWork: e.target.value})}
                    className="w-full rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm px-4 py-3 text-white placeholder-white/70 outline-none focus:border-pp-sky focus:ring-2 focus:ring-pp-sky/30 transition-all resize-none"
                    placeholder="Describe your relevant work experience, skills, and any companies you've worked for..."
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    Availability <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows="3"
                    required
                    value={formData.availability}
                    onChange={(e) => setFormData({...formData, availability: e.target.value})}
                    className="w-full rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm px-4 py-3 text-white placeholder-white/70 outline-none focus:border-pp-sky focus:ring-2 focus:ring-pp-sky/30 transition-all resize-none"
                    placeholder="Monday-Friday 8am-5pm, Weekends available, Flexible hours, etc."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="hasTransportation"
                        checked={formData.hasTransportation}
                        onChange={(e) => setFormData({...formData, hasTransportation: e.target.checked})}
                        className="w-5 h-5 rounded border-white/30 bg-white/20"
                      />
                      <label htmlFor="hasTransportation" className="text-white font-semibold">
                        I have reliable transportation
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="hasOwnTools"
                        checked={formData.hasOwnTools}
                        onChange={(e) => setFormData({...formData, hasOwnTools: e.target.checked})}
                        className="w-5 h-5 rounded border-white/30 bg-white/20"
                      />
                      <label htmlFor="hasOwnTools" className="text-white font-semibold">
                        I have my own tools
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Available Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="w-full rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm px-4 py-3 text-white outline-none focus:border-pp-sky focus:ring-2 focus:ring-pp-sky/30 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    References (Optional)
                  </label>
                  <textarea
                    rows="3"
                    value={formData.references}
                    onChange={(e) => setFormData({...formData, references: e.target.value})}
                    className="w-full rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm px-4 py-3 text-white placeholder-white/70 outline-none focus:border-pp-sky focus:ring-2 focus:ring-pp-sky/30 transition-all resize-none"
                    placeholder="Previous employers, supervisors, or professional references with contact information..."
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    Why do you want to work with Pi Pwòp? <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows="3"
                    required
                    value={formData.motivation}
                    onChange={(e) => setFormData({...formData, motivation: e.target.value})}
                    className="w-full rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm px-4 py-3 text-white placeholder-white/70 outline-none focus:border-pp-sky focus:ring-2 focus:ring-pp-sky/30 transition-all resize-none"
                    placeholder="Tell us why you're interested in working with our team..."
                  />
                </div>

                {/* Submit Button */}
                <div className="text-center pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-pp-sky text-pp-deep px-12 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-pp-deep transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pp-deep"></div>
                        <span>Submitting...</span>
                      </span>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                </div>
              </form>

              {/* Success/Error Messages */}
              {submitStatus === 'success' && (
                <div className="mt-6 bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-green-200">
                  <h3 className="font-semibold mb-2">✅ Application Submitted Successfully!</h3>
                  <p>Thank you for your interest in joining Pi Pwòp! We'll review your application and contact you within 2-3 business days.</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mt-6 bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-200">
                  <h3 className="font-semibold mb-2">❌ Submission Error</h3>
                  <p>There was an error submitting your application. Please try again or contact us directly.</p>
                </div>
              )}
            </div>
          )}

          {!selectedPosition && (
            <div className="text-center">
              <p className="text-white/70 text-lg">
                Select a position above to start your application
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}