
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/product';
import * as productService from '@/services/productService';
import { WarehouseLocation } from '@/services/productInventoryService';

export default function useProductInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<WarehouseLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const fetchedProducts = await productService.getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    
    // Fetch warehouse locations (will be implemented properly with Supabase later)
    const fetchLocations = async () => {
      try {
        // In a real application, this would be a call to the API
        // For now using mock data
        setLocations([
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
        ]);
      } catch (error) {
        console.error('Error fetching warehouse locations:', error);
      }
    };
    
    fetchLocations();
  }, [toast]);

  const getProductById = async (id: string): Promise<Product | null> => {
    try {
      return await productService.getProductById(id);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: 'Error',
        description: 'Failed to load product details.',
        variant: 'destructive',
      });
      return null;
    }
  };
  
  const findProductById = (id: string): Product | undefined => {
    return products.find(product => product.id === id);
  };
  
  const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newProduct = await productService.createProduct(product);
      setProducts(prev => [...prev, newProduct]);
      toast({
        title: 'Success',
        description: 'Product created successfully',
      });
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: 'Error',
        description: 'Failed to create product.',
        variant: 'destructive',
      });
      throw error;
    }
  };
  
  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const updatedProduct = await productService.updateProduct(id, updates);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product.',
        variant: 'destructive',
      });
      throw error;
    }
  };
  
  const deleteProduct = async (id: string) => {
    try {
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product.',
        variant: 'destructive',
      });
      return false;
    }
  };
  
  // Simplified inventory methods - to be completed when implementing inventory management
  const getProductStock = async (productId: string, locationId?: string) => {
    try {
      // This would call a real API in a production environment
      // For now, return the stock from the product object
      const product = findProductById(productId);
      return product?.stock || 0;
    } catch (error) {
      console.error('Error fetching product stock:', error);
      return 0;
    }
  };
  
  const updateStock = async (productId: string, newQuantity: number, locationId?: string) => {
    try {
      const updatedProduct = await productService.updateProduct(productId, { stock: newQuantity });
      setProducts(prev => prev.map(p => p.id === productId ? updatedProduct : p));
      return true;
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product stock.',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    products,
    locations,
    loading,
    getProductById,
    findProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductStock,
    updateStock,
    refreshProducts: fetchProducts
  };
}
