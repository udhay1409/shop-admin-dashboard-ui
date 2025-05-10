
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Order, OrderStatus, DeliveryStatus } from '@/types/order';

export interface DeliveryItem {
  id: string;
  orderId: string;
  customerName: string;
  address: string;
  status: DeliveryStatus;
  estimatedDelivery: string | null;
  assignedCourier?: string;
  createdAt: string;
}

// Get all deliveries that are in the delivery process
export async function getActiveDeliveries(): Promise<DeliveryItem[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      created_at,
      status,
      delivery_status,
      estimated_delivery,
      carrier,
      shipping_address,
      notes,
      profiles:user_id(first_name, last_name, phone)
    `)
    .in('status', ['Packed', 'Shipped'])
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching active deliveries:', error);
    toast({
      title: 'Failed to load deliveries',
      description: error.message,
      variant: 'destructive',
    });
    return [];
  }

  // Transform the data to our delivery format
  return data.map(item => {
    // Format the name
    const customerName = item.profiles ? 
      `${item.profiles.first_name || ''} ${item.profiles.last_name || ''}`.trim() : 
      'Unknown Customer';
    
    // Format the address
    let address = 'No address provided';
    if (item.shipping_address) {
      try {
        const addressObj = typeof item.shipping_address === 'string' ? 
          JSON.parse(item.shipping_address) : item.shipping_address;
        
        if (addressObj.full_address) {
          address = addressObj.full_address;
        } else {
          const parts = [];
          if (addressObj.line1) parts.push(addressObj.line1);
          if (addressObj.line2) parts.push(addressObj.line2);
          if (addressObj.city) parts.push(addressObj.city);
          if (addressObj.state) parts.push(addressObj.state);
          if (addressObj.postal_code) parts.push(addressObj.postal_code);
          address = parts.join(', ');
        }
      } catch (e) {
        console.error('Error parsing shipping address:', e);
      }
    }

    // Format estimated delivery date
    const estimatedDelivery = item.estimated_delivery ? 
      new Date(item.estimated_delivery).toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      }) : null;

    return {
      id: `DLV${item.id.substring(0, 6)}`,  // Generate a shorter ID for display
      orderId: item.id,
      customerName,
      address,
      status: item.delivery_status as DeliveryStatus || 'Awaiting Dispatch',
      estimatedDelivery,
      assignedCourier: item.carrier || undefined,
      createdAt: item.created_at
    };
  });
}

// Get delivery stats (count by status)
export async function getDeliveryStats(): Promise<{ 
  awaitingDispatch: number;
  outForDelivery: number;
  delivered: number;
}> {
  const { data, error } = await supabase
    .from('orders')
    .select('delivery_status, created_at')  // Added created_at to the selection
    .in('status', ['Packed', 'Shipped', 'Delivered'])
    .gte('created_at', new Date(new Date().setDate(new Date().getDate() - 30)).toISOString()); // Last 30 days

  if (error) {
    console.error('Error fetching delivery stats:', error);
    return {
      awaitingDispatch: 0,
      outForDelivery: 0,
      delivered: 0
    };
  }

  return {
    awaitingDispatch: data.filter(item => item.delivery_status === 'Awaiting Dispatch').length,
    outForDelivery: data.filter(item => item.delivery_status === 'Out for Delivery').length,
    delivered: data.filter(item => (item.delivery_status === 'Delivered') && 
      new Date(item.created_at) > new Date(new Date().setHours(0, 0, 0, 0))).length || 0 // Today only for delivered
  };
}

// Assign a courier to a delivery
export async function assignCourier(orderId: string, courierName: string): Promise<boolean> {
  const updateData = {
    carrier: courierName,
    delivery_status: 'Out for Delivery' as DeliveryStatus,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId);

  if (error) {
    console.error('Error assigning courier:', error);
    toast({
      title: 'Failed to assign courier',
      description: error.message,
      variant: 'destructive',
    });
    return false;
  }

  // Add entry to order status history
  await addDeliveryStatusHistory(orderId, 'Out for Delivery', `Assigned to courier: ${courierName}`);
  
  return true;
}

// Update delivery status
export async function updateDeliveryStatus(
  orderId: string, 
  status: DeliveryStatus, 
  notes?: string
): Promise<boolean> {
  const updates: any = {
    delivery_status: status,
    updated_at: new Date().toISOString()
  };

  // If delivered, also update the order status
  if (status === 'Delivered') {
    updates.status = 'Delivered';
  }

  const { error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId);

  if (error) {
    console.error('Error updating delivery status:', error);
    toast({
      title: 'Failed to update delivery status',
      description: error.message,
      variant: 'destructive',
    });
    return false;
  }

  // Add entry to order status history
  await addDeliveryStatusHistory(orderId, status, notes);
  
  return true;
}

// Add an entry to the delivery status history
async function addDeliveryStatusHistory(
  orderId: string, 
  status: DeliveryStatus, 
  notes?: string
): Promise<void> {
  // Get the current user
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  
  const { error } = await supabase
    .from('order_status_history')
    .insert({
      order_id: orderId,
      status,
      notes,
      created_by: userId
    });
  
  if (error) {
    console.error('Error adding delivery status history:', error);
  }
}
