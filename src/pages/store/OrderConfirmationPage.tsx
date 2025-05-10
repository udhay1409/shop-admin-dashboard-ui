
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Truck, Clock, FileText, ShoppingBag } from 'lucide-react';
import BreadcrumbNav from '@/components/store/BreadcrumbNav';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  color: string;
}

const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  
  // Generate a random order number
  const orderNumber = `FN-${Math.floor(100000 + Math.random() * 900000)}`;
  const orderDate = new Date().toLocaleDateString();
  const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString();
  
  // Get order details from state or use default values
  const orderDetails = location.state?.orderDetails || {
    items: [],
    subtotal: 0,
    shipping: 0,
    total: 229.97,
    address: {
      street: '123 Main St, Apt 4B',
      city: 'Chennai',
      state: 'Tamil Nadu',
      zipCode: '600001',
      country: 'India'
    },
    paymentMethod: 'Razorpay'
  };
  
  // For demo purposes, show some items if none were passed
  const orderItems = orderDetails.items.length > 0 ? orderDetails.items : [
    {
      id: '1',
      name: "Floral Print Maxi Dress",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=300&fit=crop",
      quantity: 1,
      size: "M",
      color: "Blue",
    },
    {
      id: '2',
      name: "Embroidered Tunic Top",
      price: 59.99,
      image: "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=300&h=300&fit=crop",
      quantity: 2,
      size: "S",
      color: "Pink",
    }
  ];
  
  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

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
              <div className="font-medium">{formatPrice(orderDetails.total)}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Payment Method</div>
              <div className="font-medium">{orderDetails.paymentMethod}</div>
            </div>
          </div>
        </div>
        
        {/* Order Items Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center justify-center">
            <ShoppingBag className="mr-2 h-5 w-5 text-[#EC008C]" />
            Order Items
          </h2>
          
          <div className="border rounded-lg overflow-hidden mb-6">
            <div className="grid grid-cols-12 bg-gray-50 p-3 border-b text-sm">
              <div className="col-span-6 text-left">
                <span className="font-medium">Product</span>
              </div>
              <div className="col-span-2 text-center">
                <span className="font-medium">Price</span>
              </div>
              <div className="col-span-2 text-center">
                <span className="font-medium">Qty</span>
              </div>
              <div className="col-span-2 text-right">
                <span className="font-medium">Total</span>
              </div>
            </div>
            
            {orderItems.map((item: OrderItem) => (
              <div key={item.id} className="grid grid-cols-12 p-3 border-b items-center text-sm">
                <div className="col-span-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 overflow-hidden rounded border">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">
                        Size: {item.size}, Color: {item.color}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 text-center">
                  {formatPrice(item.price)}
                </div>
                <div className="col-span-2 text-center">
                  {item.quantity}
                </div>
                <div className="col-span-2 text-right font-medium">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
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
              {orderDetails.address.street}<br />
              {orderDetails.address.city}, {orderDetails.address.state} {orderDetails.address.zipCode}<br />
              {orderDetails.address.country}
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
