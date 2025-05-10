
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Order } from '@/types/order';

interface OrderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (order: Partial<Order>) => void;
}

const OrderFormDialog: React.FC<OrderFormDialogProps> = ({ open, onOpenChange, onSubmit }) => {
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState('');
  const [total, setTotal] = useState('');
  const [payment, setPayment] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format total to add ₹ if not already present
    const formattedTotal = total.includes('₹') ? total : `₹${total}`;
    
    // Create new order object
    const newOrder: Partial<Order> = {
      customerName,
      items,
      total: formattedTotal,
      payment,
      status: 'Pending',
      address,
      phone,
      expectedAction: 'Confirm within 24 hrs',
    };
    
    onSubmit(newOrder);
    
    // Reset form fields
    setCustomerName('');
    setItems('');
    setTotal('');
    setPayment('');
    setAddress('');
    setPhone('');
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogDescription>
            Enter customer and order details to create a new order.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name *</Label>
            <Input 
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Full name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="items">Items *</Label>
            <Input 
              id="items"
              value={items}
              onChange={(e) => setItems(e.target.value)}
              placeholder="e.g. 2 T-shirts, 1 Jeans"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="total">Total Amount *</Label>
            <Input 
              id="total"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              placeholder="e.g. 1299"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="payment">Payment Method *</Label>
            <Select 
              value={payment} 
              onValueChange={setPayment}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UPI - GPay">UPI - GPay</SelectItem>
                <SelectItem value="UPI - PhonePe">UPI - PhonePe</SelectItem>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="Debit Card">Debit Card</SelectItem>
                <SelectItem value="Net Banking">Net Banking</SelectItem>
                <SelectItem value="COD">Cash on Delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Delivery Address</Label>
            <Textarea 
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Complete address with city and pincode"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-pink-500 hover:bg-pink-600"
            >
              Create Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderFormDialog;
