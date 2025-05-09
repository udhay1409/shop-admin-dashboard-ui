
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
import { Eye, Check, X, Search, FilterIcon } from "lucide-react";

interface Order {
  id: string;
  date: string;
  customerName: string;
  items: string;
  total: string;
  payment: string;
  status: "Pending" | "Packed" | "Shipped" | "Delivered" | "Cancelled" | "Exchanged";
  expectedAction: string;
}

const Orders: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  
  // More varied sample order data
  const ordersData: Order[] = [
    {
      id: 'ORD1001',
      date: '09 May 2025',
      customerName: 'Priya Sharma',
      items: '1 Kurti, 1 Dupatta',
      total: '₹1,299',
      payment: 'UPI - GPay',
      status: 'Pending',
      expectedAction: 'Confirm within 24 hrs'
    },
    {
      id: 'ORD1002',
      date: '08 May 2025',
      customerName: 'Rahul Mehra',
      items: '2 T-shirts, 1 Jeans',
      total: '₹2,499',
      payment: 'Credit Card',
      status: 'Packed',
      expectedAction: 'Ready for shipping'
    },
    {
      id: 'ORD1003',
      date: '07 May 2025',
      customerName: 'Anjali Patel',
      items: '1 Saree',
      total: '₹3,999',
      payment: 'COD',
      status: 'Shipped',
      expectedAction: 'Delivery expected May 12'
    },
    {
      id: 'ORD1004',
      date: '06 May 2025',
      customerName: 'Kiran Reddy',
      items: '1 Lehenga Set',
      total: '₹8,499',
      payment: 'UPI - PhonePe',
      status: 'Delivered',
      expectedAction: 'Delivered on May 8'
    },
    {
      id: 'ORD1005',
      date: '05 May 2025',
      customerName: 'Vikram Singh',
      items: '3 Shirts, 2 Trousers',
      total: '₹4,299',
      payment: 'Net Banking',
      status: 'Cancelled',
      expectedAction: 'Refund initiated'
    },
    {
      id: 'ORD1006',
      date: '04 May 2025',
      customerName: 'Meera Desai',
      items: '1 Anarkali Suit',
      total: '₹2,799',
      payment: 'Debit Card',
      status: 'Exchanged',
      expectedAction: 'New item dispatched'
    },
    {
      id: 'ORD1007',
      date: '03 May 2025',
      customerName: 'Arjun Kumar',
      items: '2 Kurta Sets',
      total: '₹3,599',
      payment: 'UPI - GPay',
      status: 'Pending',
      expectedAction: 'Confirm within 24 hrs'
    },
    {
      id: 'ORD1008',
      date: '02 May 2025',
      customerName: 'Neha Verma',
      items: '1 Designer Gown',
      total: '₹5,999',
      payment: 'Credit Card',
      status: 'Packed',
      expectedAction: 'Ready for shipping'
    }
  ];

  // Filter orders based on active tab and search query
  const filteredOrders = ordersData.filter(order => {
    const matchesTab = activeTab === 'all' || order.status.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <Button variant="default" className="bg-pink-500 hover:bg-pink-600">
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
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <FilterIcon className="h-4 w-4" />
              <span>Filter</span>
            </Button>
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
            />
          </TabsContent>
          {["pending", "packed", "shipped", "delivered", "cancelled", "exchanged"].map(status => (
            <TabsContent key={status} value={status} className="m-0">
              <OrdersTable 
                orders={paginatedOrders} 
                getStatusBadgeClass={getStatusBadgeClass}
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
    </div>
  );
};

interface OrdersTableProps {
  orders: Order[];
  getStatusBadgeClass: (status: string) => string;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, getStatusBadgeClass }) => {
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
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                    {order.status === 'Pending' && (
                      <>
                        <Button size="sm" className="h-8 bg-pink-500 hover:bg-pink-600">
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Confirm</span>
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-red-300 hover:bg-red-50 hover:text-red-600">
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
