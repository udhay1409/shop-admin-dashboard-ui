
import React from 'react';
import MetricCard from '@/components/MetricCard';
import RevenueChart from '@/components/RevenueChart';
import ProductTable from '@/components/ProductTable';
import DeliveryAutomationFlow from '@/components/DeliveryAutomationFlow';
import { Card, CardContent } from '@/components/ui/card';
import { useRevenueData, useMetricsData, useTopProducts } from '@/hooks/useDashboardData';
import { generateDashboardReport } from '@/services/reportService';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: revenueData, isLoading: revenueLoading } = useRevenueData();
  const { data: metricsData, isLoading: metricsLoading } = useMetricsData();
  const { data: topProducts, isLoading: productsLoading } = useTopProducts();

  const handleGenerateReport = async () => {
    await generateDashboardReport();
  };

  // Get admin's first name for welcome message
  const adminName = user?.user_metadata?.first_name || 'Admin';

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="border-none shadow-none bg-gradient-to-r from-pink-50 to-pink-100 mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Welcome back, {adminName}!</h2>
              <p className="text-gray-600 mt-1">Here's what's happening with your store today.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button 
                onClick={handleGenerateReport} 
                className="bg-[#EC008C] text-white px-4 py-2 rounded-lg hover:bg-[#D1007D] transition-colors flex items-center"
              >
                <span>Generate Report</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard 
          title="Revenue" 
          value={metricsData?.revenue.value || "$0"} 
          subtitle="This Month" 
          change={metricsData?.revenue.change} 
          chartData={metricsData?.revenue.chartData}
        />
        <MetricCard 
          title="Orders" 
          value={metricsData?.orders.value || 0} 
          subtitle="Today" 
          change={metricsData?.orders.change} 
          chartData={metricsData?.orders.chartData}
        />
        <MetricCard 
          title="New Users" 
          value={metricsData?.newUsers.value || "0"} 
          change={metricsData?.newUsers.change} 
          chartData={metricsData?.newUsers.chartData}
        />
        <MetricCard 
          title="Existing Users" 
          value={metricsData?.existingUsers.value || "0"} 
          change={metricsData?.existingUsers.change} 
          chartData={metricsData?.existingUsers.chartData}
        />
      </div>
      
      {/* Revenue Chart */}
      <Card>
        <CardContent className="p-5">
          <RevenueChart 
            data={revenueData?.revenueData || []} 
            currentRevenue={revenueData?.currentRevenue || 0} 
          />
        </CardContent>
      </Card>
      
      {/* Product Tables and Flow Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductTable 
          title="Top Products" 
          products={topProducts || []} 
        />
        <DeliveryAutomationFlow />
      </div>
    </div>
  );
};

export default Dashboard;
