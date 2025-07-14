import React from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { GET_PRODUCTS } from '@/lib/graphql/queries';
import ProductGrid from '@/components/product/ProductGrid';
import HeroSlider from '@/components/home/HeroSlider';
import BannerSection from '@/components/home/BannerSection';
import BlogPreview from '@/components/home/BlogPreview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const HomePage = () => {
  const { t } = useLanguage();
  
  // Simple query without complex filtering
  const { data: productsData, loading: productsLoading, error } = useQuery(GET_PRODUCTS, {
    variables: { 
      first: 12
    },
    errorPolicy: 'ignore'
  });

  // Log any errors for debugging
  React.useEffect(() => {
    if (error) {
      console.error('GraphQL Error:', error);
    }
  }, [error]);

  const products = productsData?.products?.nodes || [];

  return (
    <div className="space-y-16">
      {/* Hero Section - Now a Slider */}
      <HeroSlider />

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">{t('featured.title')}</h2>
          <Link to="/shop">
            <Button variant="outline">
              {t('viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <ProductGrid 
          products={products.slice(0, 8)} 
          loading={productsLoading}
        />
      </section>

      {/* Best Selling Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">{t('bestselling.title')}</h2>
          <Link to="/shop?orderby=total_sales">
            <Button variant="outline">
              {t('viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <ProductGrid 
          products={products.slice(4, 12)} 
          loading={productsLoading}
        />
      </section>

      {/* Newest Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">{t('newest.title')}</h2>
          <Link to="/shop?orderby=date">
            <Button variant="outline">
              {t('viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <ProductGrid 
          products={products.slice(0, 8)} 
          loading={productsLoading}
        />
      </section>

      {/* Banners Section */}
      <BannerSection />

      {/* Latest Blog Posts */}
      <BlogPreview />
    </div>
  );
};

export default HomePage;