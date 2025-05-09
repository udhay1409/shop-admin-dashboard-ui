
import React from 'react';
import MetricCard from '@/components/MetricCard';
import RevenueChart from '@/components/RevenueChart';
import ProductTable from '@/components/ProductTable';
import { Product } from '@/components/ProductTable';
import DeliveryAutomationFlow from '@/components/DeliveryAutomationFlow';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, ShoppingBag, CreditCard } from 'lucide-react';

// Sample data for the metrics
const revenueChartData = [
  { value: 100 },
  { value: 120 },
  { value: 110 },
  { value: 130 },
  { value: 150 },
  { value: 140 },
  { value: 160 },
];

const ordersChartData = [
  { value: 80 },
  { value: 90 },
  { value: 100 },
  { value: 95 },
  { value: 85 },
  { value: 75 },
  { value: 70 },
];

const newUsersChartData = [
  { value: 30 },
  { value: 40 },
  { value: 35 },
  { value: 45 },
  { value: 50 },
  { value: 55 },
  { value: 60 },
];

const existingUsersChartData = [
  { value: 200 },
  { value: 220 },
  { value: 240 },
  { value: 230 },
  { value: 250 },
  { value: 260 },
  { value: 270 },
];

// Sample data for the revenue chart
const revenueData = [
  { month: 'Dec 2027', revenue: 200000 },
  { month: 'Jan 2028', revenue: 315060 },
  { month: 'Feb 2028', revenue: 200000 },
  { month: 'Mar 2028', revenue: 350000 },
  { month: 'Apr 2028', revenue: 250000 },
  { month: 'May 2028', revenue: 300000 },
];

// Sample data for product tables
const topProducts: Product[] = [
  { 
    id: '1', 
    name: 'Men Grey Hoodie', 
    price: 'Rs 49.90', 
    unitsSold: 204, 
    image: '/placeholder.svg' 
  },
  { 
    id: '2', 
    name: 'Women Striped T-Shirt', 
    price: 'Rs 34.90', 
    unitsSold: 155, 
    image: '/placeholder.svg' 
  },
  { 
    id: '3', 
    name: 'Women White T-Shirt', 
    price: 'Rs 40.90', 
    unitsSold: 120, 
    image: '/placeholder.svg' 
  },
  { 
    id: '4', 
    name: 'Men White T-Shirt', 
    price: 'Rs 49.90', 
    unitsSold: 204, 
    image: '/placeholder.svg' 
  },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="border-none shadow-none bg-gradient-to-r from-pink-50 to-pink-100 mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Welcome back, Admin!</h2>
              <p className="text-gray-600 mt-1">Here's what's happening with your store today.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="bg-[#EC008C] text-white px-4 py-2 rounded-lg hover:bg-[#D1007D] transition-colors flex items-center">
                <span>Generate Report</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard 
          title="Revenue" 
          value="$7,825" 
          subtitle="This Month" 
          change={{ value: 22, isPositive: true }} 
          chartData={revenueChartData}
        />
        <MetricCard 
          title="Orders" 
          value="920" 
          subtitle="Today" 
          change={{ value: 25, isPositive: false }} 
          chartData={ordersChartData}
        />
        <MetricCard 
          title="New Users" 
          value="12k" 
          change={{ value: 1.9, isPositive: true }} 
          chartData={newUsersChartData}
        />
        <MetricCard 
          title="Existing User" 
          value="3.5K" 
          change={{ value: 1.9, isPositive: true }} 
          chartData={existingUsersChartData}
        />
      </div>
      
      {/* Revenue Chart */}
      <Card>
        <CardContent className="p-5">
          <RevenueChart data={revenueData} currentRevenue={315060} />
        </CardContent>
      </Card>
      
      {/* Product Tables and Flow Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductTable title="Top Products" products={topProducts} />
        <DeliveryAutomationFlow />
      </div>
    </div>
  );
};

export default Dashboard;
