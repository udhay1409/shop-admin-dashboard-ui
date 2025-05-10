
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Fetch revenue data
export const useRevenueData = () => {
  return useQuery({
    queryKey: ["dashboardRevenue"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("created_at, total_amount")
          .order("created_at", { ascending: true });
  
        if (error) throw error;
  
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
        console.error("Error fetching revenue data:", error);
        // Fallback to empty data
        return {
          revenueData: [],
          currentRevenue: 0
        };
      }
    },
    // Mock data for development when query fails
    placeholderData: {
      revenueData: [
        { month: 'Dec 2024', revenue: 200000 },
        { month: 'Jan 2025', revenue: 315060 },
        { month: 'Feb 2025', revenue: 200000 },
        { month: 'Mar 2025', revenue: 350000 },
        { month: 'Apr 2025', revenue: 250000 },
        { month: 'May 2025', revenue: 300000 },
      ],
      currentRevenue: 315060
    }
  });
};

// Fetch metrics data
export const useMetricsData = () => {
  return useQuery({
    queryKey: ["dashboardMetrics"],
    queryFn: async () => {
      try {
        // Fetch current month's revenue
        const { data: revenueData, error: revenueError } = await supabase
          .from("orders")
          .select("total_amount, created_at")
          .gte("created_at", getFirstDayOfMonth())
          .lte("created_at", getLastDayOfMonth());
  
        if (revenueError) throw revenueError;
  
        const currentMonthRevenue = revenueData.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  
        // Fetch previous month's revenue for comparison
        const { data: prevRevenueData, error: prevRevenueError } = await supabase
          .from("orders")
          .select("total_amount")
          .gte("created_at", getFirstDayOfPreviousMonth())
          .lte("created_at", getLastDayOfPreviousMonth());
  
        if (prevRevenueError) throw prevRevenueError;
  
        const prevMonthRevenue = prevRevenueData.reduce((sum, order) => sum + (order.total_amount || 0), 0);
        const revenueChange = prevMonthRevenue === 0 ? 100 : ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100;
  
        // Fetch today's orders
        const { data: todayOrders, error: orderError } = await supabase
          .from("orders")
          .select("id")
          .gte("created_at", getTodayStart())
          .lte("created_at", getTodayEnd());
  
        if (orderError) throw orderError;
  
        // Fetch yesterday's orders for comparison
        const { data: yesterdayOrders, error: yesterdayError } = await supabase
          .from("orders")
          .select("id")
          .gte("created_at", getYesterdayStart())
          .lte("created_at", getYesterdayEnd());
  
        if (yesterdayError) throw yesterdayError;
  
        const ordersChange = yesterdayOrders.length === 0 ? 100 : ((todayOrders.length - yesterdayOrders.length) / yesterdayOrders.length) * 100;
  
        // Fetch users
        const { data: userData, error: userError } = await supabase
          .from("profiles")
          .select("id, created_at");
  
        if (userError) throw userError;
  
        const currentDate = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
        const newUsers = userData.filter(user => {
          const createdAt = new Date(user.created_at);
          return createdAt >= oneMonthAgo;
        }).length;
  
        const existingUsers = userData.length - newUsers;
        const userChangePercent = userData.length === 0 ? 0 : (newUsers / userData.length) * 100;
  
        return {
          revenue: {
            value: formatCurrency(currentMonthRevenue),
            change: { value: parseFloat(revenueChange.toFixed(1)), isPositive: revenueChange >= 0 },
            chartData: generateChartData(7)
          },
          orders: {
            value: todayOrders.length,
            change: { value: parseFloat(ordersChange.toFixed(1)), isPositive: ordersChange >= 0 },
            chartData: generateChartData(7)
          },
          newUsers: {
            value: `${newUsers}`,
            change: { value: parseFloat(userChangePercent.toFixed(1)), isPositive: true },
            chartData: generateChartData(7)
          },
          existingUsers: {
            value: `${existingUsers}`,
            change: { value: parseFloat(userChangePercent.toFixed(1)), isPositive: true },
            chartData: generateChartData(7)
          }
        };
      } catch (error) {
        console.error("Error fetching metrics data:", error);
        // Return fallback data
        return {
          revenue: {
            value: "$0",
            change: { value: 0, isPositive: true },
            chartData: generateChartData(7)
          },
          orders: {
            value: 0,
            change: { value: 0, isPositive: false },
            chartData: generateChartData(7)
          },
          newUsers: {
            value: "0",
            change: { value: 0, isPositive: true },
            chartData: generateChartData(7)
          },
          existingUsers: {
            value: "0",
            change: { value: 0, isPositive: true },
            chartData: generateChartData(7)
          }
        };
      }
    }
  });
};

// Fetch top products
export const useTopProducts = () => {
  return useQuery({
    queryKey: ["topProducts"],
    queryFn: async () => {
      try {
        const { data: productData, error } = await supabase
          .from('order_items')
          .select(`
            product_id,
            products:product_id (name, price, image_url),
            quantity
          `)
          .order('quantity', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        
        // Group by product and sum quantities
        const productMap = new Map();
        
        productData.forEach(item => {
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
      } catch (error) {
        console.error("Error fetching top products:", error);
        return [];
      }
    }
  });
};

// Helper functions
const formatCurrency = (amount: number) => {
  return `$${amount.toLocaleString()}`;
};

const formatPrice = (price: number): string => {
  return `Rs ${price.toFixed(2)}`;
};

const generateChartData = (points: number) => {
  return Array.from({ length: points }, (_, i) => ({
    value: 50 + Math.floor(Math.random() * 100)
  }));
};

const getFirstDayOfMonth = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
};

const getLastDayOfMonth = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59).toISOString();
};

const getFirstDayOfPreviousMonth = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth() - 1, 1).toISOString();
};

const getLastDayOfPreviousMonth = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 0, 23, 59, 59).toISOString();
};

const getTodayStart = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
};

const getTodayEnd = () => {
  const date = new Date();
  date.setHours(23, 59, 59, 999);
  return date.toISOString();
};

const getYesterdayStart = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
};

const getYesterdayEnd = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  date.setHours(23, 59, 59, 999);
  return date.toISOString();
};
