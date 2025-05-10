
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { getTopProducts } from '@/services/reportService';
import { useToast } from '@/hooks/use-toast';

interface TopProductsReportProps {
  dateRange: {
    from?: Date;
    to?: Date;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const TopProductsReport: React.FC<TopProductsReportProps> = ({ dateRange }) => {
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setIsLoading(true);
        const products = await getTopProducts();
        setTopProducts(products);
      } catch (error) {
        console.error('Error fetching top products:', error);
        toast({
          title: 'Error',
          description: 'Failed to load top products data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTopProducts();
  }, [dateRange, toast]);

  // Prepare data for charts
  const barChartData = topProducts.map(product => ({
    name: product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name,
    units: product.unitsSold
  }));

  const pieChartData = topProducts.map(product => ({
    name: product.name,
    value: product.unitsSold
  }));

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6 h-80">
              <div className="w-full h-full bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Units Sold by Product</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="units" name="Units Sold" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sales Distribution</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} units`, 'Units Sold']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Rank</th>
                  <th className="py-2 text-left">Product</th>
                  <th className="py-2 text-left">Price</th>
                  <th className="py-2 text-left">Units Sold</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={product.id} className="border-b">
                    <td className="py-2">{index + 1}</td>
                    <td className="py-2">{product.name}</td>
                    <td className="py-2">{product.price}</td>
                    <td className="py-2">{product.unitsSold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopProductsReport;
