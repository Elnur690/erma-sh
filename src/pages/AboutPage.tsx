
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AboutPage = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('about.title')}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t('about.subtitle')}
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-6">{t('about.title')}</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {t('about.description')}
          </p>
        </div>
        <div className="flex justify-center">
          <img
            src="/placeholder.svg"
            alt="About Us"
            className="rounded-lg shadow-lg max-w-md w-full"
          />
        </div>
      </div>

      {/* Mission and Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                🎯
              </div>
              {t('about.mission')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{t('about.missionText')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                👁️
              </div>
              {t('about.vision')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{t('about.visionText')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                🚚
              </div>
              {t('features.freeShipping')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{t('features.freeShippingDesc')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                🔒
              </div>
              {t('features.securePayment')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{t('features.securePaymentDesc')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                ↩️
              </div>
              {t('features.easyReturns')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{t('features.easyReturnsDesc')}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;
