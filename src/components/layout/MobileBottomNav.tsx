
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';

const MobileBottomNav = () => {
  const location = useLocation();
  const { state: cartState } = useCart();
  const { t } = useLanguage();

  const navItems = [
    {
      icon: Home,
      label: t('nav.home') || 'Main',
      href: '/',
      current: location.pathname === '/',
    },
    {
      icon: ShoppingBag,
      label: t('nav.shop') || 'Shop',
      href: '/shop',
      current: location.pathname === '/shop',
    },
    {
      icon: ShoppingCart,
      label: t('nav.cart') || 'Cart',
      href: '/cart',
      current: location.pathname === '/cart',
      badge: cartState.itemCount,
    },
    {
      icon: User,
      label: t('nav.account') || 'Account',
      href: '/account',
      current: location.pathname === '/account',
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center px-2 py-1 relative ${
                item.current
                  ? 'text-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge !== undefined && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center min-w-4 text-[10px] font-semibold">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
