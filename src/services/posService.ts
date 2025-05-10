
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductStatus } from '@/types/product';
import { useToast } from '@/hooks/use-toast';
import { createOrder } from './orderService';

// Get all active products for POS
export async function getPOSProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name)
    `)
    .eq('status', 'Active');
  
  if (error) {
    console.error('Error fetching POS products:', error);
    return [];
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

// Get product categories for filtering
export async function getPOSCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('name')
    .eq('status', 'Active');
  
  if (error) {
    console.error('Error fetching product categories:', error);
    return [];
  }

  return data.map(category => category.name);
}

// Create a new transaction/sale
export async function createTransaction(
  cartItems: { product: Product, quantity: number }[],
  paymentMethod: string,
  totalAmount: number,
  taxAmount: number,
  customerInfo?: { name?: string, email?: string, phone?: string, address?: string }
): Promise<string | null> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      console.error('Authentication required');
      return null;
    }
    
    // 1. Create order
    const shippingAddress = customerInfo?.address ? { full_address: customerInfo.address } : null;
    
    const orderData = {
      user_id: userData.user.id,
      status: 'Delivered' as const, // POS sales are typically delivered immediately
      total_amount: totalAmount + taxAmount,
      payment_method: paymentMethod,
      payment_status: 'Paid' as const, // POS sales are typically paid immediately
      shipping_address: shippingAddress,
      shipping_cost: 0, // No shipping for in-store purchases
      notes: 'In-store purchase via POS',
      delivery_status: 'Delivered' as const,
    };
    
    // Create the order
    const orderId = await createOrder(orderData);
    
    if (!orderId) {
      throw new Error('Failed to create order');
    }
    
    // 2. Add order items
    const orderItems = cartItems.map(item => ({
      order_id: orderId,
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
      total_price: item.product.price * item.quantity,
    }));
    
    const { error: orderItemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (orderItemsError) {
      throw orderItemsError;
    }
    
    // 3. Update product stock
    for (const item of cartItems) {
      const { error: stockError } = await supabase
        .from('products')
        .update({ 
          stock: item.product.stock - item.quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', item.product.id);
      
      if (stockError) {
        console.error('Error updating stock for product', item.product.id, stockError);
        // We continue despite errors to complete the transaction
      }
      
      // 4. Create inventory transaction records
      const { error: inventoryError } = await supabase
        .from('inventory_transactions')
        .insert({
          product_id: item.product.id,
          quantity: -item.quantity, // Negative because it's a reduction
          type: 'sale',
          reference_id: orderId,
          created_by: userData.user.id,
          notes: 'POS Sale'
        });
      
      if (inventoryError) {
        console.error('Error recording inventory transaction', inventoryError);
        // We continue despite errors to complete the transaction
      }
    }
    
    return orderId;
  } catch (error) {
    console.error('Error processing transaction:', error);
    return null;
  }
}
