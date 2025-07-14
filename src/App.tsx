
import { ApolloProvider } from '@apollo/client';
import { HelmetProvider } from 'react-helmet-async';
import { client } from '@/lib/apollo-client';
import { CartProvider } from '@/contexts/CartContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, Suspense, lazy } from 'react';
import Layout from '@/components/layout/Layout';
import { Loader } from 'lucide-react';

// Lazy load all page components
const HomePage = lazy(() => import('@/pages/HomePage'));
const ShopPage = lazy(() => import('@/pages/ShopPage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('@/pages/OrderSuccessPage'));
const AccountPage = lazy(() => import('@/pages/AccountPage'));
const BlogPage = lazy(() => import('@/pages/BlogPage'));
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage'));
const CategoriesPage = lazy(() => import('@/pages/CategoriesPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const WishlistPage = lazy(() => import('@/pages/WishlistPage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'));
const TermsConditionsPage = lazy(() => import('@/pages/TermsConditionsPage'));
const ShippingInfoPage = lazy(() => import('@/pages/ShippingInfoPage'));
const ReturnsPage = lazy(() => import('@/pages/ReturnsPage'));
const SizeGuidePage = lazy(() => import('@/pages/SizeGuidePage'));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex items-center space-x-2">
      <Loader className="h-6 w-6 animate-spin" />
      <span>Loading...</span>
    </div>
  </div>
);

// Component to handle scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={client}>
        <LanguageProvider>
          <CurrencyProvider>
            <AuthProvider>
              <WishlistProvider>
                <CartProvider>
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                      <ScrollToTop />
                      <Layout>
                        <Suspense fallback={<PageLoader />}>
                          <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/shop" element={<ShopPage />} />
                            <Route path="/categories" element={<CategoriesPage />} />
                            <Route path="/product/:slug" element={<ProductDetailPage />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <Route path="/order-success" element={<OrderSuccessPage />} />
                            <Route path="/account" element={<AccountPage />} />
                            <Route path="/wishlist" element={<WishlistPage />} />
                            <Route path="/blog" element={<BlogPage />} />
                            <Route path="/blog/:slug" element={<BlogPostPage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                            <Route path="/terms-conditions" element={<TermsConditionsPage />} />
                            <Route path="/shipping-info" element={<ShippingInfoPage />} />
                            <Route path="/returns" element={<ReturnsPage />} />
                            <Route path="/size-guide" element={<SizeGuidePage />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </Suspense>
                      </Layout>
                    </BrowserRouter>
                  </TooltipProvider>
                </CartProvider>
              </WishlistProvider>
            </AuthProvider>
          </CurrencyProvider>
        </LanguageProvider>
      </ApolloProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
