
import React from 'react';
import { Package, PackageOpen, Truck, MapPin } from "lucide-react";
import { Order } from '@/types/order';

// Order Timeline Component
interface OrderTimelineProps {
  order: Order;
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ order }) => {
  // Define timeline events based on order status
  const timelineEvents = [];
  
  // Always add confirmation step
  timelineEvents.push({
    status: 'Confirmed',
    icon: <Package className="h-4 w-4" />,
    date: order.date,
    isCompleted: true
  });
  
  // Add packing step
  timelineEvents.push({
    status: 'Packed',
    icon: <PackageOpen className="h-4 w-4" />,
    date: order.date, // In a real app, you'd have actual timestamps
    isCompleted: ['Packed', 'Shipped', 'Delivered'].includes(order.status)
  });
  
  // Add shipping step
  timelineEvents.push({
    status: 'Shipped',
    icon: <Truck className="h-4 w-4" />,
    date: order.deliveryStatus === 'Out for Delivery' || order.status === 'Delivered' ? 
          order.date : undefined,
    isCompleted: ['Shipped', 'Delivered'].includes(order.status)
  });
  
  // Add delivery step
  timelineEvents.push({
    status: 'Delivered',
    icon: <MapPin className="h-4 w-4" />,
    date: order.status === 'Delivered' ? order.date : undefined,
    isCompleted: order.status === 'Delivered'
  });
  
  return (
    <div className="space-y-3">
      {timelineEvents.map((event, index) => (
        <div key={index} className="flex items-start">
          <div className={`flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center ${
            event.isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
          }`}>
            {event.icon}
          </div>
          <div className="ml-3">
            <p className={`text-sm font-medium ${
              event.isCompleted ? 'text-green-600' : 'text-gray-500'
            }`}>
              {event.status}
            </p>
            {event.date && (
              <p className="text-xs text-gray-500">{event.date}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderTimeline;
