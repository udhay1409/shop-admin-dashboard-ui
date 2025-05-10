
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { CartItem } from '@/hooks/usePOS';
import { Printer } from 'lucide-react';

interface POSReceiptProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
}

const POSReceipt: React.FC<POSReceiptProps> = ({
  isOpen,
  onClose,
  orderId,
  items,
  subtotal,
  tax,
  total,
  paymentMethod,
}) => {
  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const timestamp = new Date().toLocaleString();
  
  const handlePrint = () => {
    const printContents = document.getElementById('receipt-content')?.innerHTML;
    const originalContents = document.body.innerHTML;
    
    if (printContents) {
      document.body.innerHTML = `
        <div style="max-width: 300px; margin: 0 auto; font-family: monospace;">
          ${printContents}
        </div>`;
      window.print();
      document.body.innerHTML = originalContents;
      // Reattach event listeners
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Receipt</DialogTitle>
        </DialogHeader>
        
        <div id="receipt-content" className="font-mono text-sm">
          <div className="text-center mb-4">
            <div className="font-bold text-lg">Your Store</div>
            <div>123 Main Street</div>
            <div>Anytown, State 12345</div>
            <div>Tel: (123) 456-7890</div>
          </div>
          
          <div className="flex justify-between text-xs mb-2">
            <span>Order #: {orderId.substring(0, 8)}</span>
            <span>{timestamp}</span>
          </div>
          
          <Separator className="my-2" />
          
          <div className="mb-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between mb-1">
                <div>
                  <span>{item.quantity} x </span>
                  <span className="truncate">{item.product.name}</span>
                </div>
                <span>{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          
          <Separator className="my-2" />
          
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (5%):</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Payment Method:</span>
              <span>{paymentMethod}</span>
            </div>
          </div>
          
          <div className="text-center mt-4 text-xs">
            <p>Thank you for your purchase!</p>
            <p>Please come again.</p>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default POSReceipt;
