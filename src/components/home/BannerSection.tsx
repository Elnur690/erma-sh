
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

const BannerSection = () => {
  const { t } = useLanguage();

  const banners = [
    {
      id: 1,
      title: t('banner.news'),
      description: 'Stay updated with our latest news and announcements',
      image: '/placeholder.svg',
      link: '/blog',
      badge: 'New',
      bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600'
    },
    {
      id: 2,
      title: t('banner.promotions'),
      description: 'Don\'t miss our exclusive promotional offers',
      image: '/placeholder.svg',
      link: '/shop',
      badge: 'Hot',
      bgColor: 'bg-gradient-to-r from-orange-500 to-red-500'
    },
    {
      id: 3,
      title: t('banner.sales'),
      description: 'Up to 50% off on selected items',
      image: '/placeholder.svg',
      link: '/shop',
      badge: 'Sale',
      bgColor: 'bg-gradient-to-r from-green-500 to-green-600'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <Link key={banner.id} to={banner.link}>
            <Card className="group hover:shadow-lg transition-shadow overflow-hidden">
              <div className={`${banner.bgColor} text-white p-6 relative`}>
                <Badge className="absolute top-4 right-4 bg-white text-black">
                  {banner.badge}
                </Badge>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{banner.title}</h3>
                  <p className="text-white/90 text-sm">{banner.description}</p>
                </div>
                <div className="mt-4">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-32 object-cover rounded opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default BannerSection;
