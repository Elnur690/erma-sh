
import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CartPage = () => {
  const { state, updateQuantity, removeItem } = useCart();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  if (state.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-4">{t('cart.empty')}</h1>
        <p className="text-gray-600 mb-8">{t('cart.emptyDescription')}</p>
        <Link to="/shop">
          <Button size="lg">{t('cart.continueShopping')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('cart.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {state.items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      src={item.image || '/placeholder.svg'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.slug}`}
                      className="text-lg font-medium hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-gray-600 mt-1">
                      {formatPrice(parseFloat(item.price))} {t('cart.each')}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100"
                        disabled={item.quantity <= 1}
                        aria-label={t('cart.decreaseQuantity')}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 min-w-[3rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100"
                        aria-label={t('cart.increaseQuantity')}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-lg font-semibold min-w-[5rem] text-right">
                      {formatPrice(parseFloat(item.price) * item.quantity)}
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label={t('cart.removeItem')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>{t('cart.orderSummary')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>{t('cart.subtotal')} ({state.itemCount} {t('cart.items')})</span>
                <span>{formatPrice(state.total)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>{t('cart.shipping')}</span>
                <span>{t('cart.free')}</span>
              </div>
              
              <div className="flex justify-between">
                <span>{t('cart.tax')}</span>
                <span>{formatPrice(state.total * 0.08)}</span>
              </div>
              
              <hr />
              
              <div className="flex justify-between text-lg font-semibold">
                <span>{t('cart.total')}</span>
                <span>{formatPrice(state.total * 1.08)}</span>
              </div>

              <div className="space-y-2 pt-4">
                <Link to="/checkout" className="w-full">
                  <Button className="w-full" size="lg">
                    {t('cart.proceedToCheckout')}
                  </Button>
                </Link>
                <Link to="/shop" className="w-full">
                  <Button variant="outline" className="w-full">
                    {t('cart.continueShopping')}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
