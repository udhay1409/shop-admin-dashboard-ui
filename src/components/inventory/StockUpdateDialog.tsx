
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface StockUpdateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  locationId: string;
  currentStock: number;
  onUpdate: (quantity: number) => void;
  isUpdating: boolean;
}

export const StockUpdateDialog: React.FC<StockUpdateDialogProps> = ({
  isOpen,
  onClose,
  productId,
  productName,
  locationId,
  currentStock,
  onUpdate,
  isUpdating
}) => {
  const [quantity, setQuantity] = useState(currentStock);

  useEffect(() => {
    if (isOpen) {
      setQuantity(currentStock);
    }
  }, [isOpen, currentStock]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(quantity);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Stock</DialogTitle>
          <DialogDescription>
            Update inventory quantity for {productName}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="quantity" className="text-sm font-medium">
              Quantity
            </label>
            <Input
              id="quantity"
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              className="w-full"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isUpdating}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Stock'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
