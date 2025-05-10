
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, MapPin, ShoppingBag, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BreadcrumbNav from '@/components/store/BreadcrumbNav';
import { Card, CardContent } from '@/components/ui/card';

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });
  
  // Sample cart items
  const cartItems = [
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

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal >= 100 ? 0 : 9.99;
  const total = subtotal + shippingCost;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate form
    if (!shippingAddress.firstName || !shippingAddress.lastName || !shippingAddress.email || 
        !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city || 
        !shippingAddress.state || !shippingAddress.zipCode || !shippingAddress.country) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      
      // Create order details to pass to confirmation page
      const orderDetails = {
        items: cartItems,
        subtotal: subtotal,
        shipping: shippingCost,
        total: total,
        address: {
          street: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country
        },
        paymentMethod: paymentMethod === "razorpay" ? "Razorpay" : "Cash on Delivery"
      };
      
      // In a real app, you would integrate with Razorpay here
      if (paymentMethod === "razorpay") {
        // Simulate successful payment
        toast({
          title: "Payment successful!",
          description: "Your order has been placed successfully.",
        });
        navigate("/store/order-confirmation", { state: { orderDetails } });
      } else {
        toast({
          title: "Order placed",
          description: "Your order has been placed successfully with cash on delivery.",
        });
        navigate("/store/order-confirmation", { state: { orderDetails } });
      }
    }, 2000);
  };
  
  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  return (
    <div className="container mx-auto px-4 py-4">
      <BreadcrumbNav 
        items={[
          { label: "Shopping Cart", href: "/store/cart" },
          { label: "Checkout", href: "/store/checkout", isCurrent: true }
        ]} 
      />
      
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmitOrder}>
            {/* Shipping Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-[#EC008C]" />
                Shipping Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    placeholder="First name" 
                    value={shippingAddress.firstName}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Last name" 
                    value={shippingAddress.lastName}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Email address" 
                    value={shippingAddress.email}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    placeholder="Phone number" 
                    value={shippingAddress.phone}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input 
                    id="address" 
                    placeholder="Street address" 
                    value={shippingAddress.address}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    placeholder="City" 
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input 
                    id="state" 
                    placeholder="State" 
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input 
                    id="zipCode" 
                    placeholder="ZIP code" 
                    value={shippingAddress.zipCode}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input 
                    id="country" 
                    placeholder="Country" 
                    defaultValue="India" 
                    value={shippingAddress.country}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
            </div>
            
            {/* Additional Notes */}
            <div className="mb-8">
              <Label htmlFor="notes">Order Notes (Optional)</Label>
              <Textarea id="notes" placeholder="Notes about your order, e.g. special delivery instructions" />
            </div>
            
            {/* Payment Methods */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-[#EC008C]" />
                Payment Method
              </h2>
              
              <RadioGroup defaultValue="razorpay" value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="razorpay" id="razorpay" />
                  <Label htmlFor="razorpay" className="flex items-center">
                    <span className="ml-2">Pay with Razorpay</span>
                    <img src="https://razorpay.com/favicon.png" alt="Razorpay" className="h-6 ml-2" />
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod">Cash on Delivery</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="mb-8">
              <Button 
                type="submit"
                className="w-full bg-[#EC008C] hover:bg-[#D1007D]"
                disabled={loading}
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    Complete Order
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
        
        {/* Order Summary */}
        <div>
          <Card className="border rounded-lg">
            <CardContent className="p-4">
              <h3 className="font-bold text-xl mb-4 flex items-center">
                <ShoppingBag className="mr-2 h-5 w-5 text-[#EC008C]" />
                Order Summary
              </h3>
              
              <div className="border-b pb-4 mb-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <div className="w-12 h-12 overflow-hidden rounded border mr-2">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">
                          {item.quantity} × {formatPrice(item.price)}
                        </div>
                      </div>
                    </div>
                    <div className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              
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
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-center text-gray-500">
                Secure checkout powered by Razorpay
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-4">
            <Button asChild variant="outline" className="w-full">
              <Link to="/store/cart">Back to Cart</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
