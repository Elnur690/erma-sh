
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const TermsConditionsPage = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-8">{t('terms.title')}</h1>
      
      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.usage.title')}</h2>
          <p className="mb-4">{t('terms.usage.content')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.orders.title')}</h2>
          <p className="mb-4">{t('terms.orders.content')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.liability.title')}</h2>
          <p className="mb-4">{t('terms.liability.content')}</p>
        </section>
      </div>
    </div>
  );
};

export default TermsConditionsPage;
