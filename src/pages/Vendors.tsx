import React, { useState } from 'react';
import { PlusCircle, Search, FileText, MoreHorizontal, Download, Trash, Filter, ListFilter, ArrowLeftRight, FileBarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VendorForm from '@/components/vendors/VendorForm';
import PurchaseBillForm from '@/components/vendors/PurchaseBillForm';
import VendorDetails from '@/components/vendors/VendorDetails';
import { Badge } from '@/components/ui/badge';

// Mock data for vendors
const mockVendors = [
  { 
    id: '1', 
    name: 'Fashion Wholesaler Inc.', 
    contact: 'John Smith', 
    email: 'john@fashionwholesaler.com', 
    phone: '(555) 123-4567',
    address: '123 Supplier St, New York, NY 10001',
    status: 'Active',
    totalPurchases: '$24,500.00'
  },
  { 
    id: '2', 
    name: 'Textile Materials Ltd', 
    contact: 'Emma Johnson', 
    email: 'emma@textilematerials.com', 
    phone: '(555) 234-5678',
    address: '456 Fabric Ave, Los Angeles, CA 90012',
    status: 'Active',
    totalPurchases: '$18,750.00'
  },
  { 
    id: '3', 
    name: 'Accessory Suppliers Co', 
    contact: 'Michael Brown', 
    email: 'michael@accessorysuppliers.com', 
    phone: '(555) 345-6789',
    address: '789 Button Blvd, Chicago, IL 60601',
    status: 'Inactive',
    totalPurchases: '$9,320.00'
  },
  { 
    id: '4', 
    name: 'Global Fashion Imports', 
    contact: 'Sarah Davis', 
    email: 'sarah@globalfashion.com', 
    phone: '(555) 456-7890',
    address: '101 Import Road, Miami, FL 33101',
    status: 'Active',
    totalPurchases: '$31,280.00'
  },
];

// Mock data for purchase bills with expanded information
const mockPurchaseBills = [
  { 
    id: 'PB001', 
    vendorId: '1', 
    vendorName: 'Fashion Wholesaler Inc.', 
    billDate: '2025-04-28', 
    amount: '$5,250.00',
    status: 'Paid',
    paymentDate: '2025-05-02',
    paymentMethod: 'Bank Transfer',
    invoiceNumber: 'INV-2025-001',
    deliveryDate: '2025-05-05',
    items: [
      { name: 'Summer Dresses', quantity: 50, price: '$45.00', total: '$2,250.00' },
      { name: 'Designer Jeans', quantity: 30, price: '$100.00', total: '$3,000.00' }
    ]
  },
  { 
    id: 'PB002', 
    vendorId: '2', 
    vendorName: 'Textile Materials Ltd', 
    billDate: '2025-04-20', 
    amount: '$3,750.00',
    status: 'Pending',
    paymentMethod: 'Credit Card',
    invoiceNumber: 'INV-2025-002',
    items: [
      { name: 'Cotton Fabric', quantity: 500, price: '$5.00', total: '$2,500.00' },
      { name: 'Silk Material', quantity: 50, price: '$25.00', total: '$1,250.00' }
    ]
  },
  { 
    id: 'PB003', 
    vendorId: '4', 
    vendorName: 'Global Fashion Imports', 
    billDate: '2025-05-01', 
    amount: '$8,400.00',
    status: 'Paid',
    paymentDate: '2025-05-05',
    paymentMethod: 'Wire Transfer',
    invoiceNumber: 'INV-2025-003',
    deliveryDate: '2025-05-10',
    items: [
      { name: 'Designer Handbags', quantity: 20, price: '$320.00', total: '$6,400.00' },
      { name: 'Fashion Belts', quantity: 100, price: '$20.00', total: '$2,000.00' }
    ]
  },
  { 
    id: 'PB004', 
    vendorId: '1', 
    vendorName: 'Fashion Wholesaler Inc.', 
    billDate: '2025-05-15', 
    amount: '$7,800.00',
    status: 'Pending',
    paymentMethod: 'Check',
    invoiceNumber: 'INV-2025-004',
    items: [
      { name: 'Winter Jackets', quantity: 30, price: '$150.00', total: '$4,500.00' },
      { name: 'Cashmere Sweaters', quantity: 20, price: '$165.00', total: '$3,300.00' }
    ]
  },
];

const Vendors = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isVendorDialogOpen, setIsVendorDialogOpen] = useState(false);
  const [isPurchaseBillDialogOpen, setIsPurchaseBillDialogOpen] = useState(false);
  const [isVendorDetailsOpen, setIsVendorDetailsOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null);
  const [activeTab, setActiveTab] = useState('vendors');
  const [selectedVendorFilter, setSelectedVendorFilter] = useState('all');

  const filteredVendors = mockVendors.filter(vendor => 
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBills = mockPurchaseBills.filter(bill => {
    // First apply search term filter
    const matchesSearch = 
      bill.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bill.invoiceNumber && bill.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Then apply vendor filter if not set to 'all'
    if (selectedVendorFilter !== 'all') {
      return matchesSearch && bill.vendorId === selectedVendorFilter;
    }
    
    return matchesSearch;
  });

  const handleOpenVendorDetails = (vendor) => {
    setSelectedVendor(vendor);
    setIsVendorDetailsOpen(true);
  };

  const handleViewVendorBills = (vendorId) => {
    setActiveTab('bills');
    setSelectedVendorFilter(vendorId);
  };

  const handleDeleteVendor = (vendorId) => {
    // In a real app, you'd delete the vendor from your database
    toast({
      title: "Vendor deleted",
      description: `Vendor ID: ${vendorId} has been deleted.`,
    });
  };

  const handleDeleteBill = (billId) => {
    // In a real app, you'd delete the bill from your database
    toast({
      title: "Purchase Bill deleted",
      description: `Bill ID: ${billId} has been deleted.`,
    });
  };

  const handleViewBillDetails = (bill) => {
    setSelectedBill(bill);
  };

  return (
    <div className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="bills">Purchase Bills</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => activeTab === 'vendors' 
                ? setIsVendorDialogOpen(true) 
                : setIsPurchaseBillDialogOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              {activeTab === 'vendors' ? 'Add Vendor' : 'Add Purchase Bill'}
            </Button>
          </div>
        </div>

        <TabsContent value="vendors" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Vendor List</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search vendors..."
                      className="pl-10 w-[250px]" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Purchases</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="font-medium">{vendor.name}</TableCell>
                      <TableCell>{vendor.contact}</TableCell>
                      <TableCell>{vendor.email}</TableCell>
                      <TableCell>{vendor.phone}</TableCell>
                      <TableCell>
                        <Badge variant={vendor.status === 'Active' ? 'default' : 'secondary'}>
                          {vendor.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{vendor.totalPurchases}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewVendorBills(vendor.id)}
                          >
                            <FileBarChart className="h-4 w-4 mr-1" />
                            Bills
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOpenVendorDetails(vendor)}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteVendor(vendor.id)}>
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bills">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <CardTitle>Purchase Bills</CardTitle>
                  {selectedVendorFilter !== 'all' && (
                    <div className="flex items-center">
                      <Badge className="mr-2">
                        For: {mockVendors.find(v => v.id === selectedVendorFilter)?.name}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2"
                        onClick={() => setSelectedVendorFilter('all')}
                      >
                        <ArrowLeftRight className="h-3 w-3 mr-1" />
                        Show All
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search bills..."
                      className="pl-10 w-[250px]" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <ListFilter className="h-4 w-4 mr-2" />
                        Filter by Vendor
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuItem onClick={() => setSelectedVendorFilter('all')}>
                        All Vendors
                      </DropdownMenuItem>
                      {mockVendors.map(vendor => (
                        <DropdownMenuItem 
                          key={vendor.id} 
                          onClick={() => setSelectedVendorFilter(vendor.id)}
                        >
                          {vendor.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bill ID</TableHead>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBills.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell className="font-medium">{bill.id}</TableCell>
                      <TableCell>{bill.invoiceNumber || 'N/A'}</TableCell>
                      <TableCell>{bill.vendorName}</TableCell>
                      <TableCell>{bill.billDate}</TableCell>
                      <TableCell>{bill.amount}</TableCell>
                      <TableCell>
                        <Badge variant={bill.status === 'Paid' ? 'success' : 'warning'}>
                          {bill.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewBillDetails(bill)}>
                              <FileText className="mr-2 h-4 w-4" />
                              View Bill
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteBill(bill.id)}>
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Vendor Dialog */}
      <Dialog open={isVendorDialogOpen} onOpenChange={setIsVendorDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Vendor</DialogTitle>
            <DialogDescription>
              Enter the vendor details below to add a new vendor.
            </DialogDescription>
          </DialogHeader>
          <VendorForm 
            onSuccess={() => {
              setIsVendorDialogOpen(false);
              toast({
                title: "Vendor added",
                description: "New vendor has been added successfully."
              });
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Add Purchase Bill Dialog */}
      <Dialog open={isPurchaseBillDialogOpen} onOpenChange={setIsPurchaseBillDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Purchase Bill</DialogTitle>
            <DialogDescription>
              Enter the bill details to record a new purchase from a vendor.
            </DialogDescription>
          </DialogHeader>
          <PurchaseBillForm 
            vendors={mockVendors}
            onSuccess={() => {
              setIsPurchaseBillDialogOpen(false);
              toast({
                title: "Purchase bill added",
                description: "New purchase bill has been recorded successfully."
              });
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Vendor Details Dialog */}
      <Dialog open={isVendorDetailsOpen} onOpenChange={setIsVendorDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Vendor Details</DialogTitle>
          </DialogHeader>
          {selectedVendor && (
            <VendorDetails 
              vendor={selectedVendor} 
              purchaseHistory={mockPurchaseBills.filter(bill => bill.vendorId === selectedVendor.id)}
              onViewBillDetails={handleViewBillDetails}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Bill Dialog */}
      <Dialog open={selectedBill !== null} onOpenChange={() => setSelectedBill(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Purchase Bill Details</DialogTitle>
          </DialogHeader>
          {selectedBill && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Bill ID</p>
                  <p>{selectedBill.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Vendor</p>
                  <p>{selectedBill.vendorName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Invoice Number</p>
                  <p>{selectedBill.invoiceNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Bill Date</p>
                  <p>{selectedBill.billDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="flex items-center gap-2">
                    <Badge variant={selectedBill.status === 'Paid' ? 'success' : 'warning'}>
                      {selectedBill.status}
                    </Badge>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Amount</p>
                  <p className="font-semibold">{selectedBill.amount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Payment Method</p>
                  <p>{selectedBill.paymentMethod || 'N/A'}</p>
                </div>
                {selectedBill.paymentDate && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Date</p>
                    <p>{selectedBill.paymentDate}</p>
                  </div>
                )}
                {selectedBill.deliveryDate && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Delivery Date</p>
                    <p>{selectedBill.deliveryDate}</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-medium mb-2">Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedBill.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.price}</TableCell>
                        <TableCell className="text-right">{item.total}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setSelectedBill(null)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Vendors;
