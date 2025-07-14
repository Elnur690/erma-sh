
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '@/lib/graphql/queries';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface WishlistItem {
  id: string;
  name: string;
  slug: string;
  image?: {
    sourceUrl: string;
    altText: string;
  };
  price: string;
  regularPrice?: string;
  salePrice?: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Since wishlist field doesn't exist in the API, we'll use localStorage for now
  // and try to fetch product details for wishlist items
  const { data: productsData, loading } = useQuery(GET_PRODUCTS, {
    variables: { first: 100 },
    skip: !isAuthenticated || wishlistIds.length === 0,
  });

  useEffect(() => {
    if (isAuthenticated) {
      // Load wishlist from localStorage
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        try {
          const parsedWishlist = JSON.parse(savedWishlist);
          setWishlistIds(parsedWishlist);
        } catch (error) {
          console.error('Error parsing wishlist from localStorage:', error);
        }
      }
    } else {
      setWishlistIds([]);
      setItems([]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (productsData?.products?.nodes && wishlistIds.length > 0) {
      const wishlistItems = productsData.products.nodes.filter((product: any) =>
        wishlistIds.includes(product.id)
      );
      setItems(wishlistItems);
    } else {
      setItems([]);
    }
  }, [productsData, wishlistIds]);

  const isInWishlist = (productId: string): boolean => {
    return wishlistIds.includes(productId);
  };

  const addToWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to add items to wishlist",
        variant: "destructive",
      });
      return;
    }

    if (!wishlistIds.includes(productId)) {
      const newWishlistIds = [...wishlistIds, productId];
      setWishlistIds(newWishlistIds);
      localStorage.setItem('wishlist', JSON.stringify(newWishlistIds));
      
      toast({
        title: "Added to wishlist",
        description: "Item has been added to your wishlist",
      });
    }
  };

  const removeFromWishlist = async (productId: string) => {
    const newWishlistIds = wishlistIds.filter(id => id !== productId);
    setWishlistIds(newWishlistIds);
    localStorage.setItem('wishlist', JSON.stringify(newWishlistIds));
    
    toast({
      title: "Removed from wishlist",
      description: "Item has been removed from your wishlist",
    });
  };

  return (
    <WishlistContext.Provider value={{
      items,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      loading
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
