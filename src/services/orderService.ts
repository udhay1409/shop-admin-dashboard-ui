
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderFromDB, OrderStatus, DeliveryStatus } from '@/types/order';
import { toast } from '@/hooks/use-toast';

// Get all orders from the database
export async function getAllOrders(): Promise<Order[]> {
  const { data: ordersData, error } = await supabase
    .from('orders')
    .select('*, profiles(first_name, last_name, phone)');
  
  if (error) {
    console.error('Error fetching orders:', error);
    toast({
      title: 'Failed to load orders',
      description: error.message,
      variant: 'destructive',
    });
    return [];
  }

  // Transform orders from DB format to UI format
  const orders: Order[] = ordersData.map((order: any) => {
    const customerName = order.profiles ? 
      `${order.profiles.first_name || ''} ${order.profiles.last_name || ''}`.trim() : 
      'Unknown Customer';
    
    return {
      id: order.id,
      date: formatDate(order.created_at),
      customerName,
      items: '...', // Will be populated from order_items in a separate query
      total: `₹${order.total_amount || 0}`,
      payment: order.payment_method || 'Unknown',
      status: order.status as OrderStatus,
      deliveryStatus: order.delivery_status as DeliveryStatus,
      estimatedDelivery: order.estimated_delivery ? formatDate(order.estimated_delivery) : null,
      deliveryTrackingId: order.tracking_number,
      deliveryCarrier: order.carrier,
      deliveryNotes: order.notes,
      expectedAction: getExpectedAction(order.status, order.delivery_status),
      address: order.shipping_address ? formatAddress(order.shipping_address) : undefined,
      phone: order.profiles?.phone,
    };
  });

  // For each order, fetch its items
  for (const order of orders) {
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('*, products(name)')
      .eq('order_id', order.id);

    if (!itemsError && orderItems) {
      order.items = orderItems.map((item: any) => 
        `${item.quantity} × ${item.products?.name || 'Product'}`
      ).join(', ');
    }
  }
  
  return orders;
}

// Update order status
export async function updateOrderStatus(
  orderId: string, 
  status: OrderStatus, 
  deliveryInfo?: { 
    deliveryStatus?: DeliveryStatus,
    estimatedDelivery?: string,
    deliveryTrackingId?: string,
    deliveryCarrier?: string,
    deliveryNotes?: string
  }
): Promise<boolean> {
  const updates: any = { status };
  
  if (deliveryInfo) {
    if (deliveryInfo.deliveryStatus) updates.delivery_status = deliveryInfo.deliveryStatus;
    if (deliveryInfo.deliveryTrackingId) updates.tracking_number = deliveryInfo.deliveryTrackingId;
    if (deliveryInfo.deliveryCarrier) updates.carrier = deliveryInfo.deliveryCarrier;
    if (deliveryInfo.deliveryNotes) updates.notes = deliveryInfo.deliveryNotes;
    if (deliveryInfo.estimatedDelivery) {
      // Convert string date to ISO format if needed
      try {
        const date = new Date(deliveryInfo.estimatedDelivery);
        updates.estimated_delivery = date.toISOString();
      } catch (e) {
        console.error('Invalid date format:', e);
      }
    }
  }
  
  const { error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId);
  
  if (error) {
    console.error('Error updating order:', error);
    toast({
      title: 'Failed to update order',
      description: error.message,
      variant: 'destructive',
    });
    return false;
  }
  
  // Add entry to order status history
  await addOrderStatusHistory(orderId, status, deliveryInfo?.deliveryNotes);
  
  return true;
}

// Add an entry to order status history
async function addOrderStatusHistory(
  orderId: string, 
  status: OrderStatus, 
  notes?: string
): Promise<void> {
  // Get the current user
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id || null;
  
  const { error } = await supabase
    .from('order_status_history')
    .insert({
      order_id: orderId,
      status,
      notes,
      created_by: userId // Use the user ID directly, not a Promise
    });
  
  if (error) {
    console.error('Error adding status history:', error);
  }
}

// Create a new order
export async function createOrder(orderData: Partial<Order>): Promise<string | null> {
  const user = await supabase.auth.getUser();
  
  if (!user.data.user) {
    toast({
      title: 'Authentication required',
      description: 'You must be logged in to create an order',
      variant: 'destructive',
    });
    return null;
  }
  
  // Format order data for database
  const newOrder = {
    user_id: user.data.user.id,
    status: 'Pending',
    total_amount: parseFloat(orderData.total?.replace('₹', '') || '0'),
    payment_method: orderData.payment,
    shipping_address: orderData.address ? { full_address: orderData.address } : null,
    notes: orderData.deliveryNotes || null,
  };
  
  const { data, error } = await supabase
    .from('orders')
    .insert(newOrder)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating order:', error);
    toast({
      title: 'Failed to create order',
      description: error.message,
      variant: 'destructive',
    });
    return null;
  }
  
  return data.id;
}

// Helper function to format dates
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
}

// Helper function to get expected action based on status
function getExpectedAction(status: string, deliveryStatus: string | null): string {
  switch(status) {
    case 'Pending':
      return 'Confirm within 24 hrs';
    case 'Packed':
      return 'Ready for shipping';
    case 'Shipped':
      return `Delivery expected in 3-5 days`;
    case 'Delivered':
      return 'Delivered successfully';
    case 'Cancelled':
      return 'Refund initiated';
    case 'Exchanged':
      return 'New item dispatched';
    default:
      return '';
  }
}

// Helper function to format address from JSON
function formatAddress(addressJson: any): string {
  if (typeof addressJson === 'string') {
    try {
      addressJson = JSON.parse(addressJson);
    } catch (e) {
      return addressJson;
    }
  }
  
  if (addressJson.full_address) {
    return addressJson.full_address;
  }
  
  const parts = [];
  if (addressJson.line1) parts.push(addressJson.line1);
  if (addressJson.line2) parts.push(addressJson.line2);
  if (addressJson.city) parts.push(addressJson.city);
  if (addressJson.state) parts.push(addressJson.state);
  if (addressJson.postal_code) parts.push(addressJson.postal_code);
  if (addressJson.country) parts.push(addressJson.country);
  
  return parts.join(', ');
}
