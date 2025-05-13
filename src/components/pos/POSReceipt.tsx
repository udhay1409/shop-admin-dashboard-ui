
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
import { Printer, ShoppingBag } from 'lucide-react';

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
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-center flex items-center justify-center gap-2 text-lg">
            <ShoppingBag className="h-5 w-5 text-purple-500" />
            Receipt
          </DialogTitle>
        </DialogHeader>
        
        <div id="receipt-content" className="font-mono text-sm">
          <div className="text-center mb-4 bg-gradient-to-r from-purple-50 to-purple-100 py-3 rounded-lg">
            <div className="font-bold text-xl text-purple-800">Your Store</div>
            <div>123 Main Street</div>
            <div>Anytown, State 12345</div>
            <div>Tel: (123) 456-7890</div>
          </div>
          
          <div className="flex justify-between text-xs mb-2 bg-gray-50 p-2 rounded">
            <span className="font-medium">Order #: {orderId.substring(0, 8)}</span>
            <span>{timestamp}</span>
          </div>
          
          <Separator className="my-2" />
          
          <div className="mb-4 max-h-60 overflow-y-auto">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between mb-2 py-1 border-b border-dashed border-gray-200">
                <div>
                  <span className="font-medium">{item.quantity} x </span>
                  <span className="truncate">{item.product.name}</span>
                </div>
                <span className="font-medium">{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          
          <Separator className="my-2" />
          
          <div className="space-y-1 bg-gray-50 p-3 rounded">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (5%):</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span className="text-purple-700">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-sm pt-1">
              <span>Payment Method:</span>
              <span className="capitalize bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">
                {paymentMethod}
              </span>
            </div>
          </div>
          
          <div className="text-center mt-5 border-t border-dashed pt-3 text-sm">
            <p className="font-medium">Thank you for your purchase!</p>
            <p className="text-gray-500">Please come again.</p>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button onClick={handlePrint} className="gap-2 bg-purple-600 hover:bg-purple-700">
            <Printer className="h-4 w-4" />
            Print Receipt
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default POSReceipt;
