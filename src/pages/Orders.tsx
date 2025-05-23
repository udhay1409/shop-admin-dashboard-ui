
import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, FilterIcon, CalendarIcon, Download, Printer, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import OrderTimeline from '@/components/orders/OrderTimeline';
import OrdersTable from '@/components/orders/OrdersTable';
import OrderFormDialog from '@/components/orders/OrderFormDialog';
import { Order } from '@/types/order';
import { getAllOrders, updateOrderStatus, createOrder } from '@/services/orderService';

const Orders: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isDeliveryDialogOpen, setIsDeliveryDialogOpen] = useState(false);
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [ordersData, setOrdersData] = useState<Order[]>([]);

  // Fetch orders from the database
  useEffect(() => {
    async function fetchOrders() {
      setIsLoading(true);
      try {
        const orders = await getAllOrders();
        setOrdersData(orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Error loading orders",
          description: "There was a problem loading your orders.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchOrders();
  }, []);

  // Handle order status update with enhanced delivery tracking
  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status'], deliveryInfo?: Partial<Order>) => {
    const success = await updateOrderStatus(orderId, newStatus, {
      deliveryStatus: deliveryInfo?.deliveryStatus,
      estimatedDelivery: deliveryInfo?.estimatedDelivery,
      deliveryTrackingId: deliveryInfo?.deliveryTrackingId,
      deliveryCarrier: deliveryInfo?.deliveryCarrier,
      deliveryNotes: deliveryInfo?.deliveryNotes,
    });
    
    if (success) {
      // Optimistically update the UI
      const updatedOrders = ordersData.map(order => {
        if (order.id === orderId) {
          let expectedAction = '';
          let deliveryStatus = order.deliveryStatus;
          
          switch(newStatus) {
            case 'Packed':
              expectedAction = 'Ready for shipping';
              deliveryStatus = 'Awaiting Dispatch';
              break;
            case 'Shipped':
              expectedAction = 'Delivery expected in 3-5 days';
              deliveryStatus = 'Out for Delivery';
              break;
            case 'Delivered':
              expectedAction = 'Delivered successfully';
              deliveryStatus = 'Delivered';
              break;
            case 'Cancelled':
              expectedAction = 'Refund initiated';
              deliveryStatus = null;
              break;
            default:
              expectedAction = order.expectedAction;
          }
          
          return { 
            ...order, 
            status: newStatus, 
            expectedAction,
            deliveryStatus: deliveryInfo?.deliveryStatus || deliveryStatus,
            estimatedDelivery: deliveryInfo?.estimatedDelivery || order.estimatedDelivery,
            deliveryTrackingId: deliveryInfo?.deliveryTrackingId || order.deliveryTrackingId,
            deliveryCarrier: deliveryInfo?.deliveryCarrier || order.deliveryCarrier,
            deliveryNotes: deliveryInfo?.deliveryNotes || order.deliveryNotes
          };
        }
        return order;
      });
      
      setOrdersData(updatedOrders);
      
      toast({
        title: `Order ${orderId} Updated`,
        description: `Status changed to ${newStatus}`,
        variant: "default",
      });
    }
  };

  // Handle confirm order action
  const handleConfirmOrder = (orderId: string) => {
    handleUpdateOrderStatus(orderId, 'Packed');
  };

  // Handle cancel order action
  const handleCancelOrder = (orderId: string) => {
    handleUpdateOrderStatus(orderId, 'Cancelled');
    setIsCancelDialogOpen(false);
  };

  // Handle view order details
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  // Handle shipping order
  const handleShipOrder = (orderId: string) => {
    // Generate a random tracking ID
    const trackingId = `TRACK${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Calculate estimated delivery (5 days from now)
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 5);
    const formattedDeliveryDate = `${deliveryDate.getDate()} ${deliveryDate.toLocaleString('default', { month: 'short' })} ${deliveryDate.getFullYear()}`;
    
    handleUpdateOrderStatus(orderId, 'Shipped', {
      deliveryStatus: 'Out for Delivery',
      estimatedDelivery: formattedDeliveryDate,
      deliveryTrackingId: trackingId,
      deliveryCarrier: 'Express Delivery'
    });
    
    toast({
      title: `Order ${orderId} Shipped`,
      description: `Tracking ID: ${trackingId} | Est. Delivery: ${formattedDeliveryDate}`,
      variant: "default",
    });
  };

  // Handle delivery completion
  const handleDeliveryComplete = (orderId: string) => {
    handleUpdateOrderStatus(orderId, 'Delivered', {
      deliveryStatus: 'Delivered',
      deliveryNotes: deliveryNotes
    });
    
    setIsDeliveryDialogOpen(false);
    setDeliveryNotes('');
    
    toast({
      title: `Order ${orderId} Delivered`,
      description: `Delivery completed successfully`,
      variant: "default",
    });
  };

  // Handle failed delivery
  const handleFailedDelivery = (orderId: string) => {
    const updatedOrders = ordersData.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          deliveryStatus: 'Failed Delivery' as const,
          deliveryNotes: deliveryNotes || 'Delivery attempt failed'
        };
      }
      return order;
    });
    
    setOrdersData(updatedOrders);
    setIsDeliveryDialogOpen(false);
    setDeliveryNotes('');
    
    toast({
      title: `Order ${orderId} Delivery Failed`,
      description: `A new delivery attempt will be scheduled`,
      variant: "destructive",
    });
  };

  // Open delivery confirmation dialog
  const openDeliveryDialog = (order: Order) => {
    setSelectedOrder(order);
    setIsDeliveryDialogOpen(true);
  };

  // Export orders data as CSV
  const exportOrdersAsCSV = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      const headers = ['Order ID', 'Date', 'Customer', 'Items', 'Total', 'Payment', 'Status'];
      const rows = filteredOrders.map(order => [
        order.id,
        order.date,
        order.customerName,
        order.items,
        order.total,
        order.payment,
        order.status
      ]);
      
      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
      
      toast({
        title: "Orders Exported",
        description: `${filteredOrders.length} orders exported to CSV`,
        variant: "default",
      });
    }, 1000);
  };

  // Print order details
  const printOrderDetails = () => {
    if (!selectedOrder) return;
    
    // Open a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Print Failed",
        description: "Please allow popups for this site to print order details",
        variant: "destructive",
      });
      return;
    }
    
    // Create print-friendly content
    printWindow.document.write(`
      <html>
        <head>
          <title>Order ${selectedOrder.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 30px; }
            h1 { color: #333; }
            .order-info { margin-bottom: 20px; }
            .order-info div { margin-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .footer { margin-top: 30px; font-size: 12px; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <h1>Order Details: ${selectedOrder.id}</h1>
          <div class="order-info">
            <div><strong>Date:</strong> ${selectedOrder.date}</div>
            <div><strong>Customer:</strong> ${selectedOrder.customerName}</div>
            <div><strong>Address:</strong> ${selectedOrder.address || 'N/A'}</div>
            <div><strong>Phone:</strong> ${selectedOrder.phone || 'N/A'}</div>
            <div><strong>Status:</strong> ${selectedOrder.status}</div>
            <div><strong>Payment:</strong> ${selectedOrder.payment}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Items</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${selectedOrder.items}</td>
                <td>${selectedOrder.total}</td>
              </tr>
            </tbody>
          </table>
          <div class="footer">
            <p>Printed on ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `);
    
    // Trigger print and close the window after
    setTimeout(() => {
      printWindow.document.close();
      printWindow.print();
    }, 500);
    
    toast({
      title: "Print Initiated",
      description: "Order details prepared for printing",
      variant: "default",
    });
  };

  // Filter orders based on active tab, search query, and additional filters
  const filteredOrders = ordersData.filter(order => {
    // Filter by tab
    const matchesTab = activeTab === 'all' || order.status.toLowerCase() === activeTab.toLowerCase();
    
    // Filter by search query
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by date if date filter is active
    const matchesDate = dateFilter ? order.date.includes(dateFilter) : true;
    
    // Filter by payment method if payment filter is active
    const matchesPayment = paymentFilter ? order.payment.includes(paymentFilter) : true;
    
    return matchesTab && matchesSearch && matchesDate && matchesPayment;
  });

  // Calculate pagination
  const ordersPerPage = 5;
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ordersPerPage);
  
  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab, dateFilter, paymentFilter]);

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800';
      case 'Packed':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Exchanged':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeliveryStatusBadgeClass = (status: string | null | undefined) => {
    if (!status) return '';
    
    switch(status) {
      case 'Awaiting Dispatch':
        return 'bg-blue-50 text-blue-700';
      case 'Out for Delivery':
        return 'bg-amber-50 text-amber-700';
      case 'Delivered':
        return 'bg-green-50 text-green-700';
      case 'Failed Delivery':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  // Create a new order
  const handleCreateOrder = async (newOrderData: Partial<Order>) => {
    const orderId = await createOrder(newOrderData);
    
    if (orderId) {
      // Refresh the orders list
      const orders = await getAllOrders();
      setOrdersData(orders);
      
      // Close the dialog
      setIsNewOrderDialogOpen(false);
      
      // Show confirmation toast
      toast({
        title: "New Order Created",
        description: `Order ID: ${orderId}`,
        variant: "default",
      });
    }
  };

  // Handle order creation
  const handleNewOrder = () => {
    setIsNewOrderDialogOpen(true);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#EC008C] border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={exportOrdersAsCSV}
            disabled={isExporting || filteredOrders.length === 0}
          >
            <Download className="h-4 w-4" />
            <span>{isExporting ? 'Exporting...' : 'Export Orders'}</span>
          </Button>
          <Button 
            variant="default" 
            className="bg-pink-500 hover:bg-pink-600" 
            onClick={handleNewOrder}
          >
            <span className="mr-2">New Order</span>
            <span className="text-lg">+</span>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Search and Filter Bar */}
        <div className="p-4 border-b flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search orders..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <FilterIcon className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Filter Orders</h4>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <div className="flex gap-2 items-center">
                      <CalendarIcon className="h-4 w-4 opacity-50" />
                      <Input 
                        placeholder="e.g. May 2025"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Payment Method</label>
                    <Input 
                      placeholder="e.g. UPI, COD, Card"
                      value={paymentFilter}
                      onChange={(e) => setPaymentFilter(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDateFilter('');
                        setPaymentFilter('');
                      }}
                    >
                      Reset
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => setIsFilterOpen(false)}
                      className="bg-pink-500 hover:bg-pink-600"
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              Total: <span className="font-medium">{filteredOrders.length}</span> orders
            </span>
          </div>
        </div>

        {/* Order Status Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b overflow-x-auto">
            <TabsList className="bg-transparent h-auto p-0 flex w-full">
              <TabsTrigger 
                value="all" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-pink-500 data-[state=active]:bg-transparent data-[state=active]:text-pink-600 py-3 px-5"
              >
                All Orders
              </TabsTrigger>
              <TabsTrigger 
                value="pending" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-pink-500 data-[state=active]:bg-transparent data-[state=active]:text-pink-600 py-3 px-5"
              >
                Pending
              </TabsTrigger>
              <TabsTrigger 
                value="packed" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-pink-500 data-[state=active]:bg-transparent data-[state=active]:text-pink-600 py-3 px-5"
              >
                Packed
              </TabsTrigger>
              <TabsTrigger 
                value="shipped" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-pink-500 data-[state=active]:bg-transparent data-[state=active]:text-pink-600 py-3 px-5"
              >
                Shipped
              </TabsTrigger>
              <TabsTrigger 
                value="delivered" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-pink-500 data-[state=active]:bg-transparent data-[state=active]:text-pink-600 py-3 px-5"
              >
                Delivered
              </TabsTrigger>
              <TabsTrigger 
                value="cancelled" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-pink-500 data-[state=active]:bg-transparent data-[state=active]:text-pink-600 py-3 px-5"
              >
                Cancelled
              </TabsTrigger>
              <TabsTrigger 
                value="exchanged" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-pink-500 data-[state=active]:bg-transparent data-[state=active]:text-pink-600 py-3 px-5"
              >
                Exchanged
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="m-0">
            <OrdersTable 
              orders={paginatedOrders} 
              getStatusBadgeClass={getStatusBadgeClass}
              getDeliveryStatusBadgeClass={getDeliveryStatusBadgeClass}
              onViewOrder={handleViewOrder}
              onConfirmOrder={handleConfirmOrder}
              onShipOrder={handleShipOrder}
              onDeliveryUpdate={openDeliveryDialog}
              onCancelOrder={(order) => {
                setSelectedOrder(order);
                setIsCancelDialogOpen(true);
              }}
            />
          </TabsContent>
          {["pending", "packed", "shipped", "delivered", "cancelled", "exchanged"].map(status => (
            <TabsContent key={status} value={status} className="m-0">
              <OrdersTable 
                orders={paginatedOrders} 
                getStatusBadgeClass={getStatusBadgeClass}
                getDeliveryStatusBadgeClass={getDeliveryStatusBadgeClass}
                onViewOrder={handleViewOrder}
                onConfirmOrder={handleConfirmOrder}
                onShipOrder={handleShipOrder}
                onDeliveryUpdate={openDeliveryDialog}
                onCancelOrder={(order) => {
                  setSelectedOrder(order);
                  setIsCancelDialogOpen(true);
                }}
              />
            </TabsContent>
          ))}
        </Tabs>

        {/* Pagination */}
        <div className="px-4 py-3 flex items-center justify-between border-t">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(startIndex + ordersPerPage, filteredOrders.length)}
            </span>{" "}
            of <span className="font-medium">{filteredOrders.length}</span> results
          </div>
          
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {pageNumbers.map(number => (
                <PaginationItem key={number}>
                  <PaginationLink 
                    href="#" 
                    isActive={currentPage === number}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(number);
                    }}
                  >
                    {number}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      {/* View Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Complete information about this order.
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{selectedOrder.id}</h3>
                  <p className="text-sm text-gray-500">{selectedOrder.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Customer</span>
                  <span className="font-medium">{selectedOrder.customerName}</span>
                </div>
                
                {selectedOrder.phone && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Phone</span>
                    <span>{selectedOrder.phone}</span>
                  </div>
                )}
                
                {selectedOrder.address && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Address</span>
                    <span className="text-right max-w-[60%]">{selectedOrder.address}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Items</span>
                  <span>{selectedOrder.items}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Total</span>
                  <span className="font-medium">{selectedOrder.total}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Payment</span>
                  <span>{selectedOrder.payment}</span>
                </div>
                
                {selectedOrder.deliveryStatus && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Delivery Status</span>
                      <span className={`text-sm px-2 py-1 rounded-md ${getDeliveryStatusBadgeClass(selectedOrder.deliveryStatus)}`}>
                        {selectedOrder.deliveryStatus}
                      </span>
                    </div>
                    
                    {selectedOrder.estimatedDelivery && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Est. Delivery</span>
                        <span>{selectedOrder.estimatedDelivery}</span>
                      </div>
                    )}
                    
                    {selectedOrder.deliveryTrackingId && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Tracking ID</span>
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {selectedOrder.deliveryTrackingId}
                        </span>
                      </div>
                    )}
                    
                    {selectedOrder.deliveryCarrier && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Carrier</span>
                        <span>{selectedOrder.deliveryCarrier}</span>
                      </div>
                    )}
                    
                    {selectedOrder.deliveryNotes && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Delivery Notes</span>
                        <span className="text-right max-w-[60%]">{selectedOrder.deliveryNotes}</span>
                      </div>
                    )}
                  </>
                )}
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Next Action</span>
                  <span>{selectedOrder.expectedAction}</span>
                </div>
              </div>
              
              {/* Order Timeline */}
              {selectedOrder.status !== 'Pending' && selectedOrder.status !== 'Cancelled' && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium mb-3">Order Timeline</h4>
                  <OrderTimeline order={selectedOrder} />
                </div>
              )}
            </div>
          )}
          
          <DialogFooter className="sm:justify-start gap-2 flex-wrap">
            <Button 
              variant="default" 
              className="bg-pink-500 hover:bg-pink-600"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
            
            <Button 
              variant="outline" 
              onClick={printOrderDetails}
              className="border-gray-300"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Order Confirmation */}
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this order? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Keep Order</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => selectedOrder && handleCancelOrder(selectedOrder.id)}
              className="bg-red-500 hover:bg-red-600"
            >
              Yes, Cancel Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delivery Status Update Dialog */}
      <Dialog open={isDeliveryDialogOpen} onOpenChange={setIsDeliveryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Delivery Status</DialogTitle>
            <DialogDescription>
              Update the delivery status for order {selectedOrder?.id}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Delivery Notes (Optional)</label>
              <Input 
                placeholder="E.g., Left with receptionist, customer was not home..."
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter className="sm:justify-start gap-2 flex-wrap">
            <Button 
              variant="outline" 
              onClick={() => setIsDeliveryDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => selectedOrder && handleFailedDelivery(selectedOrder.id)}
            >
              Failed Delivery
            </Button>
            <Button 
              className="bg-green-500 hover:bg-green-600"
              onClick={() => selectedOrder && handleDeliveryComplete(selectedOrder.id)}
            >
              <Check className="mr-2 h-4 w-4" />
              Mark as Delivered
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Order Dialog */}
      <OrderFormDialog 
        open={isNewOrderDialogOpen}
        onOpenChange={setIsNewOrderDialogOpen}
        onSubmit={handleCreateOrder}
      />
    </div>
  );
};

export default Orders;
