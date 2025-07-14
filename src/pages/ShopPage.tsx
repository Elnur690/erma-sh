import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, List, ChevronDown, ChevronUp } from 'lucide-react';
import { GET_PRODUCTS, GET_PRODUCT_CATEGORIES } from '@/lib/graphql/queries';
import ProductGrid from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [stockFilter, setStockFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('date');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [categoryLimit, setCategoryLimit] = useState(5);
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();

  const searchTerm = searchParams.get('search') || '';

  useEffect(() => {
    const orderby = searchParams.get('orderby');
    if (orderby) {
      setSortBy(orderby);
    }
  }, [searchParams]);

  const { data: productsData, loading: productsLoading, fetchMore, error } = useQuery(GET_PRODUCTS, {
    variables: {
      first: 20
    },
    errorPolicy: 'ignore',
    notifyOnNetworkStatusChange: true
  });

  const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_PRODUCT_CATEGORIES, {
    errorPolicy: 'ignore'
  });

  // Log any errors for debugging
  React.useEffect(() => {
    if (error) {
      console.error('Shop GraphQL Error:', error);
    }
  }, [error]);

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    }
  };

  const handleStockFilterChange = (filter: string, checked: boolean) => {
    if (checked) {
      setStockFilter([...stockFilter, filter]);
    } else {
      setStockFilter(stockFilter.filter(f => f !== filter));
    }
  };

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const handleLoadMore = () => {
    if (productsData?.products?.pageInfo?.hasNextPage) {
      fetchMore({
        variables: {
          after: productsData.products.pageInfo.endCursor
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          
          return {
            products: {
              ...fetchMoreResult.products,
              nodes: [...prev.products.nodes, ...fetchMoreResult.products.nodes],
            },
          };
        },
      });
    }
  };

  // Filter products client-side for now
  const filteredProducts = React.useMemo(() => {
    let products = productsData?.products?.nodes || [];
    
    // Apply search filter
    if (searchTerm) {
      products = products.filter((product: any) => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      products = products.filter((product: any) =>
        product.productCategories?.nodes?.some((cat: any) => 
          selectedCategories.includes(cat.id)
        )
      );
    }
    
    // Apply price filter
    products = products.filter((product: any) => {
      const price = parseFloat(product.salePrice || product.price || '0');
      return price >= priceRange[0] && price <= priceRange[1];
    });
    
    // Apply stock filter
    if (stockFilter.includes('in-stock')) {
      products = products.filter((product: any) => 
        product.stockStatus === 'IN_STOCK'
      );
    }
    
    if (stockFilter.includes('on-sale')) {
      products = products.filter((product: any) => product.onSale);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        products.sort((a: any, b: any) => 
          parseFloat(a.salePrice || a.price || '0') - parseFloat(b.salePrice || b.price || '0')
        );
        break;
      case 'price-high':
        products.sort((a: any, b: any) => 
          parseFloat(b.salePrice || b.price || '0') - parseFloat(a.salePrice || a.price || '0')
        );
        break;
      case 'name':
        products.sort((a: any, b: any) => a.name.localeCompare(b.name));
        break;
      default:
        // Keep original order for newest/popularity
        break;
    }
    
    return products;
  }, [productsData?.products?.nodes, searchTerm, selectedCategories, priceRange, stockFilter, sortBy]);

  const displayedCategories = showAllCategories 
    ? categoriesData?.productCategories?.nodes || []
    : (categoriesData?.productCategories?.nodes || []).slice(0, categoryLimit);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t('shop.title') || 'Shop'}</h1>
          <p className="text-gray-600 mt-2">
            {searchTerm && `${t('shop.searchResults') || 'Search results for'} "${searchTerm}" - `}
            {filteredProducts.length} {t('shop.productsFound') || 'products found'}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t('shop.sortBy') || 'Sort by'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">{t('shop.sortNewest') || 'Newest'}</SelectItem>
              <SelectItem value="popularity">{t('shop.sortPopular') || 'Most Popular'}</SelectItem>
              <SelectItem value="price-low">{t('shop.sortPriceLow') || 'Price: Low to High'}</SelectItem>
              <SelectItem value="price-high">{t('shop.sortPriceHigh') || 'Price: High to Low'}</SelectItem>
              <SelectItem value="name">{t('shop.sortName') || 'Name'}</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode */}
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <Filter className="h-4 w-4 mr-2" />
            {t('shop.filters') || 'Filters'}
          </Button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className={`w-64 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          {/* Categories */}
          {!categoriesLoading && categoriesData?.productCategories?.nodes?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t('shop.categories') || 'Categories'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {displayedCategories.map((category: any) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.id}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                    />
                    <Label htmlFor={category.id} className="text-sm">
                      {category.name}
                    </Label>
                  </div>
                ))}
                
                {(categoriesData?.productCategories?.nodes || []).length > categoryLimit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowAllCategories(!showAllCategories);
                      setCategoryLimit(showAllCategories ? 5 : 50);
                    }}
                    className="w-full mt-2"
                  >
                    {showAllCategories ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        {t('shop.showLess') || 'Show Less'}
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        {t('shop.showMore') || 'Show More'}
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Price Range */}
          <Card>
            <CardHeader>
              <CardTitle>{t('shop.priceRange') || 'Price Range'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Slider
                  value={priceRange}
                  onValueChange={handlePriceRangeChange}
                  max={1000}
                  min={0}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle>{t('shop.availability') || 'Availability'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="in-stock"
                    checked={stockFilter.includes('in-stock')}
                    onCheckedChange={(checked) => handleStockFilterChange('in-stock', checked as boolean)}
                  />
                  <Label htmlFor="in-stock" className="text-sm">{t('shop.inStock') || 'In Stock'}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="on-sale"
                    checked={stockFilter.includes('on-sale')}
                    onCheckedChange={(checked) => handleStockFilterChange('on-sale', checked as boolean)}
                  />
                  <Label htmlFor="on-sale" className="text-sm">{t('shop.onSale') || 'On Sale'}</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Products */}
        <div className="flex-1">
          {filteredProducts.length === 0 && !productsLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t('shop.noProducts') || 'No products found.'}</p>
            </div>
          ) : (
            <ProductGrid 
              products={filteredProducts} 
              loading={productsLoading}
              viewMode={viewMode}
            />
          )}

          {/* Load More */}
          {productsData?.products?.pageInfo?.hasNextPage && (
            <div className="mt-8 text-center">
              <Button variant="outline" onClick={handleLoadMore}>
                {t('shop.loadMore') || 'Load More'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
