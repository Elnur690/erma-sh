
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, Heart, Search } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import CurrencySwitcher from '@/components/common/CurrencySwitcher';
import SearchModal from '@/components/common/SearchModal';
import SearchBox from '@/components/common/SearchBox';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { state: cartState } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const isMobile = useIsMobile();

  const navigation = [
    { name: t('nav.home') || 'Home', href: '/', current: location.pathname === '/' },
    // Remove shop from mobile menu since it's in bottom nav
    ...(isMobile ? [] : [{ name: t('nav.shop') || 'Shop', href: '/shop', current: location.pathname === '/shop' }]),
    { name: t('nav.categories') || 'Categories', href: '/categories', current: location.pathname === '/categories' },
    { name: t('nav.blog') || 'Blog', href: '/blog', current: location.pathname === '/blog' },
    { name: t('nav.about') || 'About', href: '/about', current: location.pathname === '/about' },
    { name: t('nav.contact') || 'Contact', href: '/contact', current: location.pathname === '/contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-primary">
                <img src="/Logo.webp" alt="Erma Shop Logo" className="h-8 w-auto" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    item.current
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-700'
                  }`}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-1 md:space-x-2">
              {/* Search - Desktop: Button, Mobile: Always visible search box */}
              {isMobile ? (
                <div className="flex-1 max-w-xs mr-2">
                  <SearchBox />
                </div>
              ) : (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                  className="flex-shrink-0"
                >
                  <Search className="h-4 w-4" />
                </Button>
              )}

              {/* Desktop-only Language and Currency Switchers */}
              <div className="hidden md:flex items-center space-x-2">
                <LanguageSwitcher />
                <CurrencySwitcher />
              </div>

              {/* Desktop-only Wishlist, Account, Cart */}
              <div className="hidden md:flex items-center space-x-2">
                {/* Wishlist */}
                <Link to="/wishlist" className="relative">
                  <Button variant="ghost" size="icon">
                    <Heart className="h-4 w-4" />
                    {wishlistItems.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs">
                        {wishlistItems.length}
                      </Badge>
                    )}
                  </Button>
                </Link>

                {/* Account */}
                <Link to="/account">
                  <Button variant="ghost" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                </Link>

                {/* Cart */}
                <Link to="/cart" className="relative">
                  <Button variant="ghost" size="icon">
                    <ShoppingCart className="h-4 w-4" />
                    {cartState.itemCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs">
                        {cartState.itemCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              </div>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden flex-shrink-0"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-3 py-2 text-base font-medium transition-colors ${
                      item.current
                        ? 'text-primary bg-primary/10'
                        : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Mobile Language and Currency Switchers */}
                <div className="px-3 py-2 flex space-x-2">
                  <LanguageSwitcher />
                  <CurrencySwitcher />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Search Modal - Desktop only */}
      {!isMobile && (
        <SearchModal 
          isOpen={isSearchOpen} 
          onClose={() => setIsSearchOpen(false)} 
        />
      )}
    </>
  );
};

export default Header;
