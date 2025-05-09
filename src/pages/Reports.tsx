
import React from 'react';
import RevenueChart from '@/components/RevenueChart';
import ProductTable from '@/components/ProductTable';
import { Product } from '@/components/ProductTable';
import MetricCard from '@/components/MetricCard';

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

const Reports: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
      <div className="mb-6">
        <RevenueChart data={revenueData} currentRevenue={315060} />
      </div>
      
      {/* Product Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductTable title="Top 5 Products" products={topProducts} />
        <ProductTable title="Top 5 Categories" products={topProducts} />
      </div>
    </div>
  );
};

export default Reports;
