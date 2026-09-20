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
    <div className="min-h-screen bg-gradient-to-br from-pp-blue via-pp-deep to-pp-navy dark:from-dark-bg dark:via-dark-surface dark:to-dark-card transition-colors duration-300">
      <div className="pt-16 md:pt-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
          
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white dark:text-dark-text mb-4 md:mb-6">
              {i18n.language === 'fr' ? 'Rejoignez l\'Équipe Pi Pwòp Shipping' : 'Vin Nan Ekip Pi Pwòp Shipping La'}
            </h1>
            <p className="text-lg md:text-xl text-white/80 dark:text-dark-text-secondary mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed">
              {i18n.language === 'fr' 
                ? 'Nous recherchons des professionnels expérimentés pour rejoindre notre équipe en pleine croissance. Travaillez avec des horaires flexibles, payés toutes les 2 semaines, et faites partie de la meilleure entreprise en Haïti.'
                : 'Nou ap chèche pwofesyonèl ak eksperyans pou vin nan ekip nou an ki ap grandi. Travay ak orè fleksib, yo peye ou chak 2 semèn, ak fè pati konpani pi bon an nan Ayiti.'
              }
            </p>
            <div className="bg-white/10 dark:bg-dark-card backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 dark:border-dark-border max-w-2xl mx-auto">
              <h3 className="text-white dark:text-dark-text font-semibold mb-2">
                💼 {i18n.language === 'fr' ? 'Ce Que Nous Offrons:' : 'Sa Nou Ofri:'}
              </h3>
              <ul className="text-white/90 dark:text-dark-text-secondary text-left space-y-1">
                <li>• {i18n.language === 'fr' ? 'Horaires de travail flexibles - travaillez quand vous voulez' : 'Orè travay fleksib - travay lè ou vle'}</li>
                <li>• {i18n.language === 'fr' ? 'Payé toutes les 2 semaines - revenus réguliers' : 'Yo peye ou chak 2 semèn - lajan regilyè'}</li>
                <li>• {i18n.language === 'fr' ? 'Statut de contracteur indépendant' : 'Estatut kontrakte endepandan'}</li>
                <li>• {i18n.language === 'fr' ? 'Opportunités de travail régulières' : 'Opòtinite travay regilyè'}</li>
                <li>• {i18n.language === 'fr' ? 'Support professionnel et formation' : 'Sipò pwofesyonèl ak fòmasyon'}</li>
              </ul>
            </div>
          </div>

          {/* Job Positions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {JOB_POSITIONS.map((job) => (
              <div
                key={job.id}
                className={`bg-white/10 dark:bg-dark-card backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 cursor-pointer ${
                  selectedPosition === job.id 
                    ? 'border-pp-sky dark:border-dark-accent-blue bg-white/20 dark:bg-dark-surface scale-105' 
                    : 'border-white/20 dark:border-dark-border hover:border-white/40 dark:hover:border-dark-accent-blue hover:bg-white/15 dark:hover:bg-dark-surface'
                }`}
                onClick={() => setSelectedPosition(job.id)}
              >
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-white dark:text-dark-text mb-2">
                    {t && i18n.language === 'fr' ? job.titleFr : job.title}
                  </h3>
                </div>
                
                <p className="text-white/80 dark:text-dark-text-secondary mb-4 text-sm">
                  {t && i18n.language === 'fr' ? job.descriptionFr : job.description}
                </p>
                
                <div className="bg-white/10 dark:bg-dark-surface rounded-xl p-3 mb-4">
                  <p className="text-white dark:text-dark-text font-semibold text-sm mb-2">
                    {t && i18n.language === 'fr' ? 'Exigences Principales:' : 'Kondisyon Yo:'}
                  </p>
                  <ul className="text-white/80 dark:text-dark-text-secondary text-xs space-y-1">
                    {(t && i18n.language === 'fr' ? job.requirementsFr : job.requirements)
                      .slice(0, 3).map((req, idx) => (
                      <li key={idx}>• {req}</li>
                    ))}
                  </ul>
                </div>
                
                {selectedPosition === job.id && (
                  <div className="mt-4 text-center">
                    <span className="bg-pp-sky dark:bg-dark-accent-blue text-pp-deep dark:text-dark-bg px-4 py-2 rounded-full font-semibold text-sm">
                      ✓ Selected
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Application Form */}
          {selectedPosition && (
            <div className="bg-white/10 dark:bg-dark-card backdrop-blur-lg rounded-2xl p-8 border border-white/20 dark:border-dark-border">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white dark:text-dark-text mb-2">
                  {i18n.language === 'fr' ? 'Postuler pour: ' : 'Aplike pou: '}
                  {i18n.language === 'fr' ? selectedJob?.titleFr : selectedJob?.title}
                </h2>
                <p className="text-white/70 dark:text-dark-text-secondary">
                  {i18n.language === 'fr' 
                    ? "Remplissez la demande ci-dessous pour rejoindre notre équipe."
                    : "Ranpli aplikasyon an anba a pou vin nan ekip nou an."
                  }
                </p>
              </div>

              {/* Position Details */}
              <div className="bg-white/10 dark:bg-dark-surface rounded-xl p-6 mb-8">
                <h3 className="text-white dark:text-dark-text font-semibold mb-4">
                  {i18n.language === 'fr' ? 'Détails du Poste:' : 'Detay Travay La:'}
                </h3>
                <div>
                  <h4 className="text-pp-sky dark:text-dark-accent-blue font-semibold mb-2">
                    {i18n.language === 'fr' ? 'Exigences:' : 'Kondisyon Yo:'}
                  </h4>
                  <ul className="text-white/80 dark:text-dark-text-secondary text-sm space-y-1">
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
                    <label className="block text-white dark:text-dark-text font-semibold mb-2">
                      {i18n.language === 'fr' ? 'Nom Complet' : 'Non Konplè'} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full rounded-xl border border-white/30 dark:border-dark-border bg-white/20 dark:bg-dark-surface backdrop-blur-sm px-4 py-3 text-white dark:text-dark-text placeholder-white/70 dark:placeholder-dark-text-secondary outline-none focus:border-pp-sky dark:focus:border-dark-accent-blue focus:ring-2 focus:ring-pp-sky/30 dark:focus:ring-dark-accent-blue/30 transition-all"
                      placeholder={i18n.language === 'fr' ? 'Votre nom complet' : 'Non konplè ou'}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white dark:text-dark-text font-semibold mb-2">
                      {i18n.language === 'fr' ? 'Numéro de Téléphone' : 'Nimewo Telefòn'} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full rounded-xl border border-white/30 dark:border-dark-border bg-white/20 dark:bg-dark-surface backdrop-blur-sm px-4 py-3 text-white dark:text-dark-text placeholder-white/70 dark:placeholder-dark-text-secondary outline-none focus:border-pp-sky dark:focus:border-dark-accent-blue focus:ring-2 focus:ring-pp-sky/30 dark:focus:ring-dark-accent-blue/30 transition-all"
                      placeholder="+509 1234 5678"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white dark:text-dark-text font-semibold mb-2">
                      {i18n.language === 'fr' ? 'Email (Optionnel)' : 'Email (Opsyonèl)'}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full rounded-xl border border-white/30 dark:border-dark-border bg-white/20 dark:bg-dark-surface backdrop-blur-sm px-4 py-3 text-white dark:text-dark-text placeholder-white/70 dark:placeholder-dark-text-secondary outline-none focus:border-pp-sky dark:focus:border-dark-accent-blue focus:ring-2 focus:ring-pp-sky/30 dark:focus:ring-dark-accent-blue/30 transition-all"
                      placeholder={i18n.language === 'fr' ? 'votre.email@exemple.com' : 'email.w@egzanp.com'}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white dark:text-dark-text font-semibold mb-2">
                      {i18n.language === 'fr' ? 'Années d\'Expérience' : 'Kòmbyen Ane Eksperyans'} <span className="text-red-400">*</span>
                    </label>
                    <select
                      required
                      value={formData.experienceYears}
                      onChange={(e) => setFormData({...formData, experienceYears: e.target.value})}
                      className="w-full rounded-xl border border-white/30 dark:border-dark-border bg-white/20 dark:bg-dark-surface backdrop-blur-sm px-4 py-3 text-white dark:text-dark-text outline-none focus:border-pp-sky dark:focus:border-dark-accent-blue focus:ring-2 focus:ring-pp-sky/30 dark:focus:ring-dark-accent-blue/30 transition-all"
                    >
                      <option className="text-pp-deep" value="">{i18n.language === 'fr' ? 'Sélectionnez le niveau d\'expérience' : 'Chwazi nivo eksperyans ou'}</option>
                      <option className="text-pp-deep" value="0-1">{i18n.language === 'fr' ? '0-1 ans (Débutant)' : '0-1 ane (Kòmansè)'}</option>
                      <option className="text-pp-deep" value="2-3">{i18n.language === 'fr' ? '2-3 ans' : '2-3 ane'}</option>
                      <option className="text-pp-deep" value="4-5">{i18n.language === 'fr' ? '4-5 ans' : '4-5 ane'}</option>
                      <option className="text-pp-deep" value="6-10">{i18n.language === 'fr' ? '6-10 ans' : '6-10 ane'}</option>
                      <option className="text-pp-deep" value="10+">{i18n.language === 'fr' ? '10+ ans (Expert)' : '10+ ane (Ekspè)'}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white dark:text-dark-text font-semibold mb-2">
                    {i18n.language === 'fr' ? 'Adresse/Localisation' : 'Adrès/Kote w ye'} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full rounded-xl border border-white/30 dark:border-dark-border bg-white/20 dark:bg-dark-surface backdrop-blur-sm px-4 py-3 text-white dark:text-dark-text placeholder-white/70 dark:placeholder-dark-text-secondary outline-none focus:border-pp-sky dark:focus:border-dark-accent-blue focus:ring-2 focus:ring-pp-sky/30 dark:focus:ring-dark-accent-blue/30 transition-all"
                    placeholder={i18n.language === 'fr' ? 'Port-au-Prince, Delmas, Carrefour, etc.' : 'Port-au-Prince, Delmas, Carrefour, elatrè'}
                  />
                </div>

                <div>
                  <label className="block text-white dark:text-dark-text font-semibold mb-2">
                    {i18n.language === 'fr' ? 'Expérience Professionnelle Antérieure' : 'Eksperyans Travay Anvan'} <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows="4"
                    required
                    value={formData.previousWork}
                    onChange={(e) => setFormData({...formData, previousWork: e.target.value})}
                    className="w-full rounded-xl border border-white/30 dark:border-dark-border bg-white/20 dark:bg-dark-surface backdrop-blur-sm px-4 py-3 text-white dark:text-dark-text placeholder-white/70 dark:placeholder-dark-text-secondary outline-none focus:border-pp-sky dark:focus:border-dark-accent-blue focus:ring-2 focus:ring-pp-sky/30 dark:focus:ring-dark-accent-blue/30 transition-all resize-none"
                    placeholder={i18n.language === 'fr' ? 'Décrivez votre expérience professionnelle pertinente, vos compétences et les entreprises pour lesquelles vous avez travaillé...' : 'Dekri eksperyans travay ki gen rapò ak ou, kapasite w yo ak konpani yo ou te travay pou yo...'}
                  />
                </div>

                <div>
                  <label className="block text-white dark:text-dark-text font-semibold mb-2">
                    {i18n.language === 'fr' ? 'Disponibilité' : 'Disponibilite'} <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows="3"
                    required
                    value={formData.availability}
                    onChange={(e) => setFormData({...formData, availability: e.target.value})}
                    className="w-full rounded-xl border border-white/30 dark:border-dark-border bg-white/20 dark:bg-dark-surface backdrop-blur-sm px-4 py-3 text-white dark:text-dark-text placeholder-white/70 dark:placeholder-dark-text-secondary outline-none focus:border-pp-sky dark:focus:border-dark-accent-blue focus:ring-2 focus:ring-pp-sky/30 dark:focus:ring-dark-accent-blue/30 transition-all resize-none"
                    placeholder={i18n.language === 'fr' ? 'Lundi-Vendredi 8h-17h, Week-ends disponibles, Horaires flexibles, etc.' : 'Lendi-Vandredi 8am-5pm, Wikann disponib, Orè fleksib, elatrè'}
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
                      <label htmlFor="hasTransportation" className="text-white dark:text-dark-text font-semibold">
                        {i18n.language === 'fr' ? 'J\'ai un transport fiable' : 'Mwen gen transpò relyab'}
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
                      <label htmlFor="hasOwnTools" className="text-white dark:text-dark-text font-semibold">
                        {i18n.language === 'fr' ? 'J\'ai mes propres outils' : 'Mwen gen zouti pwòp mwen'}
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-white dark:text-dark-text font-semibold mb-2">
                      {i18n.language === 'fr' ? 'Date de début disponible' : 'Dat pou komanse travay'}
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="w-full rounded-xl border border-white/30 dark:border-dark-border bg-white/20 dark:bg-dark-surface backdrop-blur-sm px-4 py-3 text-white dark:text-dark-text outline-none focus:border-pp-sky dark:focus:border-dark-accent-blue focus:ring-2 focus:ring-pp-sky/30 dark:focus:ring-dark-accent-blue/30 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white dark:text-dark-text font-semibold mb-2">
                    {i18n.language === 'fr' ? 'Références (Optionnel)' : 'Moun ki ka rekonmande w (Opsyonèl)'}
                  </label>
                  <textarea
                    rows="3"
                    value={formData.references}
                    onChange={(e) => setFormData({...formData, references: e.target.value})}
                    className="w-full rounded-xl border border-white/30 dark:border-dark-border bg-white/20 dark:bg-dark-surface backdrop-blur-sm px-4 py-3 text-white dark:text-dark-text placeholder-white/70 dark:placeholder-dark-text-secondary outline-none focus:border-pp-sky dark:focus:border-dark-accent-blue focus:ring-2 focus:ring-pp-sky/30 dark:focus:ring-dark-accent-blue/30 transition-all resize-none"
                    placeholder={i18n.language === 'fr' ? 'Anciens employeurs, superviseurs, ou références professionnelles...' : 'Ansyen patron, sipevìk, oswa moun ki ka rekonmande w...'}
                  />
                </div>

                <div>
                  <label className="block text-white dark:text-dark-text font-semibold mb-2">
                    {i18n.language === 'fr' ? 'Pourquoi voulez-vous travailler avec Pi Pwòp Shipping?' : 'Poukisa ou vle travay ak Pi Pwòp Shipping?'} <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows="3"
                    required
                    value={formData.motivation}
                    onChange={(e) => setFormData({...formData, motivation: e.target.value})}
                    className="w-full rounded-xl border border-white/30 dark:border-dark-border bg-white/20 dark:bg-dark-surface backdrop-blur-sm px-4 py-3 text-white dark:text-dark-text placeholder-white/70 dark:placeholder-dark-text-secondary outline-none focus:border-pp-sky dark:focus:border-dark-accent-blue focus:ring-2 focus:ring-pp-sky/30 dark:focus:ring-dark-accent-blue/30 transition-all resize-none"
                    placeholder={i18n.language === 'fr' ? 'Dites-nous pourquoi vous êtes intéressé à travailler avec notre équipe...' : 'Di nou poukisa ou enterese pou travay ak ekip nou an...'}
                  />
                </div>

                {/* Submit Button */}
                <div className="text-center pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-pp-sky dark:bg-dark-accent-blue text-pp-deep dark:text-dark-bg px-12 py-4 rounded-full font-bold text-lg hover:bg-white dark:hover:bg-dark-accent hover:text-pp-deep dark:hover:text-dark-text transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pp-deep"></div>
                        <span>{i18n.language === 'fr' ? 'Envoi en cours...' : 'Ap voye...'}</span>
                      </span>
                    ) : (
i18n.language === 'fr' ? 'Soumettre la demande' : 'Voye aplikasyon an'
                    )}
                  </button>
                </div>
              </form>

              {/* Success/Error Messages */}
              {submitStatus === 'success' && (
                <div className="mt-6 bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-green-200">
                  <h3 className="font-semibold mb-2">
                    ✅ {i18n.language === 'fr' ? 'Candidature Soumise avec Succès!' : 'Aplikasyon an Voye ak Siksè!'}
                  </h3>
                  <p>
                    {i18n.language === 'fr' 
                      ? 'Merci pour votre intérêt à rejoindre Pi Pwòp Shipping! Nous examinerons votre candidature et vous contacterons dans 2-3 jours ouvrables.'
                      : 'Mèsi pou enterè w nan vin nan Pi Pwòp Shipping! Nou pral gade aplikasyon ou an epi nou pral kontak ou nan 2-3 jou travay.'
                    }
                  </p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mt-6 bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-200">
                  <h3 className="font-semibold mb-2">
                    ❌ {i18n.language === 'fr' ? 'Erreur de Soumission' : 'Erè nan Voye a'}
                  </h3>
                  <p>
                    {i18n.language === 'fr' 
                      ? 'Il y a eu une erreur lors de la soumission de votre candidature. Veuillez réessayer ou nous contacter directement.'
                      : 'Te gen yon erè lè nou t ap voye aplikasyon ou an. Tanpri eseye ankò oswa kontak nou dirèkteman.'
                    }
                  </p>
                </div>
              )}
            </div>
          )}

          {!selectedPosition && (
            <div className="text-center">
              <p className="text-white/70 dark:text-dark-text-secondary text-lg">
                {i18n.language === 'fr' ? 'Sélectionnez un poste ci-dessus pour commencer votre candidature' : 'Chwazi yon pozisyon ki anwo a pou komanse aplikasyon ou'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}