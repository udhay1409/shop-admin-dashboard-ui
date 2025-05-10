
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Truck, MapPin } from 'lucide-react';
import BreadcrumbNav from '@/components/store/BreadcrumbNav';

const OrderConfirmationPage: React.FC = () => {
  // Mock order details
  const orderDetails = {
    orderNumber: 'ORD-2025-12345',
    orderDate: 'May 10, 2025',
    total: '$289.96',
    email: 'customer@example.com',
    shippingAddress: '123 Main Street, City, State, ZIP',
    estimatedDelivery: 'May 15-17, 2025'
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <BreadcrumbNav 
        items={[
          { label: "Order Confirmation", href: "/store/order-confirmation", isCurrent: true }
        ]} 
      />
      
      <div className="max-w-2xl mx-auto my-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
        <p className="text-xl mb-6">Your order has been received and is being processed.</p>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Order Number:</span>
              <span>{orderDetails.orderNumber}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Order Date:</span>
              <span>{orderDetails.orderDate}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Total:</span>
              <span>{orderDetails.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Confirmation sent to:</span>
              <span>{orderDetails.email}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-8 mb-12">
          <div className="flex items-start">
            <div className="bg-[#EC008C] p-2 rounded-full mr-4">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-lg mb-1">Processing Your Order</h3>
              <p className="text-gray-600">We've received your order and are preparing it for shipment.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-[#EC008C] p-2 rounded-full mr-4">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-lg mb-1">Estimated Delivery</h3>
              <p className="text-gray-600">{orderDetails.estimatedDelivery}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-[#EC008C] p-2 rounded-full mr-4">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-lg mb-1">Shipping Address</h3>
              <p className="text-gray-600">{orderDetails.shippingAddress}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild className="bg-[#EC008C] hover:bg-[#D1007D]">
            <Link to="/store">Continue Shopping</Link>
          </Button>
          <Button asChild variant="outline" className="border-[#EC008C] text-[#EC008C]">
            <Link to="/store/account/orders">Track Your Order</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
