
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
    <div className="table-container">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Revenue</h3>
        <div className="px-4 py-1 border rounded-md flex items-center gap-2 text-sm">
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
              tickFormatter={(value) => `$${value}k`}
            />
            <Tooltip
              formatter={(value: number) => [`${formatCurrency(value)}`, 'Revenue']}
              labelFormatter={(value) => `${value}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #f0f0f0',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#FF0B8A"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#FF0B8A', stroke: 'white', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4">
        <div className="inline-block bg-gray-100 px-3 py-2 rounded-md">
          <div className="text-sm text-gray-500">Total Revenue</div>
          <div className="font-bold">${currentRevenue.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
