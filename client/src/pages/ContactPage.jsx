import { useTranslation } from "react-i18next";
import ContactForm from "../components/ContactForm";

export default function ContactPage() {
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300">
      
      {/* Header Section */}
      <section className="bg-gradient-to-br from-pp-navy via-pp-deep to-pp-blue dark:from-dark-surface dark:via-dark-card dark:to-dark-bg text-white py-12 md:py-16 relative overflow-hidden">
        {/* Minimal background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-64 md:h-64 bg-pp-sky/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {t('nav.contact')}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              {t('contact.title')}
            </p>
          </div>
        </div>
      </section>
      
      <div className="relative mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-16">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Left side - Contact Info */}
          <div className="space-y-6 md:space-y-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-pp-deep dark:text-dark-text">
                {t('contact.description')}
              </h2>
              <p className="text-base md:text-lg text-pp-deep/80 dark:text-dark-text-secondary leading-relaxed">
                {i18n.language === 'fr' 
                  ? 'Nous sommes là pour répondre à toutes vos questions et vous aider avec votre projet'
                  : 'Nou la pou reponn tout kesyon ou yo ak ede w ak pwojè w la'
                }
              </p>
            </div>
            
            {/* Contact Methods */}
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-start space-x-3 md:space-x-4 p-4 md:p-6 bg-white dark:bg-dark-card rounded-xl md:rounded-2xl shadow-soft-card dark:shadow-dark-card border border-pp-gray/20 dark:border-dark-border">
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg md:rounded-xl flex-shrink-0">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2 text-pp-deep dark:text-dark-text">{t('contact.whatsapp')}</h3>
                  <p className="text-sm md:text-base text-pp-deep/80 dark:text-dark-text-secondary mb-1 md:mb-2">+509 1234 5678</p>
                  <p className="text-xs md:text-sm text-pp-deep/60 dark:text-dark-text-secondary">
                    {i18n.language === 'fr' ? 'Disponible 24/7 pour urgences' : 'Disponib 24/7 pou emerjensi'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 md:space-x-4 p-4 md:p-6 bg-white dark:bg-dark-card rounded-xl md:rounded-2xl shadow-soft-card dark:shadow-dark-card border border-pp-gray/20 dark:border-dark-border">
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-green-100 dark:bg-green-900/30 rounded-lg md:rounded-xl flex-shrink-0">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.91L12 10.09l9.454-6.269h.91c.904 0 1.636.732 1.636 1.636z"/>
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2 text-pp-deep dark:text-dark-text">{t('contact.email')}</h3>
                  <p className="text-sm md:text-base text-pp-deep/80 dark:text-dark-text-secondary mb-1 md:mb-2">info@pipwop.com</p>
                  <p className="text-xs md:text-sm text-pp-deep/60 dark:text-dark-text-secondary">
                    {i18n.language === 'fr' ? 'Nous répondons dans 24 heures' : 'Nou pral reponn nan 24 èdtan'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 md:space-x-4 p-4 md:p-6 bg-white dark:bg-dark-card rounded-xl md:rounded-2xl shadow-soft-card dark:shadow-dark-card border border-pp-gray/20 dark:border-dark-border">
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg md:rounded-xl flex-shrink-0">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2 text-pp-deep dark:text-dark-text">{t('contact.whereWeAre')}</h3>
                  <p className="text-sm md:text-base text-pp-deep/80 dark:text-dark-text-secondary mb-1 md:mb-2">{t('contact.location')}</p>
                  <p className="text-xs md:text-sm text-pp-deep/60 dark:text-dark-text-secondary">
                    {i18n.language === 'fr' ? 'Nous servons tout Haïti' : 'Nou sèvi tout Ayiti'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 md:space-x-4 p-4 md:p-6 bg-white dark:bg-dark-card rounded-xl md:rounded-2xl shadow-soft-card dark:shadow-dark-card border border-pp-gray/20 dark:border-dark-border">
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg md:rounded-xl flex-shrink-0">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2 text-pp-deep dark:text-dark-text">
                    {i18n.language === 'fr' ? 'Heures de Travail' : 'Èdtan Travay'}
                  </h3>
                  <p className="text-xs md:text-sm text-pp-deep/80 dark:text-dark-text-secondary mb-1">
                    {i18n.language === 'fr' ? 'Lundi - Vendredi: 8h - 18h' : 'Lendi - Vandredi: 8am - 6pm'}
                  </p>
                  <p className="text-xs md:text-sm text-pp-deep/80 dark:text-dark-text-secondary mb-1 md:mb-2">
                    {i18n.language === 'fr' ? 'Samedi: 9h - 16h' : 'Samdi: 9am - 4pm'}
                  </p>
                  <p className="text-xs md:text-sm text-pp-deep/60 dark:text-dark-text-secondary">
                    {i18n.language === 'fr' ? 'Urgences: 24/7' : 'Emerjensi: 24/7'}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="font-semibold text-base md:text-lg mb-3 md:mb-4 text-pp-deep dark:text-dark-text">
                {i18n.language === 'fr' ? 'Suivez-nous sur' : 'Swiv nou sou'}
              </h3>
              <div className="flex space-x-3 md:space-x-4">
                <a href="#" className="w-10 h-10 md:w-12 md:h-12 bg-pp-gray/30 dark:bg-dark-border rounded-lg md:rounded-xl flex items-center justify-center hover:bg-blue-600 hover:scale-105 transition-all duration-300 group">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-pp-deep dark:text-dark-text group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 md:w-12 md:h-12 bg-pp-gray/30 dark:bg-dark-border rounded-lg md:rounded-xl flex items-center justify-center hover:bg-green-600 hover:scale-105 transition-all duration-300 group">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-pp-deep dark:text-dark-text group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 md:w-12 md:h-12 bg-pp-gray/30 dark:bg-dark-border rounded-lg md:rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 hover:scale-105 transition-all duration-300 group">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-pp-deep dark:text-dark-text group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* Right side - Contact Form */}
          <div className="bg-white dark:bg-dark-card rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl dark:shadow-dark-card border border-transparent dark:border-dark-border">
            <div className="mb-6 md:mb-8">
              <h3 className="text-xl md:text-2xl font-bold text-pp-deep dark:text-dark-text mb-2">
                {t('contact.startNow')}
              </h3>
              <p className="text-sm md:text-base text-pp-deep/70 dark:text-dark-text-secondary">
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