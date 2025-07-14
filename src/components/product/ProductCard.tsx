
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: {
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
  };
  viewMode?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      quantity: 1,
      image: product.image?.sourceUrl,
      slug: product.slug,
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const isOnSale = product.salePrice && product.regularPrice && product.salePrice !== product.regularPrice;
  const isOutOfStock = product.stockStatus === 'OUT_OF_STOCK';
  const rating = product.averageRating || 0;

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-3 w-3 ${
            i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      );
    }
    return stars;
  };

  if (viewMode === 'list') {
    return (
      <Card className="group hover:shadow-lg transition-shadow duration-300">
        <div className="flex">
          <Link to={`/product/${product.slug}`} className="flex-shrink-0">
            <div className="relative w-32 h-32 overflow-hidden rounded-l-lg">
              {product.image ? (
                <img
                  src={product.image.sourceUrl}
                  alt={product.image.altText || product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No image</span>
                </div>
              )}
              
              {isOnSale && (
                <Badge className="absolute top-2 left-2 bg-red-500 text-xs">
                  Sale
                </Badge>
              )}
              
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                </div>
              )}
            </div>
          </Link>

          <CardContent className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <Link to={`/product/${product.slug}`}>
                <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">
                  {product.name}
                </h3>
              </Link>

              <div className="flex items-center space-x-2 mb-2">
                {isOnSale ? (
                  <>
                    <span className="font-bold text-primary">
                      {formatPrice(parseFloat(product.salePrice || product.price || '0'))}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(parseFloat(product.regularPrice || product.price || '0'))}
                    </span>
                  </>
                ) : (
                  <span className="font-bold text-primary">
                    {formatPrice(parseFloat(product.price || '0'))}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-1 mb-2">
                {renderStars(rating)}
                {product.reviewCount && product.reviewCount > 0 && (
                  <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button 
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 px-3 sm:px-4"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {t('addToCart')}
              </Button>
              <Button variant="secondary" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  // Grid view (default)
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
      <Link to={`/product/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          {product.image ? (
            <img
              src={product.image.sourceUrl}
              alt={product.image.altText || product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          
          {isOnSale && (
            <Badge className="absolute top-2 left-2 bg-red-500">
              Sale
            </Badge>
          )}
          
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}

          {/* Quick actions */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="secondary" size="icon" className="mb-2">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              {isOnSale ? (
                <>
                  <span className="font-bold text-primary">
                    {formatPrice(parseFloat(product.salePrice || product.price || '0'))}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(parseFloat(product.regularPrice || product.price || '0'))}
                  </span>
                </>
              ) : (
                <span className="font-bold text-primary">
                  {formatPrice(parseFloat(product.price || '0'))}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-1 mt-1">
              {renderStars(rating)}
              {product.reviewCount && product.reviewCount > 0 && (
                <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
              )}
            </div>
          </div>
        </div>

        <Button 
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="w-full"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {t('addToCart')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
