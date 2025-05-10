
import React, { useState, useEffect } from 'react';
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { Vendor, getVendors, deleteVendor } from '@/services/vendorService';
import { PurchaseBill, getPurchaseBills, deletePurchaseBill, formatAmount } from '@/services/purchaseBillService';

// Interface to map Supabase Vendor to VendorDetails expected format
interface VendorDetailsProps {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  totalPurchases: string;
}

const Vendors = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isVendorDialogOpen, setIsVendorDialogOpen] = useState(false);
  const [isPurchaseBillDialogOpen, setIsPurchaseBillDialogOpen] = useState(false);
  const [isVendorDetailsOpen, setIsVendorDetailsOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<VendorDetailsProps | null>(null);
  const [selectedBill, setSelectedBill] = useState<PurchaseBill | null>(null);
  const [activeTab, setActiveTab] = useState('vendors');
  const [selectedVendorFilter, setSelectedVendorFilter] = useState('all');
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [purchaseBills, setPurchaseBills] = useState<PurchaseBill[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBills, setLoadingBills] = useState(true);
  
  // Fetch vendors from Supabase
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const data = await getVendors();
        setVendors(data);
      } catch (error) {
        console.error('Error fetching vendors:', error);
        toast({
          title: 'Error fetching vendors',
          description: 'Could not load vendors from the database.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [toast]);

  // Fetch purchase bills from Supabase
  useEffect(() => {
    const fetchPurchaseBills = async () => {
      try {
        setLoadingBills(true);
        const data = await getPurchaseBills();
        setPurchaseBills(data);
      } catch (error) {
        console.error('Error fetching purchase bills:', error);
      } finally {
        setLoadingBills(false);
      }
    };

    if (activeTab === 'bills') {
      fetchPurchaseBills();
    }
  }, [activeTab]);

  const filteredVendors = vendors.filter(vendor => 
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vendor.contact_name && vendor.contact_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (vendor.email && vendor.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredBills = purchaseBills.filter(bill => {
    // First apply search term filter
    const matchesSearch = 
      bill.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.vendor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bill.invoice_number && bill.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Then apply vendor filter if not set to 'all'
    if (selectedVendorFilter !== 'all') {
      return matchesSearch && bill.vendor_id === selectedVendorFilter;
    }
    
    return matchesSearch;
  });

  // Calculate total purchases for a vendor
  const calculateTotalPurchases = (vendorId: string): string => {
    const vendorBills = purchaseBills.filter(bill => bill.vendor_id === vendorId);
    const total = vendorBills.reduce((sum, bill) => sum + bill.amount, 0);
    return formatAmount(total);
  };

  // Transform database vendor to VendorDetails format
  const mapVendorToDetails = (vendor: Vendor): VendorDetailsProps => {
    const address = vendor.address 
      ? typeof vendor.address === 'string' 
        ? vendor.address 
        : `${vendor.address.street || ''} ${vendor.address.city || ''} ${vendor.address.state || ''} ${vendor.address.zip || ''}`
      : 'N/A';
    
    // Calculate total purchases for this vendor
    const totalPurchases = calculateTotalPurchases(vendor.id);
    
    return {
      id: vendor.id,
      name: vendor.name,
      contact: vendor.contact_name || 'N/A',
      email: vendor.email || 'N/A',
      phone: vendor.phone || 'N/A',
      address: address,
      status: vendor.status,
      totalPurchases: totalPurchases
    };
  };

  const handleOpenVendorDetails = (vendor: Vendor) => {
    setSelectedVendor(mapVendorToDetails(vendor));
    setIsVendorDetailsOpen(true);
  };

  const handleViewVendorBills = (vendorId: string) => {
    setActiveTab('bills');
    setSelectedVendorFilter(vendorId);
  };

  const handleDeleteVendor = async (vendorId: string) => {
    const success = await deleteVendor(vendorId);
    if (success) {
      // Remove the deleted vendor from the state
      setVendors(vendors.filter(vendor => vendor.id !== vendorId));
    }
  };

  const handleDeleteBill = async (billId: string) => {
    const success = await deletePurchaseBill(billId);
    if (success) {
      // Remove the deleted bill from the state
      setPurchaseBills(purchaseBills.filter(bill => bill.id !== billId));
    }
  };

  const handleViewBillDetails = (bill: PurchaseBill) => {
    setSelectedBill(bill);
  };

  const handlePurchaseBillSuccess = async () => {
    setIsPurchaseBillDialogOpen(false);
    toast({
      title: "Purchase bill added",
      description: "New purchase bill has been recorded successfully."
    });
    
    // Refresh bills list
    const data = await getPurchaseBills();
    setPurchaseBills(data);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#EC008C] border-t-transparent"></div>
      </div>
    );
  }

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
              {filteredVendors.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <p className="text-muted-foreground">No vendors found. Add your first vendor to get started.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVendors.map((vendor) => (
                      <TableRow key={vendor.id}>
                        <TableCell className="font-medium">{vendor.name}</TableCell>
                        <TableCell>{vendor.contact_name || 'N/A'}</TableCell>
                        <TableCell>{vendor.email || 'N/A'}</TableCell>
                        <TableCell>{vendor.phone || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant={vendor.status === 'Active' ? 'default' : 'secondary'}>
                            {vendor.status}
                          </Badge>
                        </TableCell>
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
              )}
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
                        For: {vendors.find(v => v.id === selectedVendorFilter)?.name || 'Unknown'}
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
                      {vendors.map(vendor => (
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
              {loadingBills ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#EC008C] border-t-transparent"></div>
                </div>
              ) : filteredBills.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <p className="text-muted-foreground">No purchase bills found. Add your first purchase bill to get started.</p>
                </div>
              ) : (
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
                        <TableCell className="font-medium">{bill.id.slice(0, 8)}</TableCell>
                        <TableCell>{bill.invoice_number || 'N/A'}</TableCell>
                        <TableCell>{bill.vendor?.name || 'Unknown'}</TableCell>
                        <TableCell>{new Date(bill.bill_date).toLocaleDateString()}</TableCell>
                        <TableCell>{formatAmount(bill.amount)}</TableCell>
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
              )}
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
              // Refresh vendors list after adding a new vendor
              getVendors().then(data => setVendors(data));
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
            vendors={vendors}
            onSuccess={handlePurchaseBillSuccess}
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
                  <p>{selectedBill.vendor?.name || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Invoice Number</p>
                  <p>{selectedBill.invoice_number || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Bill Date</p>
                  <p>{new Date(selectedBill.bill_date).toLocaleDateString()}</p>
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
                  <p className="font-semibold">{formatAmount(selectedBill.amount)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Payment Method</p>
                  <p>{selectedBill.payment_method || 'N/A'}</p>
                </div>
                {selectedBill.payment_date && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Date</p>
                    <p>{new Date(selectedBill.payment_date).toLocaleDateString()}</p>
                  </div>
                )}
                {selectedBill.delivery_date && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Delivery Date</p>
                    <p>{new Date(selectedBill.delivery_date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              {selectedBill.items && selectedBill.items.length > 0 ? (
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
                          <TableCell>{formatAmount(item.price)}</TableCell>
                          <TableCell className="text-right">{formatAmount(item.total)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 border rounded-md">
                  <p>No items information available for this bill.</p>
                </div>
              )}

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
