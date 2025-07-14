import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useQuery } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SEARCH_PRODUCTS } from '@/lib/graphql/queries';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';

const SearchBox = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  const { data, loading } = useQuery(SEARCH_PRODUCTS, {
    variables: { search: searchTerm, first: 5 },
    skip: searchTerm.length < 2,
    errorPolicy: 'all'
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(e.target.value.length > 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder={t('search.placeholder')}
            value={searchTerm}
            onChange={handleInputChange}
            className="pl-10 pr-10 w-full"
            onFocus={() => searchTerm.length > 1 && setIsOpen(true)}
          />
          {searchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>

      {isOpen && searchTerm.length > 1 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto shadow-lg border bg-white">
          <CardContent className="p-2">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Searching...</div>
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
                <Link
                  to={`/shop?search=${encodeURIComponent(searchTerm)}`}
                  onClick={handleResultClick}
                  className="block p-2 text-center text-primary hover:underline text-sm border-t"
                >
                  View all results for "{searchTerm}"
                </Link>
              </div>
            ) : searchTerm.length > 1 ? (
              <div className="p-4 text-center text-gray-500">
                No products found for "{searchTerm}"
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchBox;
