
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";

// Define types for our inventory management
export interface WarehouseLocation {
  id: string;
  name: string;
  address: string;
  is_active?: boolean;
}

export interface ProductInventoryItem {
  id: string;
  productId: string;
  locationId: string;
  quantity: number;
  variantId?: string;
  lowStockThreshold: number;
  lastRestocked: string;
  product?: Product;
}

class ProductInventoryService {
  // Get all warehouse locations
  async getLocations(): Promise<WarehouseLocation[]> {
    try {
      const { data, error } = await supabase
        .from('warehouse_locations')
        .select('*')
        .order('name');
        
      if (error) {
        console.error("Error fetching warehouse locations:", error);
        throw error;
      }
      
      return data.map(location => ({
        id: location.id,
        name: location.name,
        address: location.address?.address || '',
        is_active: location.is_active
      }));
    } catch (error) {
      console.error("Failed to get warehouse locations:", error);
      throw error;
    }
  }
  
  // Get inventory for a specific product across all locations
  async getProductInventory(productId: string): Promise<ProductInventoryItem[]> {
    try {
      const { data, error } = await supabase
        .from('product_inventory')
        .select(`
          id,
          product_id,
          location_id,
          variant_id,
          quantity,
          warehouse_locations(name)
        `)
        .eq('product_id', productId);
        
      if (error) {
        console.error("Error fetching product inventory:", error);
        throw error;
      }
      
      // Process and format the inventory data
      return data.map(item => {
        const lowStockThreshold = Math.max(5, Math.floor(item.quantity * 0.2)); // Default 20% of quantity or 5
        
        return {
          id: item.id,
          productId: item.product_id,
          locationId: item.location_id,
          quantity: item.quantity,
          variantId: item.variant_id,
          lowStockThreshold,
          lastRestocked: new Date().toISOString().split('T')[0], // Default to today, will be updated with actual data
          locationName: item.warehouse_locations?.name
        };
      });
    } catch (error) {
      console.error("Failed to get product inventory:", error);
      return [];
    }
  }
  
  // Get all inventory items with their associated products
  async getAllInventory(): Promise<ProductInventoryItem[]> {
    try {
      const { data, error } = await supabase
        .from('product_inventory')
        .select(`
          id,
          product_id,
          location_id,
          variant_id,
          quantity,
          warehouse_locations(name),
          products(
            id,
            name,
            price,
            stock,
            status,
            image_url,
            sku,
            categories(name)
          )
        `);
        
      if (error) {
        console.error("Error fetching inventory:", error);
        throw error;
      }
      
      // Process and format the inventory data
      return data.map(item => {
        const lowStockThreshold = Math.max(5, Math.floor(item.quantity * 0.2)); // Default 20% of quantity or 5
        
        return {
          id: item.id,
          productId: item.product_id,
          locationId: item.location_id,
          quantity: item.quantity,
          variantId: item.variant_id,
          lowStockThreshold,
          lastRestocked: new Date().toISOString().split('T')[0],
          product: item.products ? {
            id: item.products.id,
            name: item.products.name,
            price: Number(item.products.price),
            stock: item.products.stock,
            status: item.products.status,
            category: item.products.categories?.name || 'Uncategorized',
            image: item.products.image_url,
            sku: item.products.sku,
            createdAt: '',  // These will be filled if needed
            updatedAt: ''
          } : undefined,
          locationName: item.warehouse_locations?.name
        };
      });
    } catch (error) {
      console.error("Failed to get all inventory:", error);
      return [];
    }
  }
  
  // Update product stock in a specific location
  async updateProductStock(productId: string, locationId: string, quantity: number): Promise<void> {
    try {
      // Check if the inventory record already exists
      const { data: existingData } = await supabase
        .from('product_inventory')
        .select('id')
        .eq('product_id', productId)
        .eq('location_id', locationId)
        .maybeSingle();
      
      if (existingData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('product_inventory')
          .update({
            quantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id);
          
        if (updateError) throw updateError;
      } else {
        // Create new inventory record
        const { error: insertError } = await supabase
          .from('product_inventory')
          .insert({
            product_id: productId,
            location_id: locationId,
            quantity
          });
          
        if (insertError) throw insertError;
      }
      
      // Record the transaction
      const { error: transactionError } = await supabase
        .from('inventory_transactions')
        .insert({
          product_id: productId,
          quantity,
          type: 'adjustment',
          created_by: (await supabase.auth.getUser()).data.user?.id || ''
        });
      
      if (transactionError) {
        console.error("Error recording inventory transaction:", transactionError);
      }
      
      // Update the total stock in the product itself
      await this.updateProductTotalStock(productId);
    } catch (error) {
      console.error("Error updating product stock:", error);
      throw error;
    }
  }
  
  // Update the total stock in the products table based on inventory
  async updateProductTotalStock(productId: string): Promise<void> {
    try {
      // Calculate total stock across all locations
      const { data, error } = await supabase
        .from('product_inventory')
        .select('quantity')
        .eq('product_id', productId);
        
      if (error) throw error;
      
      const totalStock = data.reduce((sum, item) => sum + item.quantity, 0);
      
      // Update the product record
      const { error: updateError } = await supabase
        .from('products')
        .update({
          stock: totalStock,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId);
        
      if (updateError) throw updateError;
    } catch (error) {
      console.error("Failed to update product total stock:", error);
      throw error;
    }
  }
}

// Create a singleton instance
export const productInventoryService = new ProductInventoryService();
