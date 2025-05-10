
import React, { useState } from 'react';
import { useNavigate, useLocation, Link, Routes, Route } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import BreadcrumbNav from '@/components/store/BreadcrumbNav';
import { User, Package, MapPin, CreditCard, Heart, Settings, LogOut, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

const ProfileTab = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated."
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled
              />
              <p className="text-sm text-muted-foreground">Email cannot be changed</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
            </div>
          </div>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
};

const OrdersTab = () => {
  const { user } = useAuth();
  
  // Mock orders data
  const orders = [
    {
      id: "ORD-12345",
      date: "2024-05-01",
      status: "Delivered",
      total: 2350.00,
      items: 3
    },
    {
      id: "ORD-12346",
      date: "2024-04-15",
      status: "Processing",
      total: 1850.00,
      items: 2
    },
    {
      id: "ORD-12347",
      date: "2024-03-22",
      status: "Delivered",
      total: 3750.00,
      items: 4
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Your Orders</h3>
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map(order => (
            <Card key={order.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">{order.id}</CardTitle>
                  <div className={`px-2 py-1 rounded-full text-xs 
                    ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                    order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                    'bg-yellow-100 text-yellow-800'}`}>
                    {order.status}
                  </div>
                </div>
                <CardDescription>{new Date(order.date).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex justify-between">
                  <span>{order.items} items</span>
                  <span className="font-medium">₹{order.total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link to={`/store/account/orders/${order.id}`}>
                  <Button variant="outline" size="sm">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No orders yet</h3>
          <p className="text-muted-foreground mb-4">When you place an order, it will appear here.</p>
          <Button asChild>
            <Link to="/store/categories/all">Start Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

const AddressesTab = () => {
  // Mock addresses
  const addresses = [
    {
      id: 1,
      type: 'Home',
      name: 'John Doe',
      address: '123 Main Street, Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India',
      phone: '+91 98765 43210',
      isDefault: true
    },
    {
      id: 2,
      type: 'Office',
      name: 'John Doe',
      address: '456 Business Park, Building C',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400051',
      country: 'India',
      phone: '+91 98765 43210',
      isDefault: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Addresses</h3>
        <Button size="sm">Add New Address</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map(address => (
          <Card key={address.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">{address.type}</CardTitle>
                {address.isDefault && (
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    Default
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-1 text-sm">
                <p className="font-medium">{address.name}</p>
                <p>{address.address}</p>
                <p>{address.city}, {address.state} {address.postalCode}</p>
                <p>{address.country}</p>
                <p>{address.phone}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">Edit</Button>
              {!address.isDefault && (
                <Button variant="ghost" size="sm">Set as Default</Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

const PaymentsTab = () => {
  // Mock payment methods
  const paymentMethods = [
    {
      id: 1,
      type: 'Credit Card',
      cardNumber: '**** **** **** 4242',
      expiry: '05/25',
      isDefault: true
    },
    {
      id: 2,
      type: 'UPI',
      upiId: 'johndoe@okaxis',
      isDefault: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Saved Payment Methods</h3>
        <Button size="sm">Add Payment Method</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map(method => (
          <Card key={method.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">{method.type}</CardTitle>
                {method.isDefault && (
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    Default
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              {method.type === 'Credit Card' && (
                <div className="space-y-1">
                  <p className="font-medium">{method.cardNumber}</p>
                  <p className="text-sm text-muted-foreground">Expires: {method.expiry}</p>
                </div>
              )}
              {method.type === 'UPI' && (
                <div className="space-y-1">
                  <p className="font-medium">{method.upiId}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">Edit</Button>
              {!method.isDefault && (
                <Button variant="ghost" size="sm">Set as Default</Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

const EmailPreferencesTab = () => {
  const [preferences, setPreferences] = useState({
    orderUpdates: true,
    promotions: true,
    newArrivals: false,
  });

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Email Preferences</h3>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="order-updates" className="font-medium">Order updates</Label>
                <p className="text-sm text-muted-foreground">Receive emails about your orders</p>
              </div>
              <Switch
                id="order-updates"
                checked={preferences.orderUpdates}
                onCheckedChange={() => handleToggle('orderUpdates')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="promotions" className="font-medium">Promotions & Discounts</Label>
                <p className="text-sm text-muted-foreground">Receive emails about sales and special offers</p>
              </div>
              <Switch
                id="promotions"
                checked={preferences.promotions}
                onCheckedChange={() => handleToggle('promotions')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="new-arrivals" className="font-medium">New Arrivals</Label>
                <p className="text-sm text-muted-foreground">Be the first to know about new products</p>
              </div>
              <Switch
                id="new-arrivals"
                checked={preferences.newArrivals}
                onCheckedChange={() => handleToggle('newArrivals')}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Preferences</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const AccountDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop() || 'profile';
  
  // If not authenticated, redirect to login
  if (!user) {
    navigate('/store/login');
    return null;
  }

  const handleTabChange = (value: string) => {
    navigate(`/store/account/${value === 'profile' ? '' : value}`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <BreadcrumbNav 
        items={[
          { label: 'Home', href: '/store' },
          { label: 'Account', href: '/store/account' },
        ]}
      />

      <div className="flex flex-col md:flex-row gap-6 mt-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs 
                defaultValue={currentTab} 
                orientation="vertical" 
                className="w-full"
                onValueChange={handleTabChange}
                value={currentTab}
              >
                <TabsList className="flex flex-col h-auto bg-transparent gap-1 p-0">
                  <TabsTrigger 
                    value="profile" 
                    className="justify-start w-full px-4 py-2 data-[state=active]:bg-pink-50 data-[state=active]:text-[#EC008C]"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger 
                    value="orders" 
                    className="justify-start w-full px-4 py-2 data-[state=active]:bg-pink-50 data-[state=active]:text-[#EC008C]"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Orders
                  </TabsTrigger>
                  <TabsTrigger 
                    value="addresses" 
                    className="justify-start w-full px-4 py-2 data-[state=active]:bg-pink-50 data-[state=active]:text-[#EC008C]"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Addresses
                  </TabsTrigger>
                  <TabsTrigger 
                    value="payments" 
                    className="justify-start w-full px-4 py-2 data-[state=active]:bg-pink-50 data-[state=active]:text-[#EC008C]"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payments
                  </TabsTrigger>
                  <TabsTrigger 
                    value="wishlist" 
                    className="justify-start w-full px-4 py-2 data-[state=active]:bg-pink-50 data-[state=active]:text-[#EC008C]"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Wishlist
                  </TabsTrigger>
                  <TabsTrigger 
                    value="email-preferences" 
                    className="justify-start w-full px-4 py-2 data-[state=active]:bg-pink-50 data-[state=active]:text-[#EC008C]"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email Preferences
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
            <CardFooter className="pt-0 mt-auto border-t">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>
                {currentTab === 'profile' && 'My Profile'}
                {currentTab === 'orders' && 'My Orders'}
                {currentTab === 'addresses' && 'My Addresses'}
                {currentTab === 'payments' && 'Payment Methods'}
                {currentTab === 'wishlist' && 'My Wishlist'}
                {currentTab === 'email-preferences' && 'Email Preferences'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentTab === 'profile' && <ProfileTab />}
              {currentTab === 'orders' && <OrdersTab />}
              {currentTab === 'addresses' && <AddressesTab />}
              {currentTab === 'payments' && <PaymentsTab />}
              {currentTab === 'wishlist' && <div>Your wishlist content will be here</div>}
              {currentTab === 'email-preferences' && <EmailPreferencesTab />}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountDashboard;
