
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  CreditCard, 
  Receipt, 
  Banknote,
  Smartphone,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Product } from '@/types/product';

interface CartItem extends Product {
  quantity: number;
}

interface POSCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  cartTotal: number;
  onComplete: (paymentMethod: string) => void;
}

const PaymentTabContent: React.FC<{ 
  children: React.ReactNode;
  method: string;
  cartTotal: number;
  onComplete: (paymentMethod: string) => void;
}> = ({ children, method, cartTotal, onComplete }) => {
  const [isPaying, setIsPaying] = useState(false);
  
  const handlePayment = () => {
    setIsPaying(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsPaying(false);
      onComplete(method);
    }, 1500);
  };
  
  return (
    <div className="space-y-6 pt-4">
      <div className="space-y-4">
        {children}
      </div>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">Total amount</p>
          <p className="text-2xl font-bold">${(cartTotal * 1.05).toFixed(2)}</p>
        </div>
        <Button onClick={handlePayment} disabled={isPaying}>
          {isPaying ? (
            <>Processing...</>
          ) : (
            <>
              Pay Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

const POSCheckout: React.FC<POSCheckoutProps> = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  cartTotal,
  onComplete 
}) => {
  const formattedTotal = (cartTotal * 1.05).toFixed(2);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Select a payment method to complete this transaction
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="card" className="w-full">
          <TabsList className="grid grid-cols-4 mb-2">
            <TabsTrigger value="card">
              <CreditCard className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Card</span>
            </TabsTrigger>
            <TabsTrigger value="cash">
              <Banknote className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Cash</span>
            </TabsTrigger>
            <TabsTrigger value="upi">
              <Smartphone className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">UPI</span>
            </TabsTrigger>
            <TabsTrigger value="other">
              <Receipt className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Other</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="card">
            <PaymentTabContent method="card" cartTotal={cartTotal} onComplete={onComplete}>
              <div className="space-y-2">
                <div>
                  <label htmlFor="cardNumber" className="text-sm">Card Number</label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="text-sm">Expiry Date</label>
                    <Input id="expiryDate" placeholder="MM/YY" />
                  </div>
                  <div>
                    <label htmlFor="cvv" className="text-sm">CVV</label>
                    <Input id="cvv" placeholder="123" />
                  </div>
                </div>
              </div>
            </PaymentTabContent>
          </TabsContent>
          
          <TabsContent value="cash">
            <PaymentTabContent method="cash" cartTotal={cartTotal} onComplete={onComplete}>
              <div className="space-y-2">
                <div>
                  <label htmlFor="amountPaid" className="text-sm">Amount Received</label>
                  <Input id="amountPaid" type="number" defaultValue={formattedTotal} />
                </div>
                <div>
                  <label htmlFor="changeAmount" className="text-sm">Change Due</label>
                  <Input id="changeAmount" disabled value="0.00" />
                </div>
              </div>
            </PaymentTabContent>
          </TabsContent>
          
          <TabsContent value="upi">
            <PaymentTabContent method="upi" cartTotal={cartTotal} onComplete={onComplete}>
              <div className="text-center">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4 inline-block">
                  <div className="bg-gray-100 h-32 w-32 flex items-center justify-center">
                    <p className="text-sm text-gray-500">QR Code</p>
                  </div>
                </div>
                <p className="text-sm">Scan the QR code with any UPI app to pay</p>
              </div>
            </PaymentTabContent>
          </TabsContent>
          
          <TabsContent value="other">
            <PaymentTabContent method="other" cartTotal={cartTotal} onComplete={onComplete}>
              <div className="space-y-2">
                <div>
                  <label htmlFor="paymentReference" className="text-sm">Payment Reference</label>
                  <Input id="paymentReference" placeholder="Enter reference ID" />
                </div>
                <div>
                  <label htmlFor="paymentMethod" className="text-sm">Payment Method</label>
                  <Input id="paymentMethod" placeholder="e.g., Store Credit, Gift Card" />
                </div>
              </div>
            </PaymentTabContent>
          </TabsContent>
        </Tabs>
        
      </DialogContent>
    </Dialog>
  );
};

export default POSCheckout;
