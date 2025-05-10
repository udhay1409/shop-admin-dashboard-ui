
import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, Filter, ArrowUpDown, RefreshCw } from 'lucide-react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import ProductDialog from '@/components/products/ProductDialog';
import DeleteProductDialog from '@/components/products/DeleteProductDialog';
import { Product } from '@/types/product';
import useProductInventory from '@/hooks/useProductInventory';
import { useToast } from '@/hooks/use-toast';
import { getCategories } from '@/services/productService';
import { Skeleton } from '@/components/ui/skeleton';
import { useProductAttributes } from '@/hooks/useProductAttributes';
import { AttributeDisplay } from '@/components/products/AttributeDisplay';

const Products: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, loading, refreshProducts } = useProductInventory();
  const { setProductAttributes, getProductAttributes } = useProductAttributes();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [productAttributes, setProductAttributesState] = useState<Map<string, any[]>>(new Map());
  
  // Dialog states
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoryLoading(true);
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);
  
  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || 
      product.category === categoryFilter;
    
    const matchesStatus = statusFilter === 'all' || 
      product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Load product attributes for display in the table
  useEffect(() => {
    const loadProductAttributes = async () => {
      const attributesMap = new Map<string, any[]>();
      
      for (const product of products) {
        try {
          const attrs = await getProductAttributes(product.id);
          if (attrs.length > 0) {
            attributesMap.set(product.id, attrs);
          }
        } catch (error) {
          console.error(`Error loading attributes for product ${product.id}:`, error);
        }
      }
      
      setProductAttributesState(attributesMap);
    };
    
    if (products.length > 0) {
      loadProductAttributes();
    }
  }, [products, getProductAttributes]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshProducts();
      toast({
        title: "Refreshed",
        description: "Product list has been refreshed."
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle add new product
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsProductDialogOpen(true);
  };

  // Handle edit product
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsProductDialogOpen(true);
  };

  // Handle delete intent
  const handleDeleteIntent = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  // Handle save product (create or update) with attributes
  const handleSaveProduct = async (
    productData: Partial<Product>, 
    attributes?: Array<{ attributeId: string, values: string[] }>
  ) => {
    setIsSubmitting(true);
    
    try {
      if (selectedProduct) {
        // Update existing product
        const updatedProduct = await updateProduct(selectedProduct.id, productData);
        
        // Update attributes if provided
        if (attributes && attributes.length > 0) {
          await setProductAttributes(selectedProduct.id, attributes);
        }
        
        return updatedProduct;
      } else {
        // Create new product
        const newProduct = await addProduct({
          name: productData.name || 'Untitled Product',
          price: productData.price || 0,
          stock: productData.stock || 0,
          status: productData.status || 'Draft',
          category: productData.category || 'Uncategorized',
          image: productData.image,
          description: productData.description,
          sku: productData.sku,
          subcategory: productData.subcategory,
        });
        
        // Add attributes if provided
        if (attributes && attributes.length > 0 && newProduct) {
          await setProductAttributes(newProduct.id, attributes);
        }
        
        return newProduct;
      }
    } catch (error) {
      console.error('Error saving product:', error);
      // Toast is already handled in the hook
    } finally {
      setIsProductDialogOpen(false);
      setIsSubmitting(false);
    }
  };

  // Handle delete product
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    
    setIsDeleting(true);
    
    try {
      await deleteProduct(selectedProduct.id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting product:', error);
      // Toast is already handled in the hook
    } finally {
      setIsDeleting(false);
    }
  };

  // Extract unique categories from products for filter
  const categoryOptions = Array.from(new Set(products.map(product => product.category)));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" disabled={isRefreshing} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button onClick={handleAddProduct} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter} disabled={categoryLoading}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categoryOptions.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Product</TableHead>
              <TableHead className="w-[120px]">
                <div className="flex items-center gap-1">
                  Price
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Stock
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>Attributes</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-9 w-16" />
                      <Skeleton className="h-9 w-16" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {products.length === 0 ? 'No products found. Add some products to get started!' : 'No products match your filters.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded overflow-hidden border bg-gray-50">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500">
                            No img
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        {product.sku && (
                          <div className="text-xs text-muted-foreground">SKU: {product.sku}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    {productAttributes.has(product.id) && productAttributes.get(product.id)?.length > 0 ? (
                      <AttributeDisplay 
                        attributes={productAttributes.get(product.id) || []} 
                        showLabels={true}
                        className="max-w-[200px]"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">No attributes</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        product.status === "Active" 
                          ? "default" 
                          : product.status === "Draft"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditProduct(product)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteIntent(product)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Product Dialog */}
      <ProductDialog
        isOpen={isProductDialogOpen}
        onClose={() => setIsProductDialogOpen(false)}
        product={selectedProduct || undefined}
        onSubmit={handleSaveProduct}
        isSubmitting={isSubmitting}
        categories={categoryOptions}
      />
      
      {/* Delete Dialog */}
      <DeleteProductDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteProduct}
        isDeleting={isDeleting}
        productName={selectedProduct?.name}
      />
    </div>
  );
};

export default Products;
