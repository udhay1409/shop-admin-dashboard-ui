
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, X, Plus, Minus, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BreadcrumbNav from '@/components/store/BreadcrumbNav';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  color: string;
}

const CartPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Mock cart items
  const [cartItems, setCartItems] = useState<CartItem[]>([
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
    },
    {
      id: '3',
      name: "High Waist Palazzo Pants",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1551163943-3f7253a95139?w=300&h=300&fit=crop",
      quantity: 1,
      size: "L",
      color: "Black",
    }
  ]);
  const [couponCode, setCouponCode] = useState('');
  
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal >= 100 ? 0 : 9.99;
  const discount = 0; // No discount by default
  const total = subtotal + shippingCost - discount;

  const handleQuantityChange = (id: string, change: number) => {
    setCartItems(items =>
      items.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          if (newQuantity >= 1) {
            return { ...item, quantity: newQuantity };
          }
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart",
    });
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim().toLowerCase() === 'save10') {
      toast({
        title: "Coupon applied",
        description: "You've received 10% off your order",
      });
    } else {
      toast({
        title: "Invalid coupon",
        description: "This coupon code is not valid",
        variant: "destructive"
      });
    }
  };

  const handleCheckout = () => {
    // Pass cart items to checkout
    navigate('/store/checkout');
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  return (
    <div className="container mx-auto px-4 py-4">
      <BreadcrumbNav 
        items={[
          { label: "Shopping Cart", href: "/store/cart", isCurrent: true }
        ]} 
      />
      
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Button asChild className="bg-[#EC008C] hover:bg-[#D1007D]">
            <Link to="/store">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="border rounded-lg overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-12 bg-gray-50 p-4 border-b">
                <div className="col-span-6">
                  <h3 className="font-medium">Product</h3>
                </div>
                <div className="col-span-2 text-center">
                  <h3 className="font-medium">Price</h3>
                </div>
                <div className="col-span-2 text-center">
                  <h3 className="font-medium">Quantity</h3>
                </div>
                <div className="col-span-2 text-right">
                  <h3 className="font-medium">Subtotal</h3>
                </div>
              </div>
              
              {/* Cart items */}
              {cartItems.map(item => (
                <div key={item.id} className="grid grid-cols-12 p-4 border-b items-center">
                  <div className="col-span-6">
                    <div className="flex items-center space-x-4">
                      <button 
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="w-16 h-16 overflow-hidden rounded border">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <div className="text-sm text-gray-500">
                          <span>Size: {item.size}</span>
                          <span className="mx-2">•</span>
                          <span>Color: {item.color}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 text-center">
                    {formatPrice(item.price)}
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center justify-center">
                      <button 
                        className="w-8 h-8 flex items-center justify-center border rounded-full"
                        onClick={() => handleQuantityChange(item.id, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="mx-2 w-6 text-center">{item.quantity}</span>
                      <button 
                        className="w-8 h-8 flex items-center justify-center border rounded-full"
                        onClick={() => handleQuantityChange(item.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="col-span-2 text-right font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
              
              {/* Cart actions */}
              <div className="p-4 flex justify-between">
                <div className="flex">
                  <Input
                    placeholder="Coupon code"
                    className="w-auto rounded-r-none"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button 
                    onClick={handleApplyCoupon}
                    className="rounded-l-none bg-[#EC008C] hover:bg-[#D1007D]"
                  >
                    Apply
                  </Button>
                </div>
                
                <Button variant="outline" asChild className="border-[#EC008C] text-[#EC008C]">
                  <Link to="/store">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="border rounded-lg p-4">
              <h3 className="font-bold text-xl mb-4">Order Summary</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#EC008C]">
                    <span>Discount</span>
                    <span className="font-medium">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleCheckout}
                className="w-full mb-2 bg-[#EC008C] hover:bg-[#D1007D]"
              >
                Proceed to Checkout
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
              
              <div className="text-xs text-center text-gray-500">
                Secure checkout powered by Razorpay
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
