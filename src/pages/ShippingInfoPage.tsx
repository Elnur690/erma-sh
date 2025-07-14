
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Truck, Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ShippingInfoPage = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-8">{t('shipping.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              {t('shipping.standard.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{t('shipping.standard.description')}</p>
            <p className="font-semibold mt-2">{t('shipping.standard.price')}</p>
            <p className="text-sm text-gray-500">{t('shipping.standard.time')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              {t('shipping.express.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{t('shipping.express.description')}</p>
            <p className="font-semibold mt-2">{t('shipping.express.price')}</p>
            <p className="text-sm text-gray-500">{t('shipping.express.time')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              {t('shipping.international.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{t('shipping.international.description')}</p>
            <p className="font-semibold mt-2">{t('shipping.international.price')}</p>
            <p className="text-sm text-gray-500">{t('shipping.international.time')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="prose max-w-none">
        <h2 className="text-2xl font-semibold mb-4">{t('shipping.policies.title')}</h2>
        <p className="mb-4">{t('shipping.policies.content')}</p>
      </div>
    </div>
  );
};

export default ShippingInfoPage;
