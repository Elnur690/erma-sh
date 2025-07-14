
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SEARCH_PRODUCTS } from '@/lib/graphql/queries';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  const { data, loading } = useQuery(SEARCH_PRODUCTS, {
    variables: { search: searchTerm, first: 10 },
    skip: searchTerm.length < 2,
    errorPolicy: 'all'
  });

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  const handleResultClick = () => {
    onClose();
    setSearchTerm('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('search.title') || 'Search Products'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder={t('search.placeholder') || 'Search products...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {searchTerm.length > 1 && (
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">
                  {t('search.searching') || 'Searching...'}
                </div>
              ) : data?.products?.nodes?.length > 0 ? (
                <div className="space-y-2">
                  {data.products.nodes.map((product: any) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.slug}`}
                      onClick={handleResultClick}
                      className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        {product.image ? (
                          <img
                            src={product.image.sourceUrl}
                            alt={product.image.altText || product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-400">No img</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{product.name}</p>
                        <p className="text-primary font-semibold text-sm">
                          {formatPrice(parseFloat(product.salePrice || product.price))}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  {t('search.noResults') || `No products found for "${searchTerm}"`}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
