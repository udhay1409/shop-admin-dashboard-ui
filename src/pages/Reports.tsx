
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RevenueChart from '@/components/RevenueChart';
import ProductTable from '@/components/ProductTable';
import MetricCard from '@/components/MetricCard';
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
  const { toast } = useToast();

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
