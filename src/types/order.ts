
export interface Order {
  id: string;
  date: string;
  customerName: string;
  items: string;
  total: string;
  payment: string;
  status: "Pending" | "Packed" | "Shipped" | "Delivered" | "Cancelled" | "Exchanged";
  deliveryStatus?: "Awaiting Dispatch" | "Out for Delivery" | "Delivered" | "Failed Delivery" | null;
  estimatedDelivery?: string | null;
  deliveryTrackingId?: string | null;
  deliveryCarrier?: string | null;
  deliveryNotes?: string | null;
  expectedAction: string;
  address?: string;
  phone?: string;
}
