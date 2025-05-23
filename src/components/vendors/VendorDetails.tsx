
import React, { useEffect, useState } from 'react';
import { 
  Building, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  ShoppingCart,
  CalendarDays,
  CreditCard,
  FileText,
  Clock
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { PurchaseBill, getVendorPurchaseBills, formatAmount } from '@/services/purchaseBillService';

interface Vendor {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  totalPurchases: string;
}

interface VendorDetailsProps {
  vendor: Vendor;
  onViewBillDetails?: (bill: PurchaseBill) => void;
}

const VendorDetails = ({ vendor, onViewBillDetails }: VendorDetailsProps) => {
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseBill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      setLoading(true);
      if (vendor && vendor.id) {
        const bills = await getVendorPurchaseBills(vendor.id);
        setPurchaseHistory(bills);
      }
      setLoading(false);
    };

    fetchPurchaseHistory();
  }, [vendor]);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-[#EC008C]" />
                <h3 className="text-xl font-semibold">{vendor.name}</h3>
              </div>
              <Badge variant={vendor.status === 'Active' ? 'default' : 'secondary'}>
                {vendor.status}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Purchases</p>
              <p className="text-xl font-semibold text-[#EC008C]">{vendor.totalPurchases}</p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Contact Person</p>
                <p>{vendor.contact}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{vendor.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p>{vendor.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-sm">{vendor.address}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Purchase History
          </h3>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#EC008C] border-t-transparent"></div>
          </div>
        ) : purchaseHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bill ID</TableHead>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchaseHistory.map((bill) => (
                  <TableRow key={bill.id}>
                    <TableCell className="font-medium">{bill.id.slice(0, 8)}</TableCell>
                    <TableCell>{bill.invoice_number || 'N/A'}</TableCell>
                    <TableCell className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3 text-gray-400" />
                      {new Date(bill.bill_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{formatAmount(bill.amount)}</TableCell>
                    <TableCell>
                      <Badge variant={bill.status === 'Paid' ? 'success' : 'warning'}>
                        {bill.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">
                          {bill.payment_method || 'N/A'}
                        </span>
                        {bill.payment_date && (
                          <span className="text-xs flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(bill.payment_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {bill.delivery_date ? (
                        <span className="text-xs flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(bill.delivery_date).toLocaleDateString()}
                        </span>
                      ) : (
                        'Pending'
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewBillDetails && onViewBillDetails(bill)}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 border rounded-md">
            <p className="text-gray-500">No purchase history found for this vendor.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDetails;
