
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange as DayPickerDateRange } from 'react-day-picker';

// Define our interface for DateRange that matches what our component expects
export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface ReportDateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const ReportDateRangePicker: React.FC<ReportDateRangePickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleQuickSelect = (days: number) => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    
    onChange({ from, to });
    setIsOpen(false);
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="justify-start text-left font-normal w-full sm:w-[250px]"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value?.from ? (
            value.to ? (
              <>
                {format(value.from, "LLL dd, y")} - {format(value.to, "LLL dd, y")}
              </>
            ) : (
              format(value.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col sm:flex-row gap-2 p-3 border-b">
          <Select
            onValueChange={(value) => {
              if (value === "custom") return;
              handleQuickSelect(parseInt(value));
            }}
          >
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleQuickSelect(30)}
            >
              This month
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleQuickSelect(7)}
            >
              This week
            </Button>
          </div>
        </div>
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={value?.from}
          selected={{ from: value?.from, to: value?.to }}
          onSelect={(selectedRange) => {
            // Handle the type conversion safely
            if (selectedRange) {
              // Explicitly extract from and to to ensure type compatibility
              const { from, to } = selectedRange;
              onChange({ from, to });
              
              if (from && to) {
                setIsOpen(false);
              }
            } else {
              onChange({ from: undefined, to: undefined });
            }
          }}
          numberOfMonths={2}
          className="p-3 pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
};

export default ReportDateRangePicker;
