
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { CreditCard, MapPin, Truck, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BreadcrumbNav from '@/components/store/BreadcrumbNav';

interface OrderSummaryItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock data
  const orderItems: OrderSummaryItem[] = [
    {
      id: '1',
      name: "Floral Print Maxi Dress",
      price: 89.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=80&h=80&fit=crop",
    },
    {
      id: '2',
      name: "Embroidered Tunic Top",
      price: 59.99,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=80&h=80&fit=crop",
    },
    {
      id: '3',
      name: "High Waist Palazzo Pants",
      price: 79.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1551163943-3f7253a95139?w=80&h=80&fit=crop",
    }
  ];
  
  // Calculate totals
  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal >= 100 ? 0 : 9.99;
  const discount = 0; // No discount by default
  const total = subtotal + shippingCost - discount;
  
  // Form State
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    shippingMethod: 'standard',
    paymentMethod: 'razorpay',
    saveInfo: true,
    orderNotes: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormState(prev => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formState.firstName) newErrors.firstName = 'First name is required';
    if (!formState.lastName) newErrors.lastName = 'Last name is required';
    if (!formState.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formState.phone) newErrors.phone = 'Phone number is required';
    if (!formState.address) newErrors.address = 'Address is required';
    if (!formState.city) newErrors.city = 'City is required';
    if (!formState.state) newErrors.state = 'State is required';
    if (!formState.zipCode) newErrors.zipCode = 'ZIP code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, you'd process the payment here using Razorpay
      // For now, we'll just show a toast and redirect
      toast({
        title: "Order placed successfully!",
        description: "Thank you for shopping with us. Your order is being processed.",
      });
      
      // Redirect to order confirmation page
      navigate('/store/order-confirmation');
    } else {
      toast({
        title: "Please check your information",
        description: "Some required fields are missing or invalid.",
        variant: "destructive"
      });
    }
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
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Billing & Shipping Information */}
          <div className="border rounded-lg p-6">
            <div className="flex items-center mb-4">
              <MapPin className="h-5 w-5 mr-2 text-[#EC008C]" />
              <h2 className="text-xl font-semibold">Shipping Address</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input 
                  id="firstName"
                  name="firstName"
                  value={formState.firstName}
                  onChange={handleInputChange}
                  className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input 
                  id="lastName"
                  name="lastName"
                  value={formState.lastName}
                  onChange={handleInputChange}
                  className={errors.lastName ? 'border-red-500' : ''}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input 
                  id="phone"
                  name="phone"
                  value={formState.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
              
              <div className="sm:col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Input 
                  id="address"
                  name="address"
                  value={formState.address}
                  onChange={handleInputChange}
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="city">City *</Label>
                <Input 
                  id="city"
                  name="city"
                  value={formState.city}
                  onChange={handleInputChange}
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="state">State *</Label>
                <Input 
                  id="state"
                  name="state"
                  value={formState.state}
                  onChange={handleInputChange}
                  className={errors.state ? 'border-red-500' : ''}
                />
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input 
                  id="zipCode"
                  name="zipCode"
                  value={formState.zipCode}
                  onChange={handleInputChange}
                  className={errors.zipCode ? 'border-red-500' : ''}
                />
                {errors.zipCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="country">Country *</Label>
                <Select
                  value={formState.country}
                  onValueChange={(value) => handleSelectChange('country', value)}
                >
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-4">
              <Label htmlFor="orderNotes" className="mb-2">Order Notes (Optional)</Label>
              <Textarea
                id="orderNotes"
                name="orderNotes"
                placeholder="Notes about your order, e.g. special delivery instructions"
                value={formState.orderNotes}
                onChange={handleInputChange}
                className="h-24"
              />
            </div>
          </div>
          
          {/* Shipping Method */}
          <div className="border rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Truck className="h-5 w-5 mr-2 text-[#EC008C]" />
              <h2 className="text-xl font-semibold">Shipping Method</h2>
            </div>
            
            <RadioGroup
              value={formState.shippingMethod}
              onValueChange={(value) => handleSelectChange('shippingMethod', value)}
            >
              <div className="flex items-center space-x-2 border p-3 rounded-md mb-2">
                <RadioGroupItem value="standard" id="standard" />
                <Label htmlFor="standard" className="flex-1 cursor-pointer">
                  <div className="font-medium">Standard Shipping</div>
                  <div className="text-sm text-gray-500">3-5 business days</div>
                </Label>
                <div>
                  {subtotal >= 100 ? <span className="text-[#EC008C]">Free</span> : `$9.99`}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 border p-3 rounded-md mb-2">
                <RadioGroupItem value="express" id="express" />
                <Label htmlFor="express" className="flex-1 cursor-pointer">
                  <div className="font-medium">Express Shipping</div>
                  <div className="text-sm text-gray-500">1-2 business days</div>
                </Label>
                <div>$19.99</div>
              </div>
            </RadioGroup>
          </div>
          
          {/* Payment Method */}
          <div className="border rounded-lg p-6">
            <div className="flex items-center mb-4">
              <CreditCard className="h-5 w-5 mr-2 text-[#EC008C]" />
              <h2 className="text-xl font-semibold">Payment Method</h2>
            </div>
            
            <RadioGroup
              value={formState.paymentMethod}
              onValueChange={(value) => handleSelectChange('paymentMethod', value)}
            >
              <div className="flex items-center space-x-2 border p-3 rounded-md mb-2">
                <RadioGroupItem value="razorpay" id="razorpay" />
                <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                  <div className="font-medium">Pay with Razorpay</div>
                  <div className="text-sm text-gray-500">Credit/Debit Card, UPI, Wallets, NetBanking</div>
                </Label>
                <img 
                  src="https://via.placeholder.com/80x30?text=Razorpay" 
                  alt="Razorpay"
                  className="h-8"
                />
              </div>
              
              <div className="flex items-center space-x-2 border p-3 rounded-md mb-2">
                <RadioGroupItem value="cod" id="cod" />
                <Label htmlFor="cod" className="flex-1 cursor-pointer">
                  <div className="font-medium">Cash on Delivery</div>
                  <div className="text-sm text-gray-500">Pay when you receive the package</div>
                </Label>
                <span className="text-sm">+$5.00 handling fee</span>
              </div>
            </RadioGroup>
            
            <div className="mt-4 bg-gray-50 p-3 rounded-md border flex items-start">
              <Shield className="h-5 w-5 mr-2 text-[#EC008C] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600">
                Your payment information is processed securely. We do not store credit card details nor have access to your payment information.
              </p>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="sticky top-6 border rounded-lg p-6 bg-white">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {orderItems.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded overflow-hidden border flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                    <div className="text-gray-500 text-xs">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span>
                  {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-[#EC008C]">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              
              <Separator className="my-2" />
              
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            
            <Button 
              type="submit"
              className="w-full mt-6 bg-[#EC008C] hover:bg-[#D1007D]"
            >
              Place Order
            </Button>
            
            <div className="mt-4 text-xs text-center text-gray-500">
              By placing your order, you agree to our 
              <Link to="/store/policies/terms" className="text-[#EC008C] mx-1">Terms of Service</Link>
              and
              <Link to="/store/policies/privacy" className="text-[#EC008C] ml-1">Privacy Policy</Link>.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
