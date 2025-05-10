
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';
import { Receipt, CreditCard, User, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

interface TransactionDetailModalProps {
  transaction: any;
  isOpen: boolean;
  onClose: () => void;
  formatAmount: (amount: number) => string;
}

const TransactionDetailModal = ({ 
  transaction, 
  isOpen, 
  onClose,
  formatAmount
}: TransactionDetailModalProps) => {
  if (!transaction) return null;

  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'captured':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'authorized':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'refunded':
        return <Receipt className="h-5 w-5 text-amber-500" />;
      default:
        return null;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const renderPaymentMethodDetails = () => {
    switch (transaction.method) {
      case 'card':
        return (
          <>
            <div className="flex items-center">
              <CreditCard className="h-4 w-4 text-gray-500 mr-2" />
              <span className="capitalize font-medium">Card Payment</span>
            </div>
            <div className="mt-1 text-sm text-gray-500">
              {transaction.card?.network} **** {transaction.card?.last4}
            </div>
          </>
        );
      case 'upi':
        return (
          <>
            <div className="flex items-center">
              <Receipt className="h-4 w-4 text-gray-500 mr-2" />
              <span className="capitalize font-medium">UPI</span>
            </div>
            <div className="mt-1 text-sm text-gray-500">
              VPA: {transaction.upi?.vpa}
            </div>
          </>
        );
      case 'netbanking':
        return (
          <>
            <div className="flex items-center">
              <Receipt className="h-4 w-4 text-gray-500 mr-2" />
              <span className="capitalize font-medium">Net Banking</span>
            </div>
            <div className="mt-1 text-sm text-gray-500">
              Bank: {transaction.bank?.name}
            </div>
          </>
        );
      case 'wallet':
        return (
          <>
            <div className="flex items-center">
              <Receipt className="h-4 w-4 text-gray-500 mr-2" />
              <span className="capitalize font-medium">Wallet</span>
            </div>
            <div className="mt-1 text-sm text-gray-500">
              Provider: {transaction.wallet?.name}
            </div>
          </>
        );
      default:
        return (
          <div className="flex items-center">
            <Receipt className="h-4 w-4 text-gray-500 mr-2" />
            <span className="capitalize font-medium">{transaction.method}</span>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">Transaction Details</DialogTitle>
          <DialogDescription>
            Razorpay Transaction ID: {transaction.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between">
            <div>
              <div className="text-sm text-gray-500">Amount</div>
              <div className="font-semibold text-lg">{formatAmount(transaction.amount)}</div>
            </div>
            <div className="flex items-center gap-1.5">
              {getStatusIcon()}
              <span className="capitalize font-medium">{transaction.status}</span>
            </div>
          </div>

          <Separator />

          <div>
            <div className="text-sm font-medium mb-2">Payment Information</div>
            <div className="grid grid-cols-1 gap-3">
              <div>
                {renderPaymentMethodDetails()}
              </div>

              <div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="font-medium">Date & Time</span>
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  {formatDate(transaction.created)}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <div className="text-sm font-medium mb-2">Customer Information</div>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="font-medium">Contact</span>
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  {transaction.email}
                </div>
                <div className="mt-0.5 text-sm text-gray-500">
                  {transaction.contact}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <div className="text-sm font-medium mb-2">Order Information</div>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <div className="text-sm text-gray-500">Order ID</div>
                <div className="font-medium">{transaction.orderId}</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailModal;
