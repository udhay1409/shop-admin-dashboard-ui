
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Receipt, FileText, CreditCard } from "lucide-react";
import TransactionDetailModal from '@/components/transactions/TransactionDetailModal';
import { useQuery } from '@tanstack/react-query';

// Mock data for transactions - would be replaced with actual Razorpay API call
const fetchTransactions = async () => {
  // In a real app, this would call the Razorpay API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        transactions: [
          { 
            id: 'pay_LMN5678OPQ', 
            orderId: 'order_123456', 
            amount: 4999, 
            status: 'captured',
            method: 'card',
            email: 'john.doe@example.com',
            contact: '+919876543210',
            created: new Date('2025-05-05T14:32:10'),
            card: {
              last4: '1234',
              network: 'Visa',
            }
          },
          { 
            id: 'pay_ABC1234DEF', 
            orderId: 'order_654321', 
            amount: 2499, 
            status: 'authorized',
            method: 'upi',
            email: 'jane.smith@example.com',
            contact: '+919876543211',
            created: new Date('2025-05-04T09:15:22'),
            upi: {
              vpa: 'jane.smith@upi'
            }
          },
          { 
            id: 'pay_GHI9012JKL', 
            orderId: 'order_789012', 
            amount: 7999, 
            status: 'failed',
            method: 'netbanking',
            email: 'alex.wong@example.com',
            contact: '+919876543212',
            created: new Date('2025-05-03T18:45:30'),
            bank: {
              name: 'HDFC'
            }
          },
          { 
            id: 'pay_RST3456UVW', 
            orderId: 'order_345678', 
            amount: 1099, 
            status: 'refunded',
            method: 'wallet',
            email: 'priya.patel@example.com',
            contact: '+919876543213',
            created: new Date('2025-05-02T11:20:15'),
            wallet: {
              name: 'Paytm'
            }
          },
          { 
            id: 'pay_XYZ7890ABC', 
            orderId: 'order_901234', 
            amount: 3499, 
            status: 'captured',
            method: 'card',
            email: 'mike.jones@example.com',
            contact: '+919876543214',
            created: new Date('2025-05-01T16:05:50'),
            card: {
              last4: '5678',
              network: 'Mastercard',
            }
          }
        ],
        total: 157
      });
    }, 1000);
  });
};

const TransactionLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  
  const { data, isLoading } = useQuery({
    queryKey: ['transactions', searchTerm],
    queryFn: fetchTransactions
  });

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount / 100); // Razorpay amounts are in paisa
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'captured':
        return <Badge className="bg-green-500">Captured</Badge>;
      case 'authorized':
        return <Badge className="bg-blue-500">Authorized</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>;
      case 'refunded':
        return <Badge className="bg-amber-500">Refunded</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCard className="h-4 w-4 text-gray-500" />;
      case 'upi':
        return <FileText className="h-4 w-4 text-gray-500" />;
      default:
        return <Receipt className="h-4 w-4 text-gray-500" />;
    }
  };

  const viewTransactionDetails = (transaction: any) => {
    setSelectedTransaction(transaction);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transaction Logs</h1>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <Input
              type="search"
              placeholder="Search transactions..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">Export</Button>
          <Button>Sync from Razorpay</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableCaption>A list of payment transactions processed via Razorpay.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{transaction.orderId}</TableCell>
                    <TableCell>{formatDate(transaction.created)}</TableCell>
                    <TableCell>
                      <div>{transaction.email}</div>
                      <div className="text-sm text-gray-500">{transaction.contact}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPaymentMethodIcon(transaction.method)}
                        <span className="capitalize">{transaction.method}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{formatAmount(transaction.amount)}</TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => viewTransactionDetails(transaction)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">{data?.total || 0}</span> transactions
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
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}

      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          isOpen={!!selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          formatAmount={formatAmount}
        />
      )}
    </div>
  );
};

export default TransactionLogs;
