
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Minus, Plus, ShoppingCart, Heart, Share2, Star } from 'lucide-react';
import { GET_PRODUCT_BY_SLUG } from '@/lib/graphql/queries';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import ProductGrid from '@/components/product/ProductGrid';
import ProductReviews from '@/components/product/ProductReviews';
import { useToast } from '@/hooks/use-toast';

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data, loading, error } = useQuery(GET_PRODUCT_BY_SLUG, {
    variables: { slug: slug || '' },
    skip: !slug,
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-200 aspect-square rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link to="/shop">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const product = data.product;
  const images = [product.image, ...(product.galleryImages?.nodes || [])].filter(Boolean);
  const isOnSale = product.salePrice && product.regularPrice && product.salePrice !== product.regularPrice;
  const isOutOfStock = product.stockStatus === 'OUT_OF_STOCK';

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      quantity,
      image: product.image?.sourceUrl,
      slug: product.slug,
    });

    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} has been added to your cart.`,
    });
  };

  const adjustQuantity = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={images[selectedImage]?.sourceUrl || '/placeholder.svg'}
              alt={images[selectedImage]?.altText || product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image.sourceUrl}
                    alt={image.altText || product.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              {product.productCategories?.nodes.map((category) => (
                <Badge key={category.id} variant="secondary">
                  {category.name}
                </Badge>
              ))}
              {isOnSale && <Badge className="bg-red-500">Sale</Badge>}
            </div>
            
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                {isOnSale ? (
                  <>
                    <span className="text-3xl font-bold text-primary">
                      {formatPrice(parseFloat(product.salePrice))}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(parseFloat(product.regularPrice))}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(parseFloat(product.price))}
                  </span>
                )}
              </div>
            </div>

            {product.averageRating > 0 && (
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= product.averageRating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.reviewCount} reviews)
                </span>
              </div>
            )}
          </div>

          {product.shortDescription && (
            <div className="prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ __html: product.shortDescription }} />
            </div>
          )}

          {!isOutOfStock && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border rounded-md">
                  <button
                    onClick={() => adjustQuantity(-1)}
                    className="p-2 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={() => adjustQuantity(1)}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button onClick={handleAddToCart} className="flex-1" size="lg">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {t('addToCart')}
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {isOutOfStock && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 font-medium">This product is currently out of stock.</p>
            </div>
          )}
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="mb-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({product.reviewCount || 0})</TabsTrigger>
          <TabsTrigger value="shipping">Shipping Info</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              {product.description ? (
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                </div>
              ) : (
                <p className="text-gray-500">No description available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews" className="mt-6">
          <ProductReviews 
            productId={product.id}
            averageRating={product.averageRating}
            reviewCount={product.reviewCount}
          />
        </TabsContent>
        
        <TabsContent value="shipping" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Free Shipping</h3>
                  <p className="text-gray-600">Free shipping on orders over $50. Delivery within 3-5 business days.</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Express Shipping</h3>
                  <p className="text-gray-600">Express delivery available for $9.99. Delivery within 1-2 business days.</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Returns</h3>
                  <p className="text-gray-600">30-day return policy. Items must be in original condition.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {product.related?.nodes && product.related.nodes.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <ProductGrid products={product.related.nodes} />
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
