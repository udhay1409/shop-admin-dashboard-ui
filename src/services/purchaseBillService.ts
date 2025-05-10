
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface PurchaseBillItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface PurchaseBill {
  id: string;
  vendor_id: string;
  invoice_number: string | null;
  bill_date: string;
  amount: number;
  status: 'Paid' | 'Pending';
  payment_method: string | null;
  payment_date: string | null;
  delivery_date: string | null;
  created_at: string;
  updated_at: string;
  vendor?: {
    id: string;
    name: string;
  };
  items?: PurchaseBillItem[];
}

// Fetch all purchase bills
export async function getPurchaseBills(): Promise<PurchaseBill[]> {
  try {
    const { data, error } = await supabase
      .from('purchase_bills')
      .select(`
        *,
        vendor:vendors(id, name)
      `)
      .order('bill_date', { ascending: false });

    if (error) {
      console.error('Error fetching purchase bills:', error);
      toast({
        title: 'Failed to load purchase bills',
        description: error.message,
        variant: 'destructive',
      });
      return [];
    }

    // Cast the status field to ensure type safety
    return (data || []).map(bill => ({
      ...bill,
      status: bill.status === 'Paid' ? 'Paid' : 'Pending'
    })) as PurchaseBill[];
  } catch (error: any) {
    console.error('Exception fetching purchase bills:', error);
    return [];
  }
}

// Get bills for a specific vendor
export async function getVendorPurchaseBills(vendorId: string): Promise<PurchaseBill[]> {
  try {
    const { data, error } = await supabase
      .from('purchase_bills')
      .select(`
        *,
        vendor:vendors(id, name)
      `)
      .eq('vendor_id', vendorId)
      .order('bill_date', { ascending: false });

    if (error) {
      console.error('Error fetching vendor purchase bills:', error);
      return [];
    }

    // Cast the status field to ensure type safety
    return (data || []).map(bill => ({
      ...bill,
      status: bill.status === 'Paid' ? 'Paid' : 'Pending'
    })) as PurchaseBill[];
  } catch (error) {
    console.error('Exception fetching vendor purchase bills:', error);
    return [];
  }
}

// Get a single bill with its items
export async function getPurchaseBillWithItems(billId: string): Promise<PurchaseBill | null> {
  try {
    // Get the bill
    const { data: bill, error: billError } = await supabase
      .from('purchase_bills')
      .select(`
        *,
        vendor:vendors(id, name)
      `)
      .eq('id', billId)
      .maybeSingle();

    if (billError || !bill) {
      console.error('Error fetching purchase bill:', billError);
      return null;
    }

    // Get the bill items
    const { data: items, error: itemsError } = await supabase
      .from('purchase_bill_items')
      .select('*')
      .eq('bill_id', billId);

    if (itemsError) {
      console.error('Error fetching bill items:', itemsError);
    }

    return {
      ...bill,
      status: bill.status === 'Paid' ? 'Paid' : 'Pending',
      items: items || []
    } as PurchaseBill;
  } catch (error) {
    console.error('Exception fetching bill with items:', error);
    return null;
  }
}

// Create a new purchase bill
export async function createPurchaseBill(
  bill: Omit<PurchaseBill, 'id' | 'created_at' | 'updated_at'>,
  items: Omit<PurchaseBillItem, 'id'>[]
): Promise<PurchaseBill | null> {
  try {
    // Start a transaction by inserting the bill first
    const { data: newBill, error: billError } = await supabase
      .from('purchase_bills')
      .insert({
        vendor_id: bill.vendor_id,
        invoice_number: bill.invoice_number,
        bill_date: bill.bill_date,
        amount: bill.amount,
        status: bill.status,
        payment_method: bill.payment_method,
        payment_date: bill.payment_date,
        delivery_date: bill.delivery_date
      })
      .select()
      .single();

    if (billError || !newBill) {
      console.error('Error creating purchase bill:', billError);
      toast({
        title: 'Failed to create purchase bill',
        description: billError?.message || 'An error occurred',
        variant: 'destructive',
      });
      return null;
    }

    // Then insert all bill items
    if (items.length > 0) {
      const billItems = items.map(item => ({
        bill_id: newBill.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.total
      }));

      const { error: itemsError } = await supabase
        .from('purchase_bill_items')
        .insert(billItems);

      if (itemsError) {
        console.error('Error creating bill items:', itemsError);
        toast({
          title: 'Bill created, but items failed to save',
          description: itemsError.message,
          variant: 'destructive',
        });
      }
    }

    toast({
      title: 'Purchase bill created',
      description: 'New purchase bill has been added successfully.',
    });
    
    return { 
      ...newBill, 
      status: newBill.status === 'Paid' ? 'Paid' : 'Pending',
      items: items as PurchaseBillItem[] 
    };
  } catch (error: any) {
    console.error('Exception creating purchase bill:', error);
    toast({
      title: 'Failed to create purchase bill',
      description: error.message || 'An unexpected error occurred',
      variant: 'destructive',
    });
    return null;
  }
}

// Delete a purchase bill
export async function deletePurchaseBill(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('purchase_bills')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting purchase bill:', error);
      toast({
        title: 'Failed to delete purchase bill',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }

    toast({
      title: 'Purchase bill deleted',
      description: 'The purchase bill has been removed successfully.',
    });
    
    return true;
  } catch (error: any) {
    console.error('Exception deleting purchase bill:', error);
    toast({
      title: 'Failed to delete purchase bill',
      description: error.message || 'An unexpected error occurred',
      variant: 'destructive',
    });
    return false;
  }
}

// Format the purchase bill amount to a string with currency symbol
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
