
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Fetch revenue data
export const useRevenueData = () => {
  return useQuery({
    queryKey: ["dashboardRevenue"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("created_at, total_amount")
        .order("created_at", { ascending: true })
        .limit(6);

      if (error) throw error;

      // Format the data for the chart
      const formattedData = data.map((order) => {
        const date = new Date(order.created_at);
        return {
          month: `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`,
          revenue: order.total_amount || 0,
        };
      });

      // Calculate the current month's revenue
      const currentMonthRevenue = data.reduce((total, order) => {
        const orderDate = new Date(order.created_at);
        const currentDate = new Date();
        if (orderDate.getMonth() === currentDate.getMonth() && 
            orderDate.getFullYear() === currentDate.getFullYear()) {
          return total + (order.total_amount || 0);
        }
        return total;
      }, 0);

      return { 
        revenueData: formattedData, 
        currentRevenue: currentMonthRevenue 
      };
    },
    // Mock data for development when database is empty
    placeholderData: {
      revenueData: [
        { month: 'Dec 2027', revenue: 200000 },
        { month: 'Jan 2028', revenue: 315060 },
        { month: 'Feb 2028', revenue: 200000 },
        { month: 'Mar 2028', revenue: 350000 },
        { month: 'Apr 2028', revenue: 250000 },
        { month: 'May 2028', revenue: 300000 },
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
    },
    // Mock data for development when database is empty
    placeholderData: {
      revenue: {
        value: "$7,825",
        change: { value: 22, isPositive: true },
        chartData: generateChartData(7)
      },
      orders: {
        value: 920,
        change: { value: 25, isPositive: false },
        chartData: generateChartData(7)
      },
      newUsers: {
        value: "12k",
        change: { value: 1.9, isPositive: true },
        chartData: generateChartData(7)
      },
      existingUsers: {
        value: "3.5K",
        change: { value: 1.9, isPositive: true },
        chartData: generateChartData(7)
      }
    }
  });
};

// Fetch top products
export const useTopProducts = () => {
  return useQuery({
    queryKey: ["topProducts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, stock, image_url")
        .order("stock", { ascending: false })
        .limit(4);

      if (error) throw error;

      return data.map(product => ({
        id: product.id,
        name: product.name,
        price: `Rs ${product.price.toFixed(2)}`,
        unitsSold: product.stock || 0, // Using stock as a replacement for units_sold
        image: product.image_url || '/placeholder.svg'
      }));
    },
    // Mock data for development when database is empty
    placeholderData: [
      { id: '1', name: 'Men Grey Hoodie', price: 'Rs 49.90', unitsSold: 204, image: '/placeholder.svg' },
      { id: '2', name: 'Women Striped T-Shirt', price: 'Rs 34.90', unitsSold: 155, image: '/placeholder.svg' },
      { id: '3', name: 'Women White T-Shirt', price: 'Rs 40.90', unitsSold: 120, image: '/placeholder.svg' },
      { id: '4', name: 'Men White T-Shirt', price: 'Rs 49.90', unitsSold: 204, image: '/placeholder.svg' }
    ]
  });
};

// Helper functions
const formatCurrency = (amount: number) => {
  return `$${amount.toLocaleString()}`;
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
