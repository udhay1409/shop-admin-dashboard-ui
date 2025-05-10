
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Truck, Clock, FileText } from 'lucide-react';
import BreadcrumbNav from '@/components/store/BreadcrumbNav';

const OrderConfirmationPage: React.FC = () => {
  // Generate a random order number
  const orderNumber = `FN-${Math.floor(100000 + Math.random() * 900000)}`;
  const orderDate = new Date().toLocaleDateString();
  const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString();
  
  return (
    <div className="container mx-auto px-4 py-4">
      <BreadcrumbNav 
        items={[
          { label: "Shopping Cart", href: "/store/cart" },
          { label: "Checkout", href: "/store/checkout" },
          { label: "Order Confirmation", href: "/store/order-confirmation", isCurrent: true }
        ]} 
      />
      
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
        <p className="text-gray-600 mb-8">
          Your order has been placed and is being processed. You will receive an email confirmation shortly.
        </p>
        
        <div className="border-t border-b py-6 mb-6">
          <div className="grid md:grid-cols-2 gap-6 max-w-lg mx-auto text-left">
            <div>
              <div className="text-gray-500 text-sm">Order Number</div>
              <div className="font-medium">{orderNumber}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Date</div>
              <div className="font-medium">{orderDate}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Total Amount</div>
              <div className="font-medium">$229.97</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Payment Method</div>
              <div className="font-medium">Razorpay</div>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center justify-center">
            <Truck className="mr-2 h-5 w-5 text-[#EC008C]" />
            Shipping Information
          </h2>
          
          <div className="mb-4">
            <p className="font-medium">Shipping Address</p>
            <p className="text-gray-600">
              123 Main St, Apt 4B<br />
              Chennai, Tamil Nadu 600001<br />
              India
            </p>
          </div>
          
          <div className="flex items-center justify-center text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>Estimated Delivery: {estimatedDelivery}</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-[#EC008C] hover:bg-[#D1007D]">
            <Link to="/store">
              Continue Shopping
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="border-[#EC008C] text-[#EC008C]">
            <Link to="#" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Track Order
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
