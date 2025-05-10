
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, ArrowRight, X, Truck, Check } from "lucide-react";
import { Order } from '@/types/order';

interface OrdersTableProps {
  orders: Order[];
  getStatusBadgeClass: (status: string) => string;
  getDeliveryStatusBadgeClass: (status: string | null | undefined) => string;
  onViewOrder: (order: Order) => void;
  onConfirmOrder: (orderId: string) => void;
  onShipOrder: (orderId: string) => void;
  onDeliveryUpdate: (order: Order) => void;
  onCancelOrder: (order: Order) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ 
  orders, 
  getStatusBadgeClass,
  getDeliveryStatusBadgeClass,
  onViewOrder,
  onConfirmOrder,
  onShipOrder,
  onDeliveryUpdate,
  onCancelOrder
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Order ID</TableHead>
            <TableHead className="font-semibold">Date</TableHead>
            <TableHead className="font-semibold">Customer</TableHead>
            <TableHead className="font-semibold">Items</TableHead>
            <TableHead className="font-semibold">Total</TableHead>
            <TableHead className="font-semibold">Payment</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Delivery</TableHead>
            <TableHead className="font-semibold">Next Action</TableHead>
            <TableHead className="font-semibold text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <TableRow key={index} className="border-b hover:bg-gray-50">
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell>{order.payment}</TableCell>
                <TableCell>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>
                  {order.deliveryStatus ? (
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getDeliveryStatusBadgeClass(order.deliveryStatus)}`}>
                      {order.deliveryStatus}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>{order.expectedAction}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 w-8 p-0"
                      onClick={() => onViewOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                    
                    {order.status === 'Pending' && (
                      <>
                        <Button 
                          size="sm" 
                          className="h-8 bg-pink-500 hover:bg-pink-600"
                          onClick={() => onConfirmOrder(order.id)}
                        >
                          <ArrowRight className="h-4 w-4" />
                          <span className="sr-only">Confirm</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 w-8 p-0 border-red-300 hover:bg-red-50 hover:text-red-600"
                          onClick={() => onCancelOrder(order)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Cancel</span>
                        </Button>
                      </>
                    )}
                    
                    {order.status === 'Packed' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-8 border-amber-300 hover:bg-amber-50 hover:text-amber-600"
                        onClick={() => onShipOrder(order.id)}
                      >
                        <Truck className="h-4 w-4 mr-1" />
                        <span className="text-xs">Ship</span>
                      </Button>
                    )}
                    
                    {order.status === 'Shipped' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-8 border-green-300 hover:bg-green-50 hover:text-green-600"
                        onClick={() => onDeliveryUpdate(order)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        <span className="text-xs">Deliver</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-6 text-gray-500">
                No orders found. Try changing your search or filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersTable;
