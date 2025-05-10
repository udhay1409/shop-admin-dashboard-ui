
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Receipt, 
  Package, 
  User,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Product } from '@/types/product';
import POSCheckout from '@/components/pos/POSCheckout';

// Mock products for demonstration
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 129.99,
    stock: 45,
    status: 'Active',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    createdAt: new Date(2023, 4, 15).toISOString(),
    updatedAt: new Date(2023, 6, 10).toISOString(),
  },
  {
    id: '2',
    name: 'Smart Watch Series 5',
    price: 249.99,
    stock: 28,
    status: 'Active',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300&h=300&fit=crop',
    createdAt: new Date(2023, 3, 10).toISOString(),
    updatedAt: new Date(2023, 5, 20).toISOString(),
  },
  {
    id: '3',
    name: 'Cotton T-Shirt',
    price: 24.99,
    stock: 120,
    status: 'Active',
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
    createdAt: new Date(2023, 2, 25).toISOString(),
    updatedAt: new Date(2023, 4, 5).toISOString(),
  },
  {
    id: '4',
    name: 'Stainless Steel Water Bottle',
    price: 19.99,
    stock: 75,
    status: 'Active',
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop',
    createdAt: new Date(2023, 1, 8).toISOString(),
    updatedAt: new Date(2023, 3, 12).toISOString(),
  },
  {
    id: '5',
    name: 'Face Moisturizer',
    price: 34.99,
    stock: 60,
    status: 'Active',
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=300&h=300&fit=crop',
    createdAt: new Date(2023, 0, 15).toISOString(),
    updatedAt: new Date(2023, 2, 10).toISOString(),
  }
];

interface CartItem extends Product {
  quantity: number;
}

const POS: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Get unique categories for filter
  const categories = Array.from(new Set(MOCK_PRODUCTS.map(product => product.category)));

  // Filter products
  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === '' || 
      product.category === categoryFilter;
    
    return matchesSearch && matchesCategory && product.status === 'Active';
  });

  // Add to cart
  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Update item quantity
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Remove from cart
  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // Calculate cart totals
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Handle checkout
  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  // Complete transaction
  const completeTransaction = (paymentMethod: string) => {
    // In a real app, this would process the payment and create an order
    console.log("Transaction completed with", paymentMethod);
    console.log("Cart items:", cart);
    console.log("Total:", cartTotal);
    
    // Clear cart after successful transaction
    setCart([]);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Point of Sale</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-hidden">
        {/* Product Browser */}
        <div className="md:col-span-2 flex flex-col">
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-y-auto pb-4 flex-1">
            {filteredProducts.map(product => (
              <Card 
                key={product.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => addToCart(product)}
              >
                <div className="h-32 relative">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                      <Package className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                  <Badge className="absolute top-2 right-2">${product.price.toFixed(2)}</Badge>
                </div>
                <CardContent className="p-3">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">{product.category}</span>
                    <span className="text-xs text-gray-500">Stock: {product.stock}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredProducts.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center h-40 text-muted-foreground">
                <Package className="h-10 w-10 mb-2" />
                <p>No products found</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Cart */}
        <div className="flex flex-col border rounded-md">
          <div className="p-4 border-b bg-muted/30">
            <div className="flex justify-between items-center">
              <h2 className="font-medium flex items-center gap-2">
                <User size={18} />
                <span>Customer Cart</span>
              </h2>
              <Badge variant="outline" className="flex items-center gap-1">
                <Tag size={14} />
                <span>{cartItems} items</span>
              </Badge>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <CreditCard className="h-10 w-10 mb-2" />
                <p>Cart is empty</p>
                <p className="text-xs">Add products to begin</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img 
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center border rounded-md">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="border-t p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (5%)</span>
                <span>${(cartTotal * 0.05).toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${(cartTotal * 1.05).toFixed(2)}</span>
              </div>
              
              <Button
                className="w-full mt-4"
                size="lg"
                onClick={handleCheckout}
                disabled={cart.length === 0}
              >
                <Receipt className="mr-2 h-4 w-4" />
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Dialog */}
      <POSCheckout 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        cartTotal={cartTotal}
        onComplete={completeTransaction}
      />
    </div>
  );
};

export default POS;
