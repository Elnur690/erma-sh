
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const PrivacyPolicyPage = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-8">{t('privacy.title')}</h1>
      
      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('privacy.dataCollection.title')}</h2>
          <p className="mb-4">{t('privacy.dataCollection.content')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('privacy.dataUse.title')}</h2>
          <p className="mb-4">{t('privacy.dataUse.content')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('privacy.cookies.title')}</h2>
          <p className="mb-4">{t('privacy.cookies.content')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('privacy.contact.title')}</h2>
          <p className="mb-4">{t('privacy.contact.content')}</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
