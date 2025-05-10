
import { supabase } from "@/integrations/supabase/client";

export const getRevenueData = async () => {
  try {
    // Calculate revenue by month
    const { data, error } = await supabase
      .from('orders')
      .select('created_at, total_amount')
      .order('created_at', { ascending: true });
    
    if (error) {
      throw error;
    }

    // Group by month
    const monthlyRevenue = new Map();
    
    data.forEach(order => {
      const date = new Date(order.created_at);
      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      
      if (!monthlyRevenue.has(monthYear)) {
        monthlyRevenue.set(monthYear, 0);
      }
      
      monthlyRevenue.set(
        monthYear, 
        monthlyRevenue.get(monthYear) + (order.total_amount || 0)
      );
    });

    // Convert to array format needed by chart
    const revenueData = Array.from(monthlyRevenue, ([month, revenue]) => ({
      month,
      revenue
    }));

    // Calculate current month's revenue
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'short', year: 'numeric' });
    const currentRevenue = monthlyRevenue.get(currentMonth) || 0;

    return {
      revenueData,
      currentRevenue
    };
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    throw error;
  }
};

export const getTopProducts = async () => {
  try {
    // Get products with most order items
    const { data, error } = await supabase.rpc('get_top_products', { limit_num: 5 });
    
    if (error) {
      // If RPC function doesn't exist, use a direct query
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('order_items')
        .select(`
          product_id,
          products:product_id (name, price, image_url),
          quantity
        `)
        .order('quantity', { ascending: false })
        .limit(5);
      
      if (fallbackError) {
        throw fallbackError;
      }
      
      // Group by product and sum quantities
      const productMap = new Map();
      
      fallbackData.forEach(item => {
        const productId = item.product_id;
        const currentQuantity = productMap.get(productId)?.unitsSold || 0;
        
        productMap.set(productId, {
          id: productId,
          name: item.products?.name || 'Unknown Product',
          price: formatPrice(item.products?.price || 0),
          unitsSold: currentQuantity + item.quantity,
          image: item.products?.image_url || '/placeholder.svg'
        });
      });
      
      return Array.from(productMap.values());
    }
    
    // Format data from RPC function
    return data.map(product => ({
      id: product.product_id,
      name: product.product_name || 'Unknown Product',
      price: formatPrice(product.price || 0),
      unitsSold: product.total_quantity || 0,
      image: product.image_url || '/placeholder.svg'
    }));
  } catch (error) {
    console.error('Error fetching top products:', error);
    // Return sample data if query fails
    return [
      { id: '1', name: 'Men Grey Hoodie', price: 'Rs 49.90', unitsSold: 204, image: '/placeholder.svg' },
      { id: '2', name: 'Women Striped T-Shirt', price: 'Rs 34.90', unitsSold: 155, image: '/placeholder.svg' },
      { id: '3', name: 'Women White T-Shirt', price: 'Rs 40.90', unitsSold: 120, image: '/placeholder.svg' },
      { id: '4', name: 'Men White T-Shirt', price: 'Rs 49.90', unitsSold: 100, image: '/placeholder.svg' }
    ];
  }
};

export const getSalesReportData = async (from: Date, to: Date) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        created_at,
        total_amount,
        payment_status,
        order_items (quantity)
      `)
      .gte('created_at', from.toISOString())
      .lte('created_at', to.toISOString())
      .order('created_at', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    // Process data for sales report
    const dailySales = new Map();
    let totalSales = 0;
    let totalOrders = 0;
    let totalItems = 0;
    
    data.forEach(order => {
      const date = new Date(order.created_at).toISOString().split('T')[0];
      
      if (!dailySales.has(date)) {
        dailySales.set(date, {
          date,
          sales: 0,
          orders: 0,
          items: 0
        });
      }
      
      const dayData = dailySales.get(date);
      const orderAmount = order.total_amount || 0;
      const itemQuantity = order.order_items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
      
      dayData.sales += orderAmount;
      dayData.orders += 1;
      dayData.items += itemQuantity;
      
      totalSales += orderAmount;
      totalOrders += 1;
      totalItems += itemQuantity;
    });
    
    return {
      dailyData: Array.from(dailySales.values()),
      summary: {
        totalSales,
        totalOrders,
        totalItems,
        averageOrderValue: totalOrders ? totalSales / totalOrders : 0
      }
    };
  } catch (error) {
    console.error('Error fetching sales report data:', error);
    throw error;
  }
};

// Helper function to format price
function formatPrice(price: number): string {
  return `Rs ${price.toFixed(2)}`;
}
