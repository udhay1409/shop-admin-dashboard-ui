
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { CartItem } from '@/hooks/usePOS';
import { CreditCard, Check, User, Wallet, Smartphone, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface POSCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  cartSubtotal: number;
  taxAmount: number;
  cartTotal: number;
  onComplete: (paymentMethod: string, customerInfo?: any) => Promise<string | null>;
}

const POSCheckout: React.FC<POSCheckoutProps> = ({
  isOpen,
  onClose,
  cartItems,
  cartSubtotal,
  taxAmount,
  cartTotal,
  onComplete,
}) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [processing, setProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [collectCustomerInfo, setCollectCustomerInfo] = useState(false);

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const handlePayment = async () => {
    setProcessing(true);
    try {
      await onComplete(
        paymentMethod, 
        collectCustomerInfo ? customerInfo : undefined
      );
      onClose();
    } catch (error) {
      console.error('Payment processing error:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !processing && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <ShoppingCart className="h-5 w-5 text-purple-500" /> 
            Complete Purchase
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-base font-semibold">Order Summary</h3>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                {cartItems.length} items
              </span>
            </div>

            <div className="bg-gray-50 text-sm rounded-md border p-3 max-h-40 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex justify-between py-1.5 border-b border-dashed border-gray-200 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-100 text-purple-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {item.quantity}
                    </span>
                    <span className="truncate">{item.product.name}</span>
                  </div>
                  <span className="font-medium">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-1.5 text-sm pt-2 bg-gray-50 p-3 rounded-md">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%):</span>
                <span>{formatPrice(taxAmount)}</span>
              </div>
              <Separator className="my-1.5 bg-gray-300" />
              <div className="flex justify-between font-bold text-base text-purple-800">
                <span>Total:</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex h-4 w-4 items-center justify-center rounded-sm border border-primary">
                <input
                  type="checkbox"
                  id="collectCustomerInfo"
                  checked={collectCustomerInfo}
                  onChange={() => setCollectCustomerInfo(!collectCustomerInfo)}
                  className="opacity-0 absolute h-4 w-4 cursor-pointer"
                />
                {collectCustomerInfo && <Check className="h-3 w-3 text-primary" />}
              </div>
              <label htmlFor="collectCustomerInfo" className="text-sm font-medium cursor-pointer">
                Collect Customer Information
              </label>
            </div>

            {collectCustomerInfo && (
              <div className="space-y-3 border p-3 rounded-md bg-gray-50 mt-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Customer Details</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="name" className="text-xs">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Customer name"
                      value={customerInfo.name}
                      onChange={handleCustomerInfoChange}
                      className="h-9"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-xs">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="Phone number"
                      value={customerInfo.phone}
                      onChange={handleCustomerInfoChange}
                      className="h-9"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="email" className="text-xs">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      placeholder="Email address"
                      value={customerInfo.email}
                      onChange={handleCustomerInfoChange}
                      className="h-9"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <Tabs defaultValue="cash" onValueChange={setPaymentMethod} value={paymentMethod} className="mt-4">
            <TabsList className="grid grid-cols-3 w-full bg-gray-100">
              <TabsTrigger value="cash" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">Cash</TabsTrigger>
              <TabsTrigger value="card" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">Card</TabsTrigger>
              <TabsTrigger value="upi" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">UPI/QR</TabsTrigger>
            </TabsList>
            <TabsContent value="cash" className="py-3">
              <div className="text-center space-y-2 py-2 bg-gray-50 rounded-md">
                <Wallet className="h-12 w-12 mx-auto text-purple-400" />
                <p className="text-sm">Cash payment selected</p>
              </div>
            </TabsContent>
            <TabsContent value="card" className="py-3">
              <div className="text-center space-y-2 py-2 bg-gray-50 rounded-md">
                <CreditCard className="h-12 w-12 mx-auto text-purple-400" />
                <p className="text-sm">Card payment selected</p>
              </div>
            </TabsContent>
            <TabsContent value="upi" className="py-3">
              <div className="text-center space-y-2 py-2 bg-gray-50 rounded-md">
                <Smartphone className="h-12 w-12 mx-auto text-purple-400" />
                <p className="text-sm">UPI/QR payment selected</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="mt-2 pt-3 border-t">
          <Button variant="outline" onClick={onClose} disabled={processing}>
            Cancel
          </Button>
          <Button onClick={handlePayment} disabled={processing} className="bg-purple-600 hover:bg-purple-700">
            {processing ? (
              "Processing..."
            ) : (
              <>
                Complete Payment <Check className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default POSCheckout;
