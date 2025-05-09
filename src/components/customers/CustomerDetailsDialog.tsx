
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Customer } from '@/types/customer';
import { Separator } from '@/components/ui/separator';

interface CustomerDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
}

const CustomerDetailsDialog: React.FC<CustomerDetailsDialogProps> = ({
  isOpen,
  onClose,
  customer,
}) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
          <DialogDescription>
            View detailed information about this customer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
            <div>
              <h3 className="font-bold text-xl">{customer.name}</h3>
              <p className="text-gray-500">{customer.email}</p>
            </div>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                customer.status === 'Active'
                  ? 'bg-green-100 text-green-800'
                  : customer.status === 'Inactive'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {customer.status}
            </span>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-500">Contact Information</h4>
              <div className="mt-2 space-y-2">
                <div>
                  <span className="text-gray-500">Email:</span>
                  <span className="ml-2">{customer.email}</span>
                </div>
                <div>
                  <span className="text-gray-500">Phone:</span>
                  <span className="ml-2">{customer.phone || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Address:</span>
                  <span className="ml-2">{customer.address || 'Not provided'}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-500">Account Information</h4>
              <div className="mt-2 space-y-2">
                <div>
                  <span className="text-gray-500">Customer ID:</span>
                  <span className="ml-2">{customer.id}</span>
                </div>
                <div>
                  <span className="text-gray-500">Joined:</span>
                  <span className="ml-2">{formatDate(customer.joinedDate)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Last Login:</span>
                  <span className="ml-2">{formatDate(customer.lastLoginDate)}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium text-gray-500">Order History</h4>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold">{customer.totalOrders}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold">{formatCurrency(customer.totalSpent)}</p>
              </div>
            </div>
          </div>

          {customer.notes && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium text-gray-500">Notes</h4>
                <p className="mt-2 text-gray-700">{customer.notes}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailsDialog;
