
import React from 'react';
import { 
  Building, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  ShoppingCart,
  CalendarDays
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

interface PurchaseBill {
  id: string;
  vendorId: string;
  billDate: string;
  amount: string;
  status: string;
}

interface VendorDetailsProps {
  vendor: Vendor;
  purchaseHistory: PurchaseBill[];
}

const VendorDetails = ({ vendor, purchaseHistory }: VendorDetailsProps) => {
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
              <span className={`px-2 py-1 rounded-full text-xs ${
                vendor.status === 'Active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {vendor.status}
              </span>
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
        
        {purchaseHistory.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseHistory.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium">{bill.id}</TableCell>
                  <TableCell className="flex items-center gap-1">
                    <CalendarDays className="h-3 w-3 text-gray-400" />
                    {bill.billDate}
                  </TableCell>
                  <TableCell>{bill.amount}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      bill.status === 'Paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {bill.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
