
import React, { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import POSCheckout from '@/components/pos/POSCheckout';
import POSReceipt from '@/components/pos/POSReceipt';
import usePOS from '@/hooks/usePOS';
import { Skeleton } from '@/components/ui/skeleton';

const POS: React.FC = () => {
  const {
    products,
    categories,
    cart,
    loading,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    addToCart,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    taxAmount,
    cartTotal,
    cartItemsCount,
    processTransaction
  } = usePOS();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);
  const [completedPaymentMethod, setCompletedPaymentMethod] = useState('');

  // Handle checkout
  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  // Complete transaction
  const completeTransaction = async (paymentMethod: string, customerInfo?: any) => {
    const orderId = await processTransaction(paymentMethod, customerInfo);
    if (orderId) {
      setCompletedOrderId(orderId);
      setCompletedPaymentMethod(paymentMethod);
      setIsCheckoutOpen(false);
      setIsReceiptOpen(true);
      return orderId;
    }
    return null;
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
                <SelectItem value="">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-y-auto pb-4 flex-1">
            {loading ? (
              // Loading skeletons
              Array(8).fill(0).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <Skeleton className="h-32 w-full" />
                  <CardContent className="p-3">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Actual product cards
              products.map(product => (
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
                    {product.stock <= 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">{product.category}</span>
                      <span className="text-xs text-gray-500">Stock: {product.stock}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            
            {!loading && products.length === 0 && (
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
                <span>{cartItemsCount} items</span>
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
                  <div key={item.product.id} className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      {item.product.image ? (
                        <img 
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center border rounded-md">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(item.product.id, item.quantity - 1);
                        }}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(item.product.id, item.quantity + 1);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCart(item.product.id);
                      }}
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
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (5%)</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              
              <Button
                className="w-full mt-4"
                size="lg"
                onClick={handleCheckout}
                disabled={cart.length === 0 || loading}
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
        cartSubtotal={cartSubtotal}
        taxAmount={taxAmount}
        cartTotal={cartTotal}
        onComplete={completeTransaction}
      />

      {/* Receipt Dialog */}
      {completedOrderId && (
        <POSReceipt
          isOpen={isReceiptOpen}
          onClose={() => setIsReceiptOpen(false)}
          orderId={completedOrderId}
          items={cart}
          subtotal={cartSubtotal}
          tax={taxAmount}
          total={cartTotal}
          paymentMethod={completedPaymentMethod}
        />
      )}
    </div>
  );
};

export default POS;
