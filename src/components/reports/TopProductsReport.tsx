
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Sample product report data
const productPerformance = [
  {
    id: '1',
    name: 'Men Grey Hoodie',
    category: 'Hoodies',
    sku: 'MH-001',
    unitsSold: 204,
    revenue: 10180,
    profit: 3054,
    stockStatus: 'In Stock',
    stockLevel: 45,
  },
  {
    id: '2',
    name: 'Women Striped T-Shirt',
    category: 'T-Shirts',
    sku: 'WT-112',
    unitsSold: 155,
    revenue: 5410,
    profit: 2164,
    stockStatus: 'Low Stock',
    stockLevel: 8,
  },
  {
    id: '3',
    name: 'Women White T-Shirt',
    category: 'T-Shirts',
    sku: 'WT-103',
    unitsSold: 120,
    revenue: 4908,
    profit: 1472,
    stockStatus: 'In Stock',
    stockLevel: 32,
  },
  {
    id: '4',
    name: 'Men White T-Shirt',
    category: 'T-Shirts',
    sku: 'MT-201',
    unitsSold: 109,
    revenue: 5440,
    profit: 1632,
    stockStatus: 'Out of Stock',
    stockLevel: 0,
  },
  {
    id: '5',
    name: 'Women Black Jeans',
    category: 'Jeans',
    sku: 'WJ-505',
    unitsSold: 95,
    revenue: 6650,
    profit: 1995,
    stockStatus: 'In Stock',
    stockLevel: 22,
  }
];

// Sample category performance data
const categoryPerformance = [
  { 
    category: 'T-Shirts',
    unitsSold: 384,
    revenue: 15758,
    profit: 5268,
    growthRate: 12.5
  },
  {
    category: 'Hoodies',
    unitsSold: 304,
    revenue: 15200,
    profit: 4560,
    growthRate: 8.3
  },
  {
    category: 'Jeans',
    unitsSold: 183,
    revenue: 12810,
    profit: 3843,
    growthRate: 5.7
  },
  {
    category: 'Dresses',
    unitsSold: 124,
    revenue: 9920,
    profit: 3976,
    growthRate: -3.2
  },
];

interface TopProductsReportProps {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

const TopProductsReport: React.FC<TopProductsReportProps> = ({ dateRange }) => {
  // Function to determine stock status badge color
  const getStockStatusBadge = (status: string) => {
    switch (status) {
      case 'In Stock':
        return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">In Stock</Badge>;
      case 'Low Stock':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">Low Stock</Badge>;
      case 'Out of Stock':
        return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Out of Stock</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Function to render growth rate with appropriate color
  const renderGrowthRate = (rate: number) => {
    const isPositive = rate >= 0;
    return (
      <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '+' : ''}{rate}%
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Top Products Performance</CardTitle>
          <CardDescription>
            {dateRange.from && dateRange.to
              ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
              : 'All time product performance'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Units Sold</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead>Stock Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productPerformance.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">{product.unitsSold}</TableCell>
                  <TableCell className="text-right">${product.revenue.toLocaleString()}</TableCell>
                  <TableCell>{getStockStatusBadge(product.stockStatus)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
          <CardDescription>Sales and growth by product category</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Units Sold</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Profit</TableHead>
                <TableHead>Growth Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryPerformance.map((category) => (
                <TableRow key={category.category}>
                  <TableCell className="font-medium">{category.category}</TableCell>
                  <TableCell className="text-right">{category.unitsSold}</TableCell>
                  <TableCell className="text-right">${category.revenue.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${category.profit.toLocaleString()}</TableCell>
                  <TableCell>{renderGrowthRate(category.growthRate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Inventory Status</CardTitle>
          <CardDescription>Current product stock levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {productPerformance.map((product) => (
              <div key={product.id} className="grid grid-cols-6 gap-4 items-center">
                <div className="col-span-2 font-medium">{product.name}</div>
                <div className="col-span-3">
                  <Progress 
                    value={product.stockLevel} 
                    max={100} 
                    className={`h-2 ${
                      product.stockLevel === 0 ? 'bg-red-100' : 
                      product.stockLevel < 10 ? 'bg-yellow-100' : 
                      'bg-green-100'
                    }`}
                  />
                </div>
                <div className="text-right text-sm text-gray-500">
                  {product.stockLevel} units
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopProductsReport;
