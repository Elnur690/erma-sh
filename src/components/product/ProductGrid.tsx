
import React from 'react';
import ProductCard from './ProductCard';
import { useLanguage } from '@/contexts/LanguageContext';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  regularPrice?: string;
  salePrice?: string;
  image?: {
    sourceUrl: string;
    altText: string;
  };
  stockStatus?: string;
  averageRating?: number;
  reviewCount?: number;
}

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  viewMode?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, loading, viewMode = 'grid' }) => {
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className={`grid ${viewMode === 'list' ? 'grid-cols-1 gap-4' : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'}`}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-2">{t('shop.noProducts')}</p>
        <p className="text-gray-400 text-sm">{t('shop.noProductsDescription')}</p>
      </div>
    );
  }

  return (
    <div className={`grid ${viewMode === 'list' ? 'grid-cols-1 gap-4' : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} viewMode={viewMode} />
      ))}
    </div>
  );
};

export default ProductGrid;
