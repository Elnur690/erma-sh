
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SizeGuidePage = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-8">{t('sizeGuide.title')}</h1>
      
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('sizeGuide.clothing.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-2">{t('sizeGuide.size')}</th>
                    <th className="border border-gray-300 p-2">{t('sizeGuide.chest')}</th>
                    <th className="border border-gray-300 p-2">{t('sizeGuide.waist')}</th>
                    <th className="border border-gray-300 p-2">{t('sizeGuide.hips')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2">XS</td>
                    <td className="border border-gray-300 p-2">32-34"</td>
                    <td className="border border-gray-300 p-2">24-26"</td>
                    <td className="border border-gray-300 p-2">34-36"</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">S</td>
                    <td className="border border-gray-300 p-2">34-36"</td>
                    <td className="border border-gray-300 p-2">26-28"</td>
                    <td className="border border-gray-300 p-2">36-38"</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">M</td>
                    <td className="border border-gray-300 p-2">36-38"</td>
                    <td className="border border-gray-300 p-2">28-30"</td>
                    <td className="border border-gray-300 p-2">38-40"</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">L</td>
                    <td className="border border-gray-300 p-2">38-40"</td>
                    <td className="border border-gray-300 p-2">30-32"</td>
                    <td className="border border-gray-300 p-2">40-42"</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">XL</td>
                    <td className="border border-gray-300 p-2">40-42"</td>
                    <td className="border border-gray-300 p-2">32-34"</td>
                    <td className="border border-gray-300 p-2">42-44"</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('sizeGuide.shoes.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-2">{t('sizeGuide.us')}</th>
                    <th className="border border-gray-300 p-2">{t('sizeGuide.eu')}</th>
                    <th className="border border-gray-300 p-2">{t('sizeGuide.uk')}</th>
                    <th className="border border-gray-300 p-2">{t('sizeGuide.cm')}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['6', '36', '3.5', '22.5'],
                    ['7', '37', '4.5', '23.5'],
                    ['8', '38', '5.5', '24.5'],
                    ['9', '39', '6.5', '25.5'],
                    ['10', '40', '7.5', '26.5']
                  ].map(([us, eu, uk, cm], index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">{us}</td>
                      <td className="border border-gray-300 p-2">{eu}</td>
                      <td className="border border-gray-300 p-2">{uk}</td>
                      <td className="border border-gray-300 p-2">{cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SizeGuidePage;
