
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Package, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrency } from '@/contexts/CurrencyContext';

const OrderSuccessPage = () => {
  const location = useLocation();
  const { formatPrice } = useCurrency();
  const orderData = location.state?.orderData;

  if (!orderData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Order not found</h1>
        <Link to="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-8">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h1 className="text-3xl font-bold text-green-600 mb-2">Order Successful!</h1>
        <p className="text-gray-600">Thank you for your purchase. Your order has been confirmed.</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Order Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Order Number:</p>
              <p className="text-lg">{orderData.orderNumber}</p>
            </div>
            <div>
              <p className="font-semibold">Total Amount:</p>
              <p className="text-lg font-bold text-primary">{formatPrice(orderData.total)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Billing Address:</p>
              <p>{orderData.firstName} {orderData.lastName}</p>
              <p>{orderData.address}</p>
              <p>{orderData.city}, {orderData.postalCode}</p>
              <p>{orderData.country}</p>
            </div>
            <div>
              <p className="font-semibold">Contact Information:</p>
              <p>{orderData.email}</p>
              <p>{orderData.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="h-5 w-5 mr-2" />
            What's Next?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <p className="font-semibold">Order Confirmation</p>
                <p className="text-gray-600">You'll receive an email confirmation shortly with your order details.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <p className="font-semibold">Processing</p>
                <p className="text-gray-600">Your order will be processed and prepared for shipping within 1-2 business days.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <p className="font-semibold">Shipping</p>
                <p className="text-gray-600">Once shipped, you'll receive a tracking number to monitor your delivery.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center space-x-4">
        <Link to="/shop">
          <Button>Continue Shopping</Button>
        </Link>
        <Link to="/account">
          <Button variant="outline">View Order History</Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
