
import React, { useState } from 'react';
import { Search, PlusCircle, Filter, MoreHorizontal, Trash, Edit, ArrowUpDown } from 'lucide-react';
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Mock inventory data
const mockInventory = [
  {
    id: '1',
    name: 'Summer Dress',
    sku: 'SD-2025-001',
    category: 'Dresses',
    inStock: 45,
    lowStockThreshold: 10,
    costPrice: '$35.00',
    sellingPrice: '$89.99',
    lastRestocked: '2025-05-01',
  },
  {
    id: '2',
    name: 'Designer Jeans',
    sku: 'DJ-2025-002',
    category: 'Bottoms',
    inStock: 32,
    lowStockThreshold: 15,
    costPrice: '$45.00',
    sellingPrice: '$120.00',
    lastRestocked: '2025-04-27',
  },
  {
    id: '3',
    name: 'Casual T-Shirt',
    sku: 'CT-2025-003',
    category: 'Tops',
    inStock: 78,
    lowStockThreshold: 20,
    costPrice: '$12.50',
    sellingPrice: '$29.99',
    lastRestocked: '2025-05-03',
  },
  {
    id: '4',
    name: 'Leather Belt',
    sku: 'LB-2025-004',
    category: 'Accessories',
    inStock: 25,
    lowStockThreshold: 10,
    costPrice: '$15.00',
    sellingPrice: '$39.99',
    lastRestocked: '2025-04-20',
  },
  {
    id: '5',
    name: 'Designer Handbag',
    sku: 'DH-2025-005',
    category: 'Accessories',
    inStock: 8,
    lowStockThreshold: 10,
    costPrice: '$150.00',
    sellingPrice: '$350.00',
    lastRestocked: '2025-04-15',
  },
  {
    id: '6',
    name: 'Winter Jacket',
    sku: 'WJ-2025-006',
    category: 'Outerwear',
    inStock: 18,
    lowStockThreshold: 12,
    costPrice: '$85.00',
    sellingPrice: '$189.99',
    lastRestocked: '2025-03-30',
  }
];

// Mock warehouse locations
const mockLocations = [
  {
    id: '1',
    name: 'Main Warehouse',
    address: '123 Warehouse St, New York, NY 10001',
    totalItems: 4500,
    itemsLowStock: 42,
  },
  {
    id: '2',
    name: 'East Coast Distribution',
    address: '456 East Ave, Boston, MA 02108',
    totalItems: 3200,
    itemsLowStock: 28,
  },
  {
    id: '3',
    name: 'West Coast Center',
    address: '789 Pacific Rd, Los Angeles, CA 90012',
    totalItems: 2800,
    itemsLowStock: 35,
  }
];

const Inventory = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('products');

  // Filter inventory based on search term
  const filteredInventory = mockInventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter locations based on search term
  const filteredLocations = mockLocations.filter(location => 
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get low stock items
  const lowStockItems = mockInventory.filter(item => item.inStock <= item.lowStockThreshold);

  const handleDeleteItem = (itemId: string) => {
    toast({
      title: "Item removed",
      description: `Item ID: ${itemId} has been removed from inventory.`
    });
  };
  
  const handleDeleteLocation = (locationId: string) => {
    toast({
      title: "Location removed",
      description: `Location ID: ${locationId} has been removed.`
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Item
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Overview</CardTitle>
              <CardDescription>Inventory statistics and alerts</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-3xl font-bold text-[#EC008C]">{mockInventory.length}</p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Low Stock Items</p>
              <p className="text-3xl font-bold text-amber-500">{lowStockItems.length}</p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Warehouse Locations</p>
              <p className="text-3xl font-bold text-blue-500">{mockLocations.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="locations">Warehouse Locations</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder={`Search ${activeTab}...`}
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

        <TabsContent value="products" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">
                      <div className="flex items-center">
                        Product
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">
                      <div className="flex items-center justify-end">
                        In Stock
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Cost Price</TableHead>
                    <TableHead>Selling Price</TableHead>
                    <TableHead>Last Restocked</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.inStock <= item.lowStockThreshold 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {item.inStock}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{item.costPrice}</TableCell>
                      <TableCell>{item.sellingPrice}</TableCell>
                      <TableCell>{item.lastRestocked}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              Update Stock
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteItem(item.id)}>
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

        <TabsContent value="locations" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Total Items</TableHead>
                    <TableHead>Items Low in Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLocations.map((location) => (
                    <TableRow key={location.id}>
                      <TableCell className="font-medium">{location.name}</TableCell>
                      <TableCell>{location.address}</TableCell>
                      <TableCell>{location.totalItems}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          location.itemsLowStock > 30 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {location.itemsLowStock}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              View Inventory
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteLocation(location.id)}>
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
    </div>
  );
};

export default Inventory;
