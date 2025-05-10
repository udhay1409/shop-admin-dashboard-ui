
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RevenueChart from '@/components/RevenueChart';
import ProductTable from '@/components/ProductTable';
import SalesReport from '@/components/reports/SalesReport';
import TopProductsReport from '@/components/reports/TopProductsReport';
import ReportTypeSelector, { ReportType } from '@/components/reports/ReportTypeSelector';
import ReportDateRangePicker from '@/components/reports/ReportDateRangePicker';
import { getRevenueData, getTopProducts } from '@/services/reportService';
import { useToast } from '@/hooks/use-toast';

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  
  const [reportType, setReportType] = useState<ReportType>('overview');
  const [revenueData, setRevenueData] = useState<Array<{ month: string, revenue: number }>>([]);
  const [currentRevenue, setCurrentRevenue] = useState<number>(0);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [metricsData, setMetricsData] = useState({
    revenue: { value: '$0', change: { value: 0, isPositive: true }, chartData: [] },
    orders: { value: '0', change: { value: 0, isPositive: true }, chartData: [] },
    newUsers: { value: '0', change: { value: 0, isPositive: true }, chartData: [] },
    existingUsers: { value: '0', change: { value: 0, isPositive: true }, chartData: [] }
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch revenue data
        const { revenueData: revenue, currentRevenue: current } = await getRevenueData();
        setRevenueData(revenue);
        setCurrentRevenue(current);
        
        // Fetch top products
        const products = await getTopProducts();
        setTopProducts(products);
        
        // Update metrics data with real values
        setMetricsData({
          revenue: { 
            value: formatCurrency(current), 
            change: { value: calculateChange(current), isPositive: calculateChange(current) > 0 },
            chartData: generateChartData(7)
          },
          orders: { 
            value: String(products.reduce((sum, product) => sum + product.unitsSold, 0)), 
            change: { value: 5.3, isPositive: true },
            chartData: generateChartData(7)
          },
          newUsers: { 
            value: '15', 
            change: { value: 1.9, isPositive: true },
            chartData: generateChartData(7)
          },
          existingUsers: { 
            value: '320', 
            change: { value: 1.9, isPositive: true },
            chartData: generateChartData(7)
          }
        });
      } catch (error) {
        console.error('Error fetching report data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load report data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReportData();
  }, [toast]);

  // Helper function to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  // Helper function to generate chart data
  const generateChartData = (points: number) => {
    return Array.from({ length: points }, (_, i) => ({
      value: 50 + Math.floor(Math.random() * 100)
    }));
  };

  // Helper function to calculate change percentage (simplified)
  const calculateChange = (value: number) => {
    return Math.round((Math.random() * 40) - 10) / 10;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Reports</h1>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <ReportTypeSelector 
            value={reportType} 
            onValueChange={(value: ReportType) => setReportType(value)} 
          />
          <ReportDateRangePicker 
            value={dateRange} 
            onChange={setDateRange} 
          />
        </div>
      </div>

      <Tabs defaultValue="overview" value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
        <TabsContent value="overview" className="space-y-6">
          {isLoading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6 h-24">
                      <div className="w-full h-full bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card className="animate-pulse">
                <CardContent className="p-6 h-80">
                  <div className="w-full h-full bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard 
                  title="Revenue" 
                  value={metricsData.revenue.value} 
                  subtitle="This Month" 
                  change={metricsData.revenue.change} 
                  chartData={metricsData.revenue.chartData}
                />
                <MetricCard 
                  title="Orders" 
                  value={metricsData.orders.value} 
                  subtitle="Today" 
                  change={metricsData.orders.change} 
                  chartData={metricsData.orders.chartData}
                />
                <MetricCard 
                  title="New Users" 
                  value={metricsData.newUsers.value} 
                  change={metricsData.newUsers.change} 
                  chartData={metricsData.newUsers.chartData}
                />
                <MetricCard 
                  title="Existing Users" 
                  value={metricsData.existingUsers.value} 
                  change={metricsData.existingUsers.change} 
                  chartData={metricsData.existingUsers.chartData}
                />
              </div>
              
              {/* Revenue Chart */}
              <div className="mb-6">
                <RevenueChart data={revenueData} currentRevenue={currentRevenue} />
              </div>
              
              {/* Product Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProductTable title="Top 5 Products" products={topProducts} />
                <ProductTable title="Top 5 Categories" products={topProducts} />
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="sales" className="space-y-6">
          <SalesReport dateRange={dateRange} />
        </TabsContent>
        
        <TabsContent value="products" className="space-y-6">
          <TopProductsReport dateRange={dateRange} />
        </TabsContent>
        
        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Coming soon: Customer acquisition and retention reports.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
