
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Store, Eye, MoreHorizontal, Phone, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Vendor, getVendors } from '@/services/vendorService';

export const VendorList = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const data = await getVendors();
        setVendors(data);
      } catch (error: any) {
        console.error('Error fetching vendors:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to load vendors',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [toast]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Inactive':
        return 'secondary';
      case 'On Hold':
        return 'warning';
      default:
        return 'outline';
    }
  };

  const handleViewVendor = (id: string) => {
    navigate(`/vendors/${id}`);
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#EC008C] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      {vendors.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Store size={48} className="text-gray-300 mb-2" />
          <h3 className="text-lg font-medium">No vendors found</h3>
          <p className="text-muted-foreground">
            Add your first vendor to get started.
          </p>
          <Button 
            className="mt-4"
            onClick={() => navigate('/vendors/new')}
          >
            Add Vendor
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell className="font-medium">{vendor.name}</TableCell>
                <TableCell>{vendor.contact_name || 'N/A'}</TableCell>
                <TableCell>{vendor.email || 'N/A'}</TableCell>
                <TableCell>{vendor.phone || 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(vendor.status) as any}>
                    {vendor.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal size={16} />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleViewVendor(vendor.id)}>
                        <Eye size={14} className="mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {vendor.phone && (
                        <DropdownMenuItem onClick={() => handleCall(vendor.phone!)}>
                          <Phone size={14} className="mr-2" />
                          Call
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate(`/purchase-orders?vendor=${vendor.id}`)}>
                        <FileText size={14} className="mr-2" />
                        View Purchase Orders
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
