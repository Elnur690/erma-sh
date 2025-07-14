
import React from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { GET_PRODUCT_CATEGORIES } from '@/lib/graphql/queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const CategoriesPage = () => {
  const { t } = useLanguage();
  const { data, loading } = useQuery(GET_PRODUCT_CATEGORIES);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const categories = data?.productCategories?.nodes || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('categories.title')}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t('categories.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category: any) => (
          <Card key={category.id} className="group hover:shadow-lg transition-shadow">
            <Link to={`/shop?category=${category.slug}`}>
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {category.description && (
                  <p className="text-gray-600 mb-4">{category.description}</p>
                )}
                {category.children?.nodes?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">{t('categories.subcategories')}</p>
                    <div className="flex flex-wrap gap-2">
                      {category.children.nodes.slice(0, 3).map((child: any) => (
                        <span
                          key={child.id}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {child.name}
                        </span>
                      ))}
                      {category.children.nodes.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{category.children.nodes.length - 3} {t('categories.more')}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
