
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@apollo/client';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { GET_PAYMENT_METHODS, CREATE_ORDER } from '@/lib/graphql/queries';
import { useToast } from '@/hooks/use-toast';

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  paymentMethod: string;
}

const CheckoutPage = () => {
  const { state: cartState, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<CheckoutFormData>({
    defaultValues: {
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ')[1] || '',
      email: user?.email || '',
      paymentMethod: 'card'
    }
  });

  const selectedPaymentMethod = watch('paymentMethod');

  // Get payment methods from backend
  const { data: paymentMethodsData } = useQuery(GET_PAYMENT_METHODS, {
    errorPolicy: 'all'
  });

  const [createOrder] = useMutation(CREATE_ORDER);

  const subtotal = cartState.total;
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 5;
  const total = subtotal + tax + shipping;

  const onSubmit = async (data: CheckoutFormData) => {
    if (!isAuthenticated) {
      toast({
        title: t('checkout.loginRequired'),
        description: t('checkout.loginRequiredMessage'),
        variant: 'destructive',
      });
      navigate('/account');
      return;
    }

    setIsProcessing(true);
    
    try {
      const orderInput = {
        billing: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address1: data.address,
          city: data.city,
          postcode: data.postalCode,
          country: data.country,
        },
        paymentMethod: data.paymentMethod,
        lineItems: cartState.items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      const { data: orderData } = await createOrder({
        variables: { input: orderInput }
      });

      if (orderData?.checkout?.order) {
        clearCart();
        
        // If there's a payment URL, redirect to it
        if (orderData.checkout.paymentUrl) {
          window.location.href = orderData.checkout.paymentUrl;
        } else {
          navigate('/order-success', { 
            state: { 
              orderData: { 
                ...data, 
                total, 
                orderNumber: orderData.checkout.order.orderNumber,
                orderId: orderData.checkout.order.id
              }
            }
          });
        }
      }
    } catch (error) {
      console.error('Order processing failed:', error);
      toast({
        title: t('checkout.error'),
        description: t('checkout.errorMessage'),
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartState.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">{t('cart.empty')}</h1>
        <Button onClick={() => navigate('/shop')}>{t('cart.continueShopping')}</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('checkout.title')}</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Billing Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('checkout.billingDetails')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">{t('checkout.firstName')} *</Label>
                    <Input 
                      id="firstName"
                      {...register('firstName', { required: t('checkout.firstNameRequired') })}
                      className={errors.firstName ? 'border-red-500' : ''}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">{t('checkout.lastName')} *</Label>
                    <Input 
                      id="lastName"
                      {...register('lastName', { required: t('checkout.lastNameRequired') })}
                      className={errors.lastName ? 'border-red-500' : ''}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">{t('checkout.email')} *</Label>
                  <Input 
                    id="email"
                    type="email"
                    {...register('email', { 
                      required: t('checkout.emailRequired'),
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: t('checkout.invalidEmail')
                      }
                    })}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">{t('checkout.phone')} *</Label>
                  <Input 
                    id="phone"
                    {...register('phone', { required: t('checkout.phoneRequired') })}
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="address">{t('checkout.address')} *</Label>
                  <Input 
                    id="address"
                    {...register('address', { required: t('checkout.addressRequired') })}
                    className={errors.address ? 'border-red-500' : ''}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">{t('checkout.city')} *</Label>
                    <Input 
                      id="city"
                      {...register('city', { required: t('checkout.cityRequired') })}
                      className={errors.city ? 'border-red-500' : ''}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="postalCode">{t('checkout.postalCode')} *</Label>
                    <Input 
                      id="postalCode"
                      {...register('postalCode', { required: t('checkout.postalCodeRequired') })}
                      className={errors.postalCode ? 'border-red-500' : ''}
                    />
                    {errors.postalCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="country">{t('checkout.country')} *</Label>
                  <Input 
                    id="country"
                    {...register('country', { required: t('checkout.countryRequired') })}
                    className={errors.country ? 'border-red-500' : ''}
                  />
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>{t('checkout.paymentMethod')}</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="card" {...register('paymentMethod')}>
                  {paymentMethodsData?.paymentGateways?.filter((method: any) => method.enabled)?.map((method: any) => (
                    <div key={method.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                        <div>
                          <div className="font-medium">{method.title}</div>
                          {method.description && (
                            <div className="text-sm text-gray-500 mt-1">{method.description}</div>
                          )}
                        </div>
                      </Label>
                    </div>
                  )) || (
                    <div className="text-gray-500 text-sm">{t('checkout.noPaymentMethods')}</div>
                  )}
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>{t('checkout.orderSummary')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-2">
                  {cartState.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span>{formatPrice(parseFloat(item.price) * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{t('checkout.subtotal')} ({cartState.itemCount} {t('checkout.items')})</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('checkout.shipping')}</span>
                    <span>{shipping === 0 ? t('checkout.free') : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('checkout.tax')}</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>{t('checkout.total')}</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? t('checkout.processing') : t('checkout.placeOrder')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
