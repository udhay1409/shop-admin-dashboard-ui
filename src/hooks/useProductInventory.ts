
import { useState, useEffect } from 'react';
import { productInventoryService, WarehouseLocation, ProductInventoryItem } from '@/services/productInventoryService';
import { Product } from '@/types/product';

export default function useProductInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<WarehouseLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // Get initial data
    setProducts(productInventoryService.getProducts());
    setLocations(productInventoryService.getLocations());
    setLoading(false);
    
    // Subscribe to changes
    const unsubscribe = productInventoryService.subscribe(() => {
      setProducts([...productInventoryService.getProducts()]);
      setLocations([...productInventoryService.getLocations()]);
    });
    
    return unsubscribe;
  }, []);

  const getProductById = (id: string) => productInventoryService.getProductById(id);
  
  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    return productInventoryService.addProduct(product);
  };
  
  const updateProduct = (id: string, updates: Partial<Product>) => {
    return productInventoryService.updateProduct(id, updates);
  };
  
  const deleteProduct = (id: string) => {
    return productInventoryService.deleteProduct(id);
  };
  
  const getProductInventory = (productId: string) => {
    return productInventoryService.getProductInventory(productId);
  };
  
  const getAllInventory = () => {
    return productInventoryService.getAllInventory();
  };
  
  const updateProductStock = (productId: string, locationId: string, quantity: number) => {
    productInventoryService.updateProductStock(productId, locationId, quantity);
  };

  return {
    products,
    locations,
    loading,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductInventory,
    getAllInventory,
    updateProductStock,
  };
}
