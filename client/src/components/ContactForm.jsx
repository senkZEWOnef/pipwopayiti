import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ContactForm({ isMainPage = false }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceType: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:4001/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', phone: '', email: '', serviceType: '', message: '' });
        
        // Reset success message after 5 seconds
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        alert('Error sending message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error sending message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <span className="text-6xl mb-4 block">✅</span>
        <h3 className={`text-2xl font-bold mb-2 ${isMainPage ? 'text-pp-deep dark:text-dark-text' : 'text-white'}`}>
          Mèsi!
        </h3>
        <p className={`${isMainPage ? 'text-pp-deep/70 dark:text-dark-text-secondary' : 'text-white/80'}`}>
          Mesaj ou an te voye ak siksè. N ap reponn ou nan kèk tan.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className={`block text-sm font-semibold mb-2 ${isMainPage ? 'text-pp-deep dark:text-dark-text' : 'text-white'}`}>
            {t('contact.name')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all ${
              isMainPage
                ? 'border-pp-gray dark:border-dark-border bg-white dark:bg-dark-surface text-pp-deep dark:text-dark-text placeholder-pp-deep/50 dark:placeholder-dark-text-secondary focus:border-pp-blue dark:focus:border-dark-accent-blue focus:ring-2 focus:ring-pp-blue/10 dark:focus:ring-dark-accent-blue/10'
                : 'border-white/30 bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:border-pp-sky focus:ring-2 focus:ring-pp-sky/30'
            }`}
            placeholder={t('booking.namePlaceholder')}
          />
        </div>
        <div>
          <label className={`block text-sm font-semibold mb-2 ${isMainPage ? 'text-pp-deep dark:text-dark-text' : 'text-white'}`}>
            {t('contact.phone')} <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all ${
              isMainPage
                ? 'border-pp-gray dark:border-dark-border bg-white dark:bg-dark-surface text-pp-deep dark:text-dark-text placeholder-pp-deep/50 dark:placeholder-dark-text-secondary focus:border-pp-blue dark:focus:border-dark-accent-blue focus:ring-2 focus:ring-pp-blue/10 dark:focus:ring-dark-accent-blue/10'
                : 'border-white/30 bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:border-pp-sky focus:ring-2 focus:ring-pp-sky/30'
            }`}
            placeholder={t('booking.phonePlaceholder')}
          />
        </div>
      </div>

      {isMainPage && (
        <div>
          <label className="block text-sm font-semibold text-pp-deep dark:text-dark-text mb-2">
            {t('contact.emailOptional')}
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-pp-gray dark:border-dark-border bg-white dark:bg-dark-surface px-4 py-3 text-pp-deep dark:text-dark-text text-sm placeholder-pp-deep/50 dark:placeholder-dark-text-secondary outline-none focus:border-pp-blue dark:focus:border-dark-accent-blue focus:ring-2 focus:ring-pp-blue/10 dark:focus:ring-dark-accent-blue/10 transition-all"
            placeholder={t('booking.emailPlaceholder')}
          />
        </div>
      )}
      
      <div>
        <label className={`block text-sm font-semibold mb-2 ${isMainPage ? 'text-pp-deep dark:text-dark-text' : 'text-white'}`}>
          {t('contact.interested')} <span className="text-red-500">*</span>
        </label>
        <select 
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          required
          className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all ${
            isMainPage
              ? 'border-pp-gray dark:border-dark-border bg-white dark:bg-dark-surface text-pp-deep dark:text-dark-text focus:border-pp-blue dark:focus:border-dark-accent-blue focus:ring-2 focus:ring-pp-blue/10 dark:focus:ring-dark-accent-blue/10'
              : 'border-white/30 bg-white/20 backdrop-blur-sm text-white focus:border-pp-sky focus:ring-2 focus:ring-pp-sky/30'
          }`}
        >
          <option value="">{t('contact.chooseService')}</option>
          <option value="cleaning">{t('contact.cleaningProducts')}</option>
          <option value="kitchen">{t('contact.pvcKitchen')}</option>
          <option value="closets">{t('contact.closetsWardrobes')}</option>
          <option value="delivery">{t('contact.deliveryInstall')}</option>
          <option value="other">{t('contact.otherMultiple')}</option>
        </select>
      </div>
      
      <div>
        <label className={`block text-sm font-semibold mb-2 ${isMainPage ? 'text-pp-deep dark:text-dark-text' : 'text-white'}`}>
          {t('contact.message')} <span className="text-red-500">*</span>
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={isMainPage ? "5" : "4"}
          className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all resize-none ${
            isMainPage
              ? 'border-pp-gray dark:border-dark-border bg-white dark:bg-dark-surface text-pp-deep dark:text-dark-text placeholder-pp-deep/50 dark:placeholder-dark-text-secondary focus:border-pp-blue dark:focus:border-dark-accent-blue focus:ring-2 focus:ring-pp-blue/10 dark:focus:ring-dark-accent-blue/10'
              : 'border-white/30 bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:border-pp-sky focus:ring-2 focus:ring-pp-sky/30'
          }`}
          placeholder={t('contact.messagePlaceholder')}
        />
      </div>
      
      <div className="text-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
            isMainPage
              ? 'bg-gradient-to-r from-pp-blue to-pp-deep dark:from-dark-accent-blue dark:to-dark-accent text-white hover:from-pp-deep hover:to-pp-navy dark:hover:from-dark-accent dark:hover:to-dark-accent-blue hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-pp-sky text-pp-deep hover:bg-white hover:text-pp-deep hover:scale-105'
          } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
            <span className="flex items-center space-x-2">
              <span>⏳</span>
              <span>Voye...</span>
            </span>
          ) : (
            <span className="flex items-center space-x-2">
              <span>{t('contact.sendMessage')}</span>
              {isMainPage && <span>🚀</span>}
            </span>
          )}
        </button>
      </div>

      {isMainPage && (
        <p className="text-center text-xs text-pp-deep/60 dark:text-dark-text-secondary">
          <span className="text-red-500">*</span> {t('contact.requiredFields')}
        </p>
      )}
    </form>
  );
}