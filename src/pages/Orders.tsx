
import React, { useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
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
import { Eye, Check, X, Search, FilterIcon, CalendarIcon, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Order {
  id: string;
  date: string;
  customerName: string;
  items: string;
  total: string;
  payment: string;
  status: "Pending" | "Packed" | "Shipped" | "Delivered" | "Cancelled" | "Exchanged";
  expectedAction: string;
  address?: string;
  phone?: string;
}

const Orders: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  
  // More varied sample order data with additional fields
  const [ordersData, setOrdersData] = useState<Order[]>([
    {
      id: 'ORD1001',
      date: '09 May 2025',
      customerName: 'Priya Sharma',
      items: '1 Kurti, 1 Dupatta',
      total: '₹1,299',
      payment: 'UPI - GPay',
      status: 'Pending',
      expectedAction: 'Confirm within 24 hrs',
      address: '123 MG Road, Bangalore, Karnataka',
      phone: '+91 98765 43210'
    },
    {
      id: 'ORD1002',
      date: '08 May 2025',
      customerName: 'Rahul Mehra',
      items: '2 T-shirts, 1 Jeans',
      total: '₹2,499',
      payment: 'Credit Card',
      status: 'Packed',
      expectedAction: 'Ready for shipping',
      address: '456 Park Street, Mumbai, Maharashtra',
      phone: '+91 87654 32109'
    },
    {
      id: 'ORD1003',
      date: '07 May 2025',
      customerName: 'Anjali Patel',
      items: '1 Saree',
      total: '₹3,999',
      payment: 'COD',
      status: 'Shipped',
      expectedAction: 'Delivery expected May 12',
      address: '789 Gandhi Road, Ahmedabad, Gujarat',
      phone: '+91 76543 21098'
    },
    {
      id: 'ORD1004',
      date: '06 May 2025',
      customerName: 'Kiran Reddy',
      items: '1 Lehenga Set',
      total: '₹8,499',
      payment: 'UPI - PhonePe',
      status: 'Delivered',
      expectedAction: 'Delivered on May 8',
      address: '234 Jubilee Hills, Hyderabad, Telangana',
      phone: '+91 65432 10987'
    },
    {
      id: 'ORD1005',
      date: '05 May 2025',
      customerName: 'Vikram Singh',
      items: '3 Shirts, 2 Trousers',
      total: '₹4,299',
      payment: 'Net Banking',
      status: 'Cancelled',
      expectedAction: 'Refund initiated',
      address: '567 Model Town, Delhi',
      phone: '+91 54321 09876'
    },
    {
      id: 'ORD1006',
      date: '04 May 2025',
      customerName: 'Meera Desai',
      items: '1 Anarkali Suit',
      total: '₹2,799',
      payment: 'Debit Card',
      status: 'Exchanged',
      expectedAction: 'New item dispatched',
      address: '890 Salt Lake, Kolkata, West Bengal',
      phone: '+91 43210 98765'
    },
    {
      id: 'ORD1007',
      date: '03 May 2025',
      customerName: 'Arjun Kumar',
      items: '2 Kurta Sets',
      total: '₹3,599',
      payment: 'UPI - GPay',
      status: 'Pending',
      expectedAction: 'Confirm within 24 hrs',
      address: '432 Anna Nagar, Chennai, Tamil Nadu',
      phone: '+91 32109 87654'
    },
    {
      id: 'ORD1008',
      date: '02 May 2025',
      customerName: 'Neha Verma',
      items: '1 Designer Gown',
      total: '₹5,999',
      payment: 'Credit Card',
      status: 'Packed',
      expectedAction: 'Ready for shipping',
      address: '765 Koregaon Park, Pune, Maharashtra',
      phone: '+91 21098 76543'
    }
  ]);

  // Handle order status update
  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = ordersData.map(order => {
      if (order.id === orderId) {
        let expectedAction = '';
        
        switch(newStatus) {
          case 'Packed':
            expectedAction = 'Ready for shipping';
            break;
          case 'Shipped':
            expectedAction = 'Delivery expected in 3-5 days';
            break;
          case 'Delivered':
            expectedAction = 'Delivered successfully';
            break;
          case 'Cancelled':
            expectedAction = 'Refund initiated';
            break;
          default:
            expectedAction = order.expectedAction;
        }
        
        return { ...order, status: newStatus, expectedAction };
      }
      return order;
    });
    
    setOrdersData(updatedOrders);
    
    // Show a confirmation toast
    toast({
      title: `Order ${orderId} Updated`,
      description: `Status changed to ${newStatus}`,
      variant: "default",
    });
  };

  // Handle confirm order action
  const handleConfirmOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'Packed');
  };

  // Handle cancel order action
  const handleCancelOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'Cancelled');
    setIsCancelDialogOpen(false);
  };

  // Handle view order details
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
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
  React.useEffect(() => {
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

  // Create a new order
  const handleNewOrder = () => {
    toast({
      title: "Feature Not Implemented",
      description: "The new order creation feature is not yet implemented.",
      variant: "default",
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <Button variant="default" className="bg-pink-500 hover:bg-pink-600" onClick={handleNewOrder}>
          <span className="mr-2">New Order</span>
          <span className="text-lg">+</span>
        </Button>
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
              onViewOrder={handleViewOrder}
              onConfirmOrder={handleConfirmOrder}
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
                onViewOrder={handleViewOrder}
                onConfirmOrder={handleConfirmOrder}
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
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Next Action</span>
                  <span>{selectedOrder.expectedAction}</span>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="sm:justify-start">
            <Button 
              variant="default" 
              className="bg-pink-500 hover:bg-pink-600"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
            
            {selectedOrder && selectedOrder.status === 'Pending' && (
              <Button 
                variant="outline" 
                onClick={() => {
                  handleConfirmOrder(selectedOrder.id);
                  setIsViewDialogOpen(false);
                }}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirm Order
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Order Confirmation Dialog */}
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will cancel the order {selectedOrder?.id}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep order</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedOrder) {
                  handleCancelOrder(selectedOrder.id);
                }
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              Yes, cancel order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

interface OrdersTableProps {
  orders: Order[];
  getStatusBadgeClass: (status: string) => string;
  onViewOrder: (order: Order) => void;
  onConfirmOrder: (orderId: string) => void;
  onCancelOrder: (order: Order) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ 
  orders, 
  getStatusBadgeClass,
  onViewOrder,
  onConfirmOrder,
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
                          <Check className="h-4 w-4" />
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
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-6 text-gray-500">
                No orders found. Try changing your search or filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Orders;
