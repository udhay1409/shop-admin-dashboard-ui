
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartColumn, FileChartColumnIcon, FileChartPieIcon, FileChartLine } from 'lucide-react';

interface ReportTypeSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const ReportTypeSelector: React.FC<ReportTypeSelectorProps> = ({ value, onValueChange }) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full sm:w-[180px]">
        <SelectValue placeholder="Select report type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="overview">
          <div className="flex items-center">
            <ChartColumn className="w-4 h-4 mr-2" />
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
            <FileChartColumnIcon className="w-4 h-4 mr-2" />
            <span>Product Performance</span>
          </div>
        </SelectItem>
        <SelectItem value="customers">
          <div className="flex items-center">
            <FileChartPieIcon className="w-4 h-4 mr-2" />
            <span>Customer Analysis</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ReportTypeSelector;
