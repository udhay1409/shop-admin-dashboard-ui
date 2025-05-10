
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Store, Search, UserPlus, RefreshCcw, Upload, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CustomerList } from '@/components/contacts/CustomerList';
import { VendorList } from '@/components/contacts/VendorList';

const Contact = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact Management</h1>
          <p className="text-muted-foreground">
            Manage your customers and vendors in one place.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/customers/new')}
            className="flex items-center gap-1"
          >
            <UserPlus size={16} />
            New Customer
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/vendors/new')}
            className="flex items-center gap-1"
          >
            <Store size={16} />
            New Vendor
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Contact Directory</CardTitle>
          <CardDescription>
            View and manage all your business contacts in one place.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search contacts..." className="pl-8" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCcw size={16} className="mr-1" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download size={16} className="mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Upload size={16} className="mr-1" />
                Import
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="customers">
            <TabsList className="mb-4">
              <TabsTrigger value="customers" className="flex items-center gap-1">
                <User size={16} />
                Customers
              </TabsTrigger>
              <TabsTrigger value="vendors" className="flex items-center gap-1">
                <Store size={16} />
                Vendors
              </TabsTrigger>
            </TabsList>
            <TabsContent value="customers">
              <CustomerList />
            </TabsContent>
            <TabsContent value="vendors">
              <VendorList />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contact;
