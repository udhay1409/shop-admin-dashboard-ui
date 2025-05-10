
import { Database } from '@/integrations/supabase/types';

export type OrderFromDB = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type OrderStatusHistory = Database['public']['Tables']['order_status_history']['Row'];

export type OrderStatus = 'Pending' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Exchanged';
export type DeliveryStatus = 'Awaiting Dispatch' | 'Out for Delivery' | 'Delivered' | 'Failed Delivery' | null;
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface Order {
  id: string;
  date: string;
  customerName: string;
  items: string;
  total: string;
  payment: string;
  status: OrderStatus;
  deliveryStatus?: DeliveryStatus;
  estimatedDelivery?: string | null;
  deliveryTrackingId?: string | null;
  deliveryCarrier?: string | null;
  deliveryNotes?: string | null;
  expectedAction: string;
  address?: string;
  phone?: string;
}

export interface OrderWithDetails extends Order {
  orderItems?: OrderItem[];
  statusHistory?: OrderStatusHistory[];
}
