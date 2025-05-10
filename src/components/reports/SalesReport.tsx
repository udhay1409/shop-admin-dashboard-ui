
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

// Sample sales data
const monthlySales = [
  { name: 'Jan', sales: 65000, returns: 4000, net: 61000 },
  { name: 'Feb', sales: 59000, returns: 3000, net: 56000 },
  { name: 'Mar', sales: 80000, returns: 5000, net: 75000 },
  { name: 'Apr', sales: 81000, returns: 6000, net: 75000 },
  { name: 'May', sales: 56000, returns: 2000, net: 54000 },
  { name: 'Jun', sales: 55000, returns: 3000, net: 52000 },
  { name: 'Jul', sales: 40000, returns: 2000, net: 38000 },
];

// Sample sales by channel data
const channelSales = [
  { channel: 'Website', sales: 189000, percentage: 45.6 },
  { channel: 'Mobile App', sales: 140000, percentage: 33.8 },
  { channel: 'Social Media', sales: 56000, percentage: 13.5 },
  { channel: 'Marketplace', sales: 29500, percentage: 7.1 },
];

interface SalesReportProps {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

const SalesReport: React.FC<SalesReportProps> = ({ dateRange }) => {
  const [view, setView] = useState<'chart' | 'table'>('chart');
  
  // Chart configuration
  const config = {
    sales: {
      label: "Gross Sales",
      theme: {
        light: "#1E40AF",
        dark: "#3B82F6",
      },
    },
    returns: {
      label: "Returns",
      theme: {
        light: "#991B1B",
        dark: "#EF4444",
      },
    },
    net: {
      label: "Net Sales",
      theme: {
        light: "#047857",
        dark: "#10B981",
      },
    },
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Sales Report</CardTitle>
              <CardDescription>
                {dateRange.from && dateRange.to
                  ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
                  : 'All time sales data'}
              </CardDescription>
            </div>
            <Tabs value={view} onValueChange={(v) => setView(v as 'chart' | 'table')}>
              <TabsList>
                <TabsTrigger value="chart">Chart</TabsTrigger>
                <TabsTrigger value="table">Table</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <TabsContent value="chart" className="h-[400px] mt-0">
            <ChartContainer config={config}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlySales}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="sales" fill="var(--color-sales)" name="sales" />
                  <Bar dataKey="returns" fill="var(--color-returns)" name="returns" />
                  <Bar dataKey="net" fill="var(--color-net)" name="net" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="table" className="mt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Gross Sales</TableHead>
                  <TableHead className="text-right">Returns</TableHead>
                  <TableHead className="text-right">Net Sales</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlySales.map((month) => (
                  <TableRow key={month.name}>
                    <TableCell className="font-medium">{month.name}</TableCell>
                    <TableCell className="text-right">${month.sales.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${month.returns.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${month.net.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Sales by Channel</CardTitle>
          <CardDescription>Distribution of sales across different platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Channel</TableHead>
                <TableHead className="text-right">Sales</TableHead>
                <TableHead className="text-right">Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channelSales.map((channel) => (
                <TableRow key={channel.channel}>
                  <TableCell className="font-medium">{channel.channel}</TableCell>
                  <TableCell className="text-right">${channel.sales.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{channel.percentage}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesReport;
