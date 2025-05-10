
import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Filter, ArrowUpDown } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import useProductInventory from '@/hooks/useProductInventory';
import { WarehouseLocation, ProductInventoryItem } from '@/services/productInventoryService';
import { StockUpdateDialog } from '@/components/inventory/StockUpdateDialog';
import { Badge } from '@/components/ui/badge';

const Inventory = () => {
  const { toast } = useToast();
  const { 
    products, 
    locations, 
    getAllInventory, 
    updateProductStock, 
    findProductById,
    loading,
    refreshInventory
  } = useProductInventory();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [currentStock, setCurrentStock] = useState(0);
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<ProductInventoryItem[]>([]);
  
  useEffect(() => {
    const loadInventory = async () => {
      const items = await getAllInventory();
      setInventoryItems(items);
    };
    
    loadInventory();
  }, [getAllInventory]);
  
  // Calculate low stock items
  const lowStockItems = inventoryItems.filter(
    item => item.quantity <= item.lowStockThreshold
  );

  // Filter inventory items based on search term
  const filteredInventory = inventoryItems.filter(item => 
    item.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.product?.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.product?.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter locations based on search term
  const filteredLocations = locations.filter(location => 
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open stock update dialog
  const handleUpdateStock = (productId: string, locationId: string, currentQty: number) => {
    setSelectedProductId(productId);
    setSelectedLocationId(locationId);
    setCurrentStock(currentQty);
    setStockDialogOpen(true);
  };
  
  // Handle stock update
  const handleStockUpdate = async (quantity: number) => {
    setIsUpdatingStock(true);
    
    try {
      const success = await updateProductStock(selectedProductId, selectedLocationId, quantity);
      
      if (success) {
        toast({
          title: "Stock updated",
          description: "Product inventory has been updated successfully."
        });
        
        // Refresh inventory data
        const items = await refreshInventory();
        setInventoryItems(items || []);
        
        setStockDialogOpen(false);
      } else {
        throw new Error("Failed to update stock");
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: "Error",
        description: "Failed to update stock. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingStock(false);
    }
  };

  // Get product name for dialog
  const selectedProductName = selectedProductId 
    ? (findProductById(selectedProductId)?.name || 'Product')
    : 'Product';
    
  if (loading) {
    return <div className="p-6 text-center">Loading inventory data...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <Button onClick={() => window.location.href = '/products'}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Manage Products
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
              <p className="text-3xl font-bold text-[#EC008C]">{products.length}</p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Low Stock Items</p>
              <p className="text-3xl font-bold text-amber-500">{lowStockItems.length}</p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Warehouse Locations</p>
              <p className="text-3xl font-bold text-blue-500">{locations.length}</p>
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
            <TabsTrigger value="products">Inventory by Product</TabsTrigger>
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
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">
                      <div className="flex items-center justify-end">
                        In Stock
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No inventory items found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInventory.map((item) => {
                      const location = locations.find(loc => loc.id === item.locationId);
                      return (
                        <TableRow key={`${item.productId}-${item.locationId}`}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded overflow-hidden border bg-gray-50">
                                {item.product?.image ? (
                                  <img 
                                    src={item.product.image} 
                                    alt={item.product.name} 
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full bg-gray-200"></div>
                                )}
                              </div>
                              {item.product?.name}
                            </div>
                          </TableCell>
                          <TableCell>{item.product?.sku || 'N/A'}</TableCell>
                          <TableCell>{item.product?.category || 'N/A'}</TableCell>
                          <TableCell>{location?.name || 'Unknown'}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                item.quantity <= item.lowStockThreshold 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {item.quantity}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(item.lastRestocked).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleUpdateStock(item.productId, item.locationId, item.quantity)}
                            >
                              Update Stock
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLocations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No locations found.
                      </TableCell>
                    </TableRow>
                  ) : filteredLocations.map((location) => {
                    // Calculate actual values based on inventory data
                    const locationItems = inventoryItems.filter(item => item.locationId === location.id);
                    const locationLowStock = locationItems.filter(item => item.quantity <= item.lowStockThreshold);
                    const totalQuantity = locationItems.reduce((sum, item) => sum + item.quantity, 0);
                    
                    return (
                      <TableRow key={location.id}>
                        <TableCell className="font-medium">{location.name}</TableCell>
                        <TableCell>{location.address}</TableCell>
                        <TableCell>{totalQuantity}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            locationLowStock.length > 5
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {locationLowStock.length}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stock Update Dialog */}
      <StockUpdateDialog
        isOpen={stockDialogOpen}
        onClose={() => setStockDialogOpen(false)}
        productId={selectedProductId}
        productName={selectedProductName}
        locationId={selectedLocationId}
        currentStock={currentStock}
        onUpdate={handleStockUpdate}
        isUpdating={isUpdatingStock}
      />
    </div>
  );
};

export default Inventory;
