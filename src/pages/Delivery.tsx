
import React, { useState } from 'react';
import DeliveryAutomationFlow from '@/components/DeliveryAutomationFlow';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Truck, Package, Check, Clock, MapPin, X } from 'lucide-react';

interface DeliveryItem {
  id: string;
  orderId: string;
  customerName: string;
  address: string;
  status: "Awaiting Dispatch" | "Out for Delivery" | "Delivered" | "Failed Delivery";
  estimatedDelivery: string;
  assignedCourier?: string;
}

const Delivery: React.FC = () => {
  const [activeDeliveries, setActiveDeliveries] = useState<DeliveryItem[]>([
    {
      id: 'DLV1001',
      orderId: 'ORD1002',
      customerName: 'Rahul Mehra',
      address: '456 Park Street, Mumbai, Maharashtra',
      status: 'Awaiting Dispatch',
      estimatedDelivery: '12 May 2025',
    },
    {
      id: 'DLV1002',
      orderId: 'ORD1003',
      customerName: 'Anjali Patel',
      address: '789 Gandhi Road, Ahmedabad, Gujarat',
      status: 'Out for Delivery',
      estimatedDelivery: '12 May 2025',
      assignedCourier: 'Raj Kumar'
    },
    {
      id: 'DLV1003',
      orderId: 'ORD1008',
      customerName: 'Neha Verma',
      address: '765 Koregaon Park, Pune, Maharashtra',
      status: 'Awaiting Dispatch',
      estimatedDelivery: '15 May 2025',
    },
  ]);
  
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryItem | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [courierName, setCourierName] = useState('');
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Awaiting Dispatch':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'Out for Delivery':
        return <Truck className="h-5 w-5 text-amber-500" />;
      case 'Delivered':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'Failed Delivery':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const handleAssignDelivery = (delivery: DeliveryItem) => {
    setSelectedDelivery(delivery);
    setIsAssignDialogOpen(true);
  };
  
  const handleUpdateStatus = (delivery: DeliveryItem) => {
    setSelectedDelivery(delivery);
    setIsUpdateDialogOpen(true);
  };
  
  const confirmAssignment = () => {
    if (!selectedDelivery || !courierName.trim()) {
      toast({
        title: "Error",
        description: "Please enter the courier name",
        variant: "destructive",
      });
      return;
    }
    
    setActiveDeliveries(deliveries => 
      deliveries.map(d => 
        d.id === selectedDelivery.id 
          ? { ...d, assignedCourier: courierName, status: 'Out for Delivery' } 
          : d
      )
    );
    
    toast({
      title: "Courier Assigned",
      description: `${courierName} has been assigned to delivery ${selectedDelivery.id}`,
      variant: "default",
    });
    
    setCourierName('');
    setIsAssignDialogOpen(false);
  };
  
  const confirmStatusUpdate = (newStatus: DeliveryItem['status']) => {
    if (!selectedDelivery) return;
    
    setActiveDeliveries(deliveries => 
      deliveries.map(d => 
        d.id === selectedDelivery.id 
          ? { ...d, status: newStatus } 
          : d
      )
    );
    
    let message = '';
    
    switch(newStatus) {
      case 'Delivered':
        message = `Delivery ${selectedDelivery.id} marked as delivered`;
        break;
      case 'Failed Delivery':
        message = `Delivery ${selectedDelivery.id} marked as failed. A new attempt will be scheduled.`;
        break;
    }
    
    toast({
      title: "Status Updated",
      description: message,
      variant: newStatus === 'Delivered' ? "default" : "destructive",
    });
    
    setDeliveryNotes('');
    setIsUpdateDialogOpen(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Delivery Management</h1>
      </div>
      
      <DeliveryAutomationFlow className="mb-6" />
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-500" />
              Awaiting Dispatch
            </CardTitle>
            <CardDescription>
              Orders ready to be sent out
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeDeliveries.filter(d => d.status === 'Awaiting Dispatch').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Truck className="h-4 w-4 text-amber-500" />
              Out for Delivery
            </CardTitle>
            <CardDescription>
              Deliveries in transit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeDeliveries.filter(d => d.status === 'Out for Delivery').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              Delivered Today
            </CardTitle>
            <CardDescription>
              Successfully completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeDeliveries.filter(d => d.status === 'Delivered').length}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Active Deliveries</CardTitle>
          <CardDescription>
            Manage and track all ongoing deliveries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Est. Delivery</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeDeliveries.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell className="font-medium">{delivery.id}</TableCell>
                  <TableCell>{delivery.orderId}</TableCell>
                  <TableCell>{delivery.customerName}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{delivery.address}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(delivery.status)}
                      <span>{delivery.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>{delivery.estimatedDelivery}</TableCell>
                  <TableCell>
                    {delivery.assignedCourier || (
                      <span className="text-gray-400">Not assigned</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {delivery.status === 'Awaiting Dispatch' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleAssignDelivery(delivery)}
                        className="bg-pink-500 hover:bg-pink-600"
                      >
                        Assign Courier
                      </Button>
                    )}
                    
                    {delivery.status === 'Out for Delivery' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleUpdateStatus(delivery)}
                        variant="outline"
                        className="border-green-500 text-green-600 hover:bg-green-50"
                      >
                        Update Status
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Assign Courier Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Courier</DialogTitle>
            <DialogDescription>
              Assign a courier for delivery {selectedDelivery?.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="courierName" className="text-sm font-medium">
                Courier Name
              </label>
              <Input
                id="courierName"
                placeholder="Enter courier name"
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
              />
            </div>
            
            {selectedDelivery && (
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Delivery Address:</span>
                  <span className="font-medium">{selectedDelivery.address}</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-500">Customer:</span>
                  <span className="font-medium">{selectedDelivery.customerName}</span>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAssignDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmAssignment}
              className="bg-pink-500 hover:bg-pink-600"
            >
              Assign & Dispatch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Update Status Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Delivery Status</DialogTitle>
            <DialogDescription>
              Update the status for delivery {selectedDelivery?.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="deliveryNotes" className="text-sm font-medium">
                Delivery Notes (optional)
              </label>
              <Input
                id="deliveryNotes"
                placeholder="Add any delivery notes"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => confirmStatusUpdate('Failed Delivery')}
              >
                <X className="mr-2 h-4 w-4" />
                Failed Delivery
              </Button>
              
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => confirmStatusUpdate('Delivered')}
              >
                <Check className="mr-2 h-4 w-4" />
                Mark as Delivered
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Delivery;
