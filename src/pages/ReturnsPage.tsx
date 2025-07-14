
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const ReturnsPage = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-8">{t('returns.title')}</h1>
      
      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('returns.policy.title')}</h2>
          <p className="mb-4">{t('returns.policy.content')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('returns.process.title')}</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>{t('returns.process.step1')}</li>
            <li>{t('returns.process.step2')}</li>
            <li>{t('returns.process.step3')}</li>
            <li>{t('returns.process.step4')}</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('returns.conditions.title')}</h2>
          <p className="mb-4">{t('returns.conditions.content')}</p>
        </section>
      </div>
    </div>
  );
};

export default ReturnsPage;
