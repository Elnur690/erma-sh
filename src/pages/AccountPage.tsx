
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { User, Package, Settings, LogOut, MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { GET_CUSTOMER_ORDERS, GET_CUSTOMER_ADDRESSES, UPDATE_CUSTOMER_ADDRESS } from '@/lib/graphql/queries';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import AddressForm, { Address } from '@/components/account/AddressForm';
import AddressCard from '@/components/account/AddressCard';

type AuthMode = 'login' | 'register' | 'forgot-password';

const AccountPage = () => {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  
  // Address management state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deleteConfirmAddress, setDeleteConfirmAddress] = useState<string | null>(null);

  // Get customer orders from API
  const { data: ordersData, loading: ordersLoading, error: ordersError } = useQuery(GET_CUSTOMER_ORDERS, {
    skip: !isAuthenticated,
    errorPolicy: 'all'
  });

  // Get customer addresses from API
  const { data: addressesData, loading: addressesLoading, refetch: refetchAddresses } = useQuery(GET_CUSTOMER_ADDRESSES, {
    skip: !isAuthenticated,
    errorPolicy: 'all'
  });

  // Update customer address mutation
  const [updateCustomerAddress] = useMutation(UPDATE_CUSTOMER_ADDRESS, {
    onCompleted: () => {
      toast({
        title: t('account.addressUpdated') || 'Address updated',
        description: t('account.addressUpdatedMessage') || 'Your address has been updated successfully.',
      });
      refetchAddresses();
    },
    onError: (error) => {
      console.error('Address update error:', error);
      toast({
        title: t('account.error') || 'Error',
        description: error.message || 'Failed to update address.',
        variant: 'destructive',
      });
    }
  });

  console.log('Orders data:', ordersData);
  console.log('Orders error:', ordersError);
  console.log('Addresses data:', addressesData);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {authMode === 'login' && (
          <LoginForm
            onSwitchToRegister={() => setAuthMode('register')}
            onForgotPassword={() => setAuthMode('forgot-password')}
          />
        )}
        {authMode === 'register' && (
          <RegisterForm
            onSwitchToLogin={() => setAuthMode('login')}
          />
        )}
        {authMode === 'forgot-password' && (
          <ForgotPasswordForm
            onBackToLogin={() => setAuthMode('login')}
          />
        )}
      </div>
    );
  }

  const handleSaveAddress = async (addressData: Omit<Address, 'id'>) => {
    try {
      console.log('Saving address:', addressData);
      
      const input = {
        [addressData.type]: {
          firstName: addressData.firstName,
          lastName: addressData.lastName,
          company: addressData.company || '',
          address1: addressData.streetAddress,
          address2: addressData.apartment || '',
          city: addressData.city,
          state: addressData.state,
          postcode: addressData.postalCode,
          country: addressData.country,
          phone: addressData.phone || '',
        }
      };

      console.log('Mutation input:', input);

      await updateCustomerAddress({
        variables: { input }
      });

      setShowAddressForm(false);
      setEditingAddress(null);
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    // For now, we'll just show a message that deletion isn't implemented
    toast({
      title: t('account.info') || 'Info',
      description: 'Address deletion will be implemented with backend integration.',
    });
    setDeleteConfirmAddress(null);
  };

  const orders = ordersData?.customer?.orders?.nodes || [];
  
  // Convert API address data to our Address interface - handle null values properly
  const convertApiAddress = (apiAddress: any, type: 'shipping' | 'billing'): Address | null => {
    console.log(`Converting ${type} address:`, apiAddress);
    
    // Check if we have any meaningful address data
    if (!apiAddress || 
        (!apiAddress.firstName && !apiAddress.lastName && !apiAddress.address1 && !apiAddress.city)) {
      console.log(`No meaningful ${type} address data found`);
      return null;
    }
    
    return {
      id: type,
      type,
      firstName: apiAddress.firstName || '',
      lastName: apiAddress.lastName || '',
      company: apiAddress.company || '',
      streetAddress: apiAddress.address1 || '',
      apartment: apiAddress.address2 || '',
      city: apiAddress.city || '',
      state: apiAddress.state || '',
      postalCode: apiAddress.postcode || '',
      country: apiAddress.country || 'AZ',
      phone: apiAddress.phone || '',
      isDefault: true,
    };
  };

  const shippingAddress = addressesData?.customer?.shipping ? 
    convertApiAddress(addressesData.customer.shipping, 'shipping') : null;
  const billingAddress = addressesData?.customer?.billing ? 
    convertApiAddress(addressesData.customer.billing, 'billing') : null;

  const shippingAddresses = shippingAddress ? [shippingAddress] : [];
  const billingAddresses = billingAddress ? [billingAddress] : [];

  console.log('Shipping addresses:', shippingAddresses);
  console.log('Billing addresses:', billingAddresses);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{t('account.title')}</h1>
        <Button variant="outline" onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" />
          {t('account.logout')}
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>{t('account.profile')}</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center space-x-2">
            <Package className="h-4 w-4" />
            <span>{t('account.orders')}</span>
          </TabsTrigger>
          <TabsTrigger value="addresses" className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>{t('account.addresses')}</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>{t('account.settings')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>{t('account.profileInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">{t('account.name')}</Label>
                  <Input id="name" defaultValue={user?.name || ''} />
                </div>
                <div>
                  <Label htmlFor="email">{t('account.email')}</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ''} />
                </div>
              </div>
              <Button>{t('account.updateProfile')}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{t('account.orderHistory')}</h2>
            {ordersLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="pt-6">
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : ordersError || orders.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-600">
                    {ordersError 
                      ? t('account.ordersError') || 'Unable to load orders. Please try again later.'
                      : t('account.noOrders')
                    }
                  </p>
                  {ordersError && (
                    <p className="text-sm text-gray-500 mt-2">
                      Error: {ordersError.message}
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : (
              orders.map((order: any) => (
                <Card key={order.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{t('account.orderNumber')}: {order.orderNumber}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm">
                          {order.lineItems?.nodes?.length || 0} {t('account.items')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatPrice(parseFloat(order.total))}</p>
                        <p className="text-sm text-blue-600">{order.status}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="addresses">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{t('account.addressBook')}</h2>
              <Button onClick={() => setShowAddressForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t('account.addAddress')}
              </Button>
            </div>

            {addressesLoading && (
              <div className="text-center py-4">
                <p>Loading addresses...</p>
              </div>
            )}

            {showAddressForm && (
              <AddressForm
                address={editingAddress || undefined}
                onSave={handleSaveAddress}
                onCancel={() => {
                  setShowAddressForm(false);
                  setEditingAddress(null);
                }}
              />
            )}

            {!showAddressForm && !addressesLoading && (
              <>
                <div>
                  <h3 className="text-lg font-medium mb-4">{t('account.shippingAddresses')}</h3>
                  {shippingAddresses.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <p className="text-gray-600">
                          {t('account.noShippingAddresses') || 'No shipping addresses found. Add one using the button above.'}
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {shippingAddresses.map((address) => (
                        <AddressCard
                          key={address.id}
                          address={address}
                          onEdit={handleEditAddress}
                          onDelete={setDeleteConfirmAddress}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">{t('account.billingAddresses')}</h3>
                  {billingAddresses.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <p className="text-gray-600">
                          {t('account.noBillingAddresses') || 'No billing addresses found. Add one using the button above.'}
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {billingAddresses.map((address) => (
                        <AddressCard
                          key={address.id}
                          address={address}
                          onEdit={handleEditAddress}
                          onDelete={setDeleteConfirmAddress}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>{t('account.accountSettings')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">{t('account.currentPassword')}</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div>
                <Label htmlFor="newPassword">{t('account.newPassword')}</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div>
                <Label htmlFor="confirmPassword">{t('account.confirmPassword')}</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button>{t('account.changePassword')}</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!deleteConfirmAddress} onOpenChange={() => setDeleteConfirmAddress(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('account.deleteAddress')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('account.confirmDeleteAddress')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('account.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteConfirmAddress && handleDeleteAddress(deleteConfirmAddress)}>
              {t('account.deleteAddress')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AccountPage;
