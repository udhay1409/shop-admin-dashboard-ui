
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartBar, FileChartLine, FileChartPie } from 'lucide-react';

// Define the report type as a union of specific string literals
export type ReportType = 'overview' | 'sales' | 'products' | 'customers';

interface ReportTypeSelectorProps {
  value: ReportType;
  onValueChange: (value: ReportType) => void;
}

const ReportTypeSelector: React.FC<ReportTypeSelectorProps> = ({ value, onValueChange }) => {
  return (
    <Select
      value={value}
      onValueChange={(val) => onValueChange(val as ReportType)}
    >
      <SelectTrigger className="w-full sm:w-[180px]">
        <SelectValue placeholder="Select report type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="overview">
          <div className="flex items-center">
            <ChartBar className="w-4 h-4 mr-2" />
            <span>Overview</span>
          </div>
        </SelectItem>
        <SelectItem value="sales">
          <div className="flex items-center">
            <FileChartLine className="w-4 h-4 mr-2" />
            <span>Sales Analysis</span>
          </div>
        </SelectItem>
        <SelectItem value="products">
          <div className="flex items-center">
            <ChartBar className="w-4 h-4 mr-2" />
            <span>Product Performance</span>
          </div>
        </SelectItem>
        <SelectItem value="customers">
          <div className="flex items-center">
            <FileChartPie className="w-4 h-4 mr-2" />
            <span>Customer Analysis</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ReportTypeSelector;
