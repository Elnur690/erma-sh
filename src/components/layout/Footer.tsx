
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { SUBSCRIBE_NEWSLETTER } from '@/lib/graphql/queries';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribeNewsletter, { loading }] = useMutation(SUBSCRIBE_NEWSLETTER);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data } = await subscribeNewsletter({
        variables: { email }
      });

      if (data?.subscribeNewsletter?.success) {
        toast({
          title: t('newsletter.success') || "Subscribed!",
          description: data.subscribeNewsletter.message || "Thank you for subscribing to our newsletter.",
        });
        setEmail('');
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch (error) {
      toast({
        title: t('newsletter.error') || "Error",
        description: t('newsletter.errorMessage') || "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Erma Shop</h3>
            <p className="text-gray-300 text-sm mb-4">
              {t('footer.description') || 'Your trusted online store for quality products at great prices.'}
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com/erma.shop" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://instagram.com/erma.shop" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.378-1.297l-1.297.49-.49-1.297c-.807-.93-1.297-2.081-1.297-3.378s.49-2.448 1.297-3.378l.49-1.297 1.297.49c.93-.807 2.081-1.297 3.378-1.297s2.448.49 3.378 1.297l1.297-.49.49 1.297c.807.93 1.297 2.081 1.297 3.378s-.49 2.448-1.297 3.378l-.49 1.297-1.297-.49c-.93.807-2.081 1.297-3.378 1.297z"/>
                </svg>
              </a>
              <a 
                href="https://youtube.com/erma.shop" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.quickLinks') || 'Quick Links'}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {t('nav.shop') || 'Shop'}
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {t('nav.categories') || 'Categories'}
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {t('nav.blog') || 'Blog'}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {t('nav.about') || 'About Us'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.customerService') || 'Customer Service'}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {t('nav.contact') || 'Contact Us'}
                </Link>
              </li>
              <li>
                <Link to="/shipping-info" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {t('footer.shippingInfo') || 'Shipping Info'}
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {t('footer.returns') || 'Returns'}
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {t('footer.sizeGuide') || 'Size Guide'}
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {t('footer.privacyPolicy') || 'Privacy Policy'}
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {t('footer.termsConditions') || 'Terms & Conditions'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.newsletter') || 'Newsletter'}</h3>
            <p className="text-gray-300 text-sm mb-4">
              {t('footer.newsletterDescription') || 'Subscribe to get updates on new products and offers.'}
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex">
              <Input
                type="email"
                placeholder={t('footer.emailPlaceholder') || 'Your email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-gray-800 text-white border-gray-700 focus:border-primary"
              />
              <Button 
                type="submit" 
                disabled={loading}
                className="ml-2 bg-primary hover:bg-primary/90"
              >
                {loading ? '...' : (t('footer.subscribe') || 'Subscribe')}
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Erma Shop. {t('footer.allRightsReserved') || 'All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
