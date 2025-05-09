
import React, { useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Check, X } from "lucide-react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

interface Order {
  id: string;
  date: string;
  customerName: string;
  items: string;
  total: string;
  payment: string;
  status: string;
  expectedAction: string;
}

const Orders: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const [currentPage, setCurrentPage] = useState(1);

  // Sample order data
  const orders: Order[] = [
    {
      id: 'ORD1001',
      date: '06 May 2025',
      customerName: 'Priya Sharma',
      items: '1 Kurti, 1 Dupatta',
      total: '₹1,299',
      payment: 'UPI - GPay',
      status: 'Pending',
      expectedAction: 'Confirm within 24 hrs'
    },
    {
      id: 'ORD1001',
      date: '06 May 2025',
      customerName: 'Priya Sharma',
      items: '1 Kurti, 1 Dupatta',
      total: '₹1,299',
      payment: 'UPI - GPay',
      status: 'Pending',
      expectedAction: 'Confirm within 24 hrs'
    },
    {
      id: 'ORD1001',
      date: '06 May 2025',
      customerName: 'Priya Sharma',
      items: '1 Kurti, 1 Dupatta',
      total: '₹1,299',
      payment: 'UPI - GPay',
      status: 'Pending',
      expectedAction: 'Confirm within 24 hrs'
    },
    {
      id: 'ORD1001',
      date: '06 May 2025',
      customerName: 'Priya Sharma',
      items: '1 Kurti, 1 Dupatta',
      total: '₹1,299',
      payment: 'UPI - GPay',
      status: 'Pending',
      expectedAction: 'Confirm within 24 hrs'
    },
    {
      id: 'ORD1001',
      date: '06 May 2025',
      customerName: 'Priya Sharma',
      items: '1 Kurti, 1 Dupatta',
      total: '₹1,299',
      payment: 'UPI - GPay',
      status: 'Pending',
      expectedAction: 'Confirm within 24 hrs'
    },
    {
      id: 'ORD1001',
      date: '06 May 2025',
      customerName: 'Priya Sharma',
      items: '1 Kurti, 1 Dupatta',
      total: '₹1,299',
      payment: 'UPI - GPay',
      status: 'Pending',
      expectedAction: 'Confirm within 24 hrs'
    },
    {
      id: 'ORD1001',
      date: '06 May 2025',
      customerName: 'Priya Sharma',
      items: '1 Kurti, 1 Dupatta',
      total: '₹1,299',
      payment: 'UPI - GPay',
      status: 'Pending',
      expectedAction: 'Confirm within 24 hrs'
    },
    {
      id: 'ORD1001',
      date: '06 May 2025',
      customerName: 'Priya Sharma',
      items: '1 Kurti, 1 Dupatta',
      total: '₹1,299',
      payment: 'UPI - GPay',
      status: 'Pending',
      expectedAction: 'Confirm within 24 hrs'
    },
    {
      id: 'ORD1001',
      date: '06 May 2025',
      customerName: 'Priya Sharma',
      items: '1 Kurti, 1 Dupatta',
      total: '₹1,299',
      payment: 'UPI - GPay',
      status: 'Pending',
      expectedAction: 'Confirm within 24 hrs'
    },
  ];

  const statusTabs = ['Pending', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Exchanged'];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <Button size="lg" className="bg-pink-500 hover:bg-pink-600">
          <span className="sr-only">Add new order</span>
          <span className="text-lg">+</span>
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        {/* Status Tabs */}
        <div className="flex border-b">
          {statusTabs.map((tab) => (
            <button
              key={tab}
              className={`px-8 py-4 text-sm font-medium ${
                activeTab === tab 
                  ? 'text-pink-500 border-b-2 border-pink-500' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {/* Orders Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-pink-500 text-white">
                <TableHead className="font-semibold">Order ID</TableHead>
                <TableHead className="font-semibold">Order Date</TableHead>
                <TableHead className="font-semibold">Customer Name</TableHead>
                <TableHead className="font-semibold">Items Ordered</TableHead>
                <TableHead className="font-semibold">Total</TableHead>
                <TableHead className="font-semibold">Payment</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Expected Action</TableHead>
                <TableHead className="font-semibold">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order, index) => (
                <TableRow key={index} className="border-b hover:bg-gray-50">
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>{order.payment}</TableCell>
                  <TableCell>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>{order.expectedAction}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button size="sm" className="bg-pink-500 hover:bg-pink-600">
                        <Eye className="h-4 w-4" />
                        <span className="ml-1">View</span>
                      </Button>
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                        <Check className="h-4 w-4" />
                        <span className="ml-1">Confirm</span>
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-300 hover:bg-gray-100">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">10</span> of <span className="font-medium">50</span>
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">4</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">5</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default Orders;
