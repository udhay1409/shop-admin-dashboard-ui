import { supabase } from "@/integrations/supabase/client";
import { Product, ProductFormValues, ProductStatus } from "@/types/product";

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name)
    `);
  
  if (error) {
    console.error('Error fetching products:', error);
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
    // These fields might not exist in the database yet, so we provide default values
    subcategory: '',
    availableSizes: [],
    availableColors: [],
    bulkDiscountQuantity: 0,
    bulkDiscountPercentage: 0,
    additionalImages: []
  }));
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name)
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Product not found
    }
    console.error('Error fetching product:', error);
    throw error;
  }

  // Convert database fields to our model
  return {
    id: data.id,
    name: data.name,
    price: Number(data.price),
    stock: data.stock,
    status: data.status as ProductStatus,
    category: data.category?.name || 'Uncategorized',
    image: data.image_url,
    description: data.description || '',
    sku: data.sku || '',
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    originalPrice: data.original_price ? Number(data.original_price) : undefined,
    discountPercentage: data.discount_percentage ? Number(data.discount_percentage) : undefined,
    isNew: data.is_new,
    isSale: data.is_sale,
    trending: data.trending,
    hotSelling: data.hot_selling,
    // These fields might not exist in the database yet, so we provide default values
    subcategory: '',
    availableSizes: [],
    availableColors: [],
    bulkDiscountQuantity: 0,
    bulkDiscountPercentage: 0,
    additionalImages: []
  };
}

export async function createProduct(productData: ProductFormValues): Promise<Product> {
  // Find category ID based on category name
  const { data: categoryData, error: categoryError } = await supabase
    .from('categories')
    .select('id')
    .eq('name', productData.category)
    .maybeSingle();
    
  if (categoryError) {
    console.error('Error finding category:', categoryError);
  }

  // Map our form fields to database column names, only including fields that exist in the database
  const { data, error } = await supabase
    .from('products')
    .insert({
      name: productData.name,
      price: productData.price,
      stock: productData.stock,
      status: productData.status,
      category_id: categoryData?.id,
      image_url: productData.image || null,
      description: productData.description || null,
      sku: productData.sku || null,
      original_price: productData.originalPrice || null,
      discount_percentage: productData.discountPercentage || null,
      is_new: productData.isNew || false,
      is_sale: productData.isSale || false,
      trending: productData.trending || false,
      hot_selling: productData.hotSelling || false,
      // Removed fields that don't exist in the database:
      // subcategory, available_sizes, available_colors, bulk_discount_quantity, bulk_discount_percentage, additional_images
    })
    .select(`
      *,
      category:categories(name)
    `)
    .single();
  
  if (error) {
    console.error('Error creating product:', error);
    throw error;
  }

  // Convert database fields to our model
  return {
    id: data.id,
    name: data.name,
    price: Number(data.price),
    stock: data.stock,
    status: data.status as ProductStatus,
    category: data.category?.name || 'Uncategorized',
    image: data.image_url,
    description: data.description || '',
    sku: data.sku || '',
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    originalPrice: data.original_price ? Number(data.original_price) : undefined,
    discountPercentage: data.discount_percentage ? Number(data.discount_percentage) : undefined,
    isNew: data.is_new,
    isSale: data.is_sale,
    trending: data.trending,
    hotSelling: data.hot_selling,
    // For newly created products, use the values from the input data
    subcategory: productData.subcategory || '',
    availableSizes: productData.availableSizes || [],
    availableColors: productData.availableColors || [],
    bulkDiscountQuantity: productData.bulkDiscountQuantity || 0,
    bulkDiscountPercentage: productData.bulkDiscountPercentage || 0,
    additionalImages: productData.additionalImages || []
  };
}

export async function updateProduct(id: string, productData: Partial<ProductFormValues>): Promise<Product> {
  let categoryId: string | undefined;
  
  // Find category ID based on category name
  if (productData.category) {
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('name', productData.category)
      .maybeSingle();
      
    if (categoryError) {
      console.error('Error finding category:', categoryError);
    } else {
      categoryId = categoryData?.id;
    }
  }

  const updateData: any = {
    updated_at: new Date().toISOString()
  };
  
  // Map our form fields to database column names - only include fields that exist in the database
  if (productData.name !== undefined) updateData.name = productData.name;
  if (productData.price !== undefined) updateData.price = productData.price;
  if (productData.stock !== undefined) updateData.stock = productData.stock;
  if (productData.status !== undefined) updateData.status = productData.status;
  if (categoryId !== undefined) updateData.category_id = categoryId;
  if (productData.image !== undefined) updateData.image_url = productData.image;
  if (productData.description !== undefined) updateData.description = productData.description;
  if (productData.sku !== undefined) updateData.sku = productData.sku;
  if (productData.originalPrice !== undefined) updateData.original_price = productData.originalPrice;
  if (productData.discountPercentage !== undefined) updateData.discount_percentage = productData.discountPercentage;
  if (productData.isNew !== undefined) updateData.is_new = productData.isNew;
  if (productData.isSale !== undefined) updateData.is_sale = productData.isSale;
  if (productData.trending !== undefined) updateData.trending = productData.trending;
  if (productData.hotSelling !== undefined) updateData.hot_selling = productData.hotSelling;
  
  // Removed fields that don't exist in the database

  const { data, error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', id)
    .select(`
      *,
      category:categories(name)
    `)
    .single();
  
  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }

  // Convert database fields to our model
  return {
    id: data.id,
    name: data.name,
    price: Number(data.price),
    stock: data.stock,
    status: data.status as ProductStatus,
    category: data.category?.name || 'Uncategorized',
    image: data.image_url,
    description: data.description || '',
    sku: data.sku || '',
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    originalPrice: data.original_price ? Number(data.original_price) : undefined,
    discountPercentage: data.discount_percentage ? Number(data.discount_percentage) : undefined,
    isNew: data.is_new,
    isSale: data.is_sale,
    trending: data.trending,
    hotSelling: data.hot_selling,
    // For update operations, use the values from the update data if provided
    subcategory: productData.subcategory || '',
    availableSizes: productData.availableSizes || [],
    availableColors: productData.availableColors || [],
    bulkDiscountQuantity: productData.bulkDiscountQuantity || 0,
    bulkDiscountPercentage: productData.bulkDiscountPercentage || 0,
    additionalImages: productData.additionalImages || []
  };
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting product:', error);
    throw error;
  }

  return true;
}

export async function getCategories(): Promise<{id: string, name: string}[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name')
    .eq('status', 'Active');
  
  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }

  return data;
}

export async function getSubcategories(categoryId?: string): Promise<{id: string, name: string}[]> {
  let query = supabase
    .from('categories')
    .select('id, name')
    .eq('status', 'Active');
  
  if (categoryId) {
    query = query.eq('parent_id', categoryId);
  } else {
    query = query.not('parent_id', 'is', null);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching subcategories:', error);
    throw error;
  }

  return data;
}
