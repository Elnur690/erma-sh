
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';
import FloatingContact from '@/components/common/FloatingContact';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Erma Shop - Quality Products at Great Prices';
      case '/shop':
        return 'Shop - Erma Shop';
      case '/about':
        return 'About Us - Erma Shop';
      case '/contact':
        return 'Contact Us - Erma Shop';
      case '/cart':
        return 'Shopping Cart - Erma Shop';
      case '/checkout':
        return 'Checkout - Erma Shop';
      case '/wishlist':
        return 'Wishlist - Erma Shop';
      case '/blog':
        return 'Blog - Erma Shop';
      case '/privacy-policy':
        return 'Privacy Policy - Erma Shop';
      case '/terms-conditions':
        return 'Terms & Conditions - Erma Shop';
      case '/shipping-info':
        return 'Shipping Info - Erma Shop';
      case '/returns':
        return 'Returns - Erma Shop';
      case '/size-guide':
        return 'Size Guide - Erma Shop';
      default:
        return 'Erma Shop';
    }
  };

  const getPageDescription = () => {
    switch (location.pathname) {
      case '/':
        return 'Discover quality products at great prices. Shop our wide selection of items with free shipping, secure payments, and easy returns.';
      case '/shop':
        return 'Browse our complete collection of products. Find exactly what you need with our advanced filters and sorting options.';
      case '/about':
        return 'Learn more about Erma Shop, our mission, and our commitment to providing quality products and excellent customer service.';
      case '/contact':
        return 'Get in touch with our customer service team. We\'re here to help with any questions or concerns you may have.';
      case '/privacy-policy':
        return 'Read our privacy policy to understand how we collect, use, and protect your personal information.';
      case '/terms-conditions':
        return 'Review our terms and conditions for using Erma Shop services and making purchases.';
      case '/shipping-info':
        return 'Learn about our shipping options, delivery times, and shipping costs for your orders.';
      case '/returns':
        return 'Find information about our return policy, how to return items, and refund processes.';
      case '/size-guide':
        return 'Use our comprehensive size guide to find the perfect fit for clothing and accessories.';
      default:
        return 'Erma Shop - Your trusted online store for quality products at great prices.';
    }
  };

  return (
    <>
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta name="description" content={getPageDescription()} />
        <meta name="keywords" content="online shop, ecommerce, quality products, great prices, free shipping" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={getPageTitle()} />
        <meta property="og:description" content={getPageDescription()} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://erma.shop${location.pathname}`} />
        <meta property="og:image" content="https://erma.shop/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={getPageTitle()} />
        <meta name="twitter:description" content={getPageDescription()} />
        <meta name="twitter:image" content="https://erma.shop/og-image.jpg" />
        <link rel="canonical" href={`https://erma.shop${location.pathname}`} />
        
        {/* PWA Meta Tags */}
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Erma Shop" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pb-16 md:pb-0">
          {children}
        </main>
        <Footer />
        <MobileBottomNav />
        <FloatingContact />
      </div>
    </>
  );
};

export default Layout;
