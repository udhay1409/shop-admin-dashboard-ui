
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const billItemSchema = z.object({
  name: z.string().min(1, { message: "Item name is required" }),
  quantity: z.coerce.number().positive({ message: "Quantity must be positive" }),
  price: z.coerce.number().positive({ message: "Price must be positive" }),
});

const purchaseBillSchema = z.object({
  vendorId: z.string({ required_error: "Please select a vendor" }),
  billDate: z.string().min(1, { message: "Bill date is required" }),
  status: z.string({ required_error: "Please select bill status" }),
  paymentDate: z.string().optional(),
  items: z.array(billItemSchema).min(1, { message: "At least one item is required" }),
});

type PurchaseBillFormValues = z.infer<typeof purchaseBillSchema>;
type BillItem = z.infer<typeof billItemSchema>;

interface Vendor {
  id: string;
  name: string;
}

interface PurchaseBillFormProps {
  onSuccess: () => void;
  vendors: Vendor[];
  initialData?: PurchaseBillFormValues;
}

const PurchaseBillForm = ({ onSuccess, vendors, initialData }: PurchaseBillFormProps) => {
  const [items, setItems] = useState<BillItem[]>(initialData?.items || []);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemError, setItemError] = useState('');

  const form = useForm<PurchaseBillFormValues>({
    resolver: zodResolver(purchaseBillSchema),
    defaultValues: initialData || {
      vendorId: '',
      billDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      paymentDate: '',
      items: [],
    },
  });

  const addItem = () => {
    try {
      const newItem = billItemSchema.parse({
        name: itemName,
        quantity: parseFloat(itemQuantity),
        price: parseFloat(itemPrice)
      });
      
      setItems([...items, newItem]);
      form.setValue('items', [...items, newItem]);
      
      // Clear inputs
      setItemName('');
      setItemQuantity('');
      setItemPrice('');
      setItemError('');
    } catch (error) {
      if (error instanceof z.ZodError) {
        setItemError(error.errors[0].message);
      }
    }
  };

  const removeItem = (index: number) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
    form.setValue('items', updatedItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      return sum + (item.quantity * item.price);
    }, 0).toFixed(2);
  };

  const onSubmit = (data: PurchaseBillFormValues) => {
    // In a real application, you would save this data to your backend
    console.log('Purchase bill submitted:', data);
    
    // Calculate and add the total amount
    const submitData = {
      ...data,
      amount: `$${calculateTotal()}`
    };
    
    console.log('Final data with amount:', submitData);
    
    // Call the success callback
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="vendorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vendor</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>{vendor.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="billDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bill Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bill status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {form.watch('status') === 'Paid' && (
            <FormField
              control={form.control}
              name="paymentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        
        <Separator className="my-4" />
        
        <div>
          <h3 className="text-lg font-medium mb-2">Bill Items</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            <div>
              <label className="text-sm font-medium">Item Name</label>
              <Input 
                placeholder="Enter item name" 
                value={itemName} 
                onChange={(e) => setItemName(e.target.value)} 
              />
            </div>
            <div>
              <label className="text-sm font-medium">Quantity</label>
              <Input 
                type="number" 
                placeholder="Enter quantity" 
                value={itemQuantity} 
                onChange={(e) => setItemQuantity(e.target.value)} 
              />
            </div>
            <div>
              <label className="text-sm font-medium">Unit Price ($)</label>
              <Input 
                type="number" 
                placeholder="Enter unit price" 
                value={itemPrice} 
                onChange={(e) => setItemPrice(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            {itemError && <p className="text-sm text-red-500">{itemError}</p>}
            <Button 
              type="button" 
              onClick={addItem}
              size="sm"
              className="ml-auto"
            >
              <PlusCircle className="mr-1 h-4 w-4" />
              Add Item
            </Button>
          </div>
          
          {items.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>${(item.quantity * item.price).toFixed(2)}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeItem(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">Total Amount:</TableCell>
                  <TableCell className="font-bold">${calculateTotal()}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4 text-gray-500 border rounded-md">
              No items added yet. Add items to the bill.
            </div>
          )}
          
          {form.formState.errors.items && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.items.message}</p>
          )}
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={() => {
            form.reset();
            setItems([]);
          }}>
            Reset
          </Button>
          <Button type="submit">
            Save Bill
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PurchaseBillForm;
