
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, X } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const WishlistPage = () => {
  const { items, removeFromWishlist, loading } = useWishlist();
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.salePrice || item.price,
      quantity: 1,
      image: item.image?.sourceUrl,
      slug: item.slug,
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Heart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-4">{t('wishlist.empty')}</h1>
        <p className="text-gray-600 mb-8">{t('wishlist.emptyDescription')}</p>
        <Link to="/shop">
          <Button size="lg">{t('wishlist.continueShopping')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('wishlist.title')} ({items.length})</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeFromWishlist(item.id)}
              className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white"
            >
              <X className="h-4 w-4" />
            </Button>
            
            <CardContent className="p-4">
              <Link to={`/product/${item.slug}`}>
                <img
                  src={item.image?.sourceUrl || '/placeholder.svg'}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              </Link>
              
              <Link
                to={`/product/${item.slug}`}
                className="text-lg font-medium hover:text-primary transition-colors block mb-2"
              >
                {item.name}
              </Link>
              
              <p className="text-xl font-bold text-primary mb-4">
                {formatPrice(parseFloat(item.salePrice || item.price))}
              </p>
              
              <Button
                onClick={() => handleAddToCart(item)}
                className="w-full"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {t('addToCart')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
