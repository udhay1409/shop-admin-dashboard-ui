
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
import { CartItem } from '@/hooks/usePOS';
import { CreditCard, Check, User } from 'lucide-react';
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
        <DialogHeader>
          <DialogTitle>Complete Purchase</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Order Summary</p>
            <div className="text-sm rounded-md border p-2 max-h-40 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex justify-between py-1">
                  <span>{item.quantity} x {item.product.name}</span>
                  <span>{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-1 text-sm pt-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%):</span>
                <span>{formatPrice(taxAmount)}</span>
              </div>
              <div className="flex justify-between font-bold text-base">
                <span>Total:</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                id="collectCustomerInfo"
                checked={collectCustomerInfo}
                onChange={() => setCollectCustomerInfo(!collectCustomerInfo)}
                className="rounded border-gray-300 h-4 w-4"
              />
              <label htmlFor="collectCustomerInfo" className="text-sm">
                Collect Customer Information
              </label>
            </div>

            {collectCustomerInfo && (
              <div className="space-y-2 border p-3 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">Customer Details</span>
                </div>
                <div className="grid gap-2">
                  <div>
                    <Label htmlFor="name" className="text-xs">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Customer name"
                      value={customerInfo.name}
                      onChange={handleCustomerInfoChange}
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
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-xs">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      placeholder="Email address"
                      value={customerInfo.email}
                      onChange={handleCustomerInfoChange}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <Tabs defaultValue="cash" onValueChange={setPaymentMethod} value={paymentMethod}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="cash">Cash</TabsTrigger>
              <TabsTrigger value="card">Card</TabsTrigger>
              <TabsTrigger value="upi">UPI/QR</TabsTrigger>
            </TabsList>
            <TabsContent value="cash" className="py-2">
              <div className="text-center space-y-2 py-2">
                <CreditCard className="h-10 w-10 mx-auto opacity-50" />
                <p className="text-sm">Cash payment selected</p>
              </div>
            </TabsContent>
            <TabsContent value="card" className="py-2">
              <div className="text-center space-y-2 py-2">
                <CreditCard className="h-10 w-10 mx-auto opacity-50" />
                <p className="text-sm">Card payment selected</p>
              </div>
            </TabsContent>
            <TabsContent value="upi" className="py-2">
              <div className="text-center space-y-2 py-2">
                <CreditCard className="h-10 w-10 mx-auto opacity-50" />
                <p className="text-sm">UPI/QR payment selected</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={processing}>
            Cancel
          </Button>
          <Button onClick={handlePayment} disabled={processing}>
            {processing ? (
              "Processing..."
            ) : (
              <>
                Complete <Check className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default POSCheckout;
