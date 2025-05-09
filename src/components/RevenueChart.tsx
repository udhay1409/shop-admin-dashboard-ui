
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';

export interface RevenueData {
  month: string;
  revenue: number;
}

interface RevenueChartProps {
  data: RevenueData[];
  currentRevenue: number;
}

const formatCurrency = (value: number) => {
  return `$${value.toLocaleString()}`;
};

const RevenueChart: React.FC<RevenueChartProps> = ({ data, currentRevenue }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-800">Revenue Overview</h3>
        <div className="px-4 py-1 border rounded-lg flex items-center gap-2 text-sm bg-white hover:bg-gray-50 transition-colors cursor-pointer">
          <span>Last 6 Month</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#888', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#888', fontSize: 12 }}
              tickFormatter={(value) => `$${value/1000}k`}
            />
            <Tooltip
              formatter={(value: number) => [`${formatCurrency(value)}`, 'Revenue']}
              labelFormatter={(value) => `${value}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #f0f0f0',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                padding: '10px',
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#EC008C"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#EC008C', stroke: 'white', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap gap-4">
        <div className="inline-block bg-gray-100 px-4 py-3 rounded-lg">
          <div className="text-sm text-gray-500">Total Revenue</div>
          <div className="font-bold text-lg">${currentRevenue.toLocaleString()}</div>
        </div>
        <div className="inline-block bg-pink-50 px-4 py-3 rounded-lg">
          <div className="text-sm text-gray-500">Predicted Growth</div>
          <div className="font-bold text-lg text-[#EC008C]">+12.5%</div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
