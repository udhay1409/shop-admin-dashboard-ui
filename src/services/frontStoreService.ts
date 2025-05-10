
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductStatus } from "@/types/product";
import { StoreSettings } from "@/services/settingsService";

// Get featured products for the store front
export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name)
    `)
    .eq('status', 'Active')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }

  // Convert database fields to our model
  return data.map(item => ({
    id: item.id,
    name: item.name,
    price: Number(item.price),
    stock: item.stock,
    status: item.status as ProductStatus,
    category: item.category?.name || 'Uncategorized',
    image: item.image_url,
    description: item.description || '',
    sku: item.sku || '',
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    originalPrice: item.original_price ? Number(item.original_price) : undefined,
    discountPercentage: item.discount_percentage ? Number(item.discount_percentage) : undefined,
    isNew: item.is_new,
    isSale: item.is_sale,
    trending: item.trending,
    hotSelling: item.hot_selling,
    subcategory: '',
    availableSizes: [],
    availableColors: [],
    bulkDiscountQuantity: 0,
    bulkDiscountPercentage: 0,
    additionalImages: []
  }));
}

// Get trending products for the store front
export async function getTrendingProducts(limit: number = 8): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name)
    `)
    .eq('status', 'Active')
    .eq('trending', true)
    .limit(limit);
  
  if (error) {
    console.error('Error fetching trending products:', error);
    throw error;
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    price: Number(item.price),
    stock: item.stock,
    status: item.status as ProductStatus,
    category: item.category?.name || 'Uncategorized',
    image: item.image_url,
    description: item.description || '',
    sku: item.sku || '',
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    originalPrice: item.original_price ? Number(item.original_price) : undefined,
    discountPercentage: item.discount_percentage ? Number(item.discount_percentage) : undefined,
    isNew: item.is_new,
    isSale: item.is_sale,
    trending: item.trending,
    hotSelling: item.hot_selling,
    subcategory: '',
    availableSizes: [],
    availableColors: [],
    bulkDiscountQuantity: 0,
    bulkDiscountPercentage: 0,
    additionalImages: []
  }));
}

// Helper function to convert JSON to StoreSettings
function convertToStoreSettings(jsonData: any): StoreSettings | null {
  if (!jsonData || typeof jsonData !== 'object' || Array.isArray(jsonData)) {
    return null;
  }

  // Check if the object has the required properties of StoreSettings
  if (
    typeof jsonData.storeName === 'string' &&
    typeof jsonData.storeUrl === 'string' &&
    typeof jsonData.contactEmail === 'string' &&
    typeof jsonData.contactPhone === 'string' &&
    typeof jsonData.businessType === 'string' &&
    typeof jsonData.storeOpen === 'boolean'
  ) {
    return {
      storeName: jsonData.storeName,
      storeUrl: jsonData.storeUrl,
      description: jsonData.description || undefined,
      contactEmail: jsonData.contactEmail,
      contactPhone: jsonData.contactPhone,
      businessType: jsonData.businessType,
      storeOpen: jsonData.storeOpen
    };
  }

  // If we get here, the JSON doesn't match our StoreSettings structure
  console.warn('JSON data does not match StoreSettings structure:', jsonData);
  return null;
}

// Get full store settings directly from the database
export async function getStoreFrontSettings(): Promise<StoreSettings | null> {
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user) {
    // For public frontend, get default settings or first admin settings
    const { data, error } = await supabase
      .from('profiles_settings')
      .select('store_settings')
      .limit(1)
      .single();
    
    if (error) {
      console.error('Error fetching store settings:', error);
      return null;
    }

    // Use the helper function to safely convert JSON to StoreSettings
    return convertToStoreSettings(data?.store_settings);
  }
  
  // For authenticated users, get their settings
  const { data, error } = await supabase
    .from('profiles_settings')
    .select('store_settings')
    .eq('id', session.session.user.id)
    .single();
    
  if (error) {
    console.error('Error fetching store settings:', error);
    return null;
  }

  // Use the helper function to safely convert JSON to StoreSettings
  return convertToStoreSettings(data?.store_settings);
}

// Get all product categories with counts
export async function getCategoriesWithCounts() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, description, image_url, products_count')
    .eq('status', 'Active')
    .is('parent_id', null)
    .order('name');
  
  if (error) {
    console.error('Error fetching categories with counts:', error);
    throw error;
  }

  return data;
}
