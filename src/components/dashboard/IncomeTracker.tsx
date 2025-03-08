import * as React from 'react';
import { FC, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DashboardMetricCard } from "./DashboardMetricCard";

// Mock data for the chart
const weeklyData = [
  { name: "S", value: 1200 },
  { name: "M", value: 1900 },
  { name: "T", value: 2800 },
  { name: "W", value: 2400 },
  { name: "T", value: 2600 },
  { name: "F", value: 1800 },
  { name: "S", value: 1400 },
];

// Time period options
const timePeriods = ["Today", "Week", "Month", "Year"];

export const IncomeTracker: FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Week");
  const [isTimePopoverOpen, setIsTimePopoverOpen] = useState(false);

  return (
    <div className="flex flex-col w-full bg-surface backdrop-blur-xl border-subtle rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <CalendarIcon className="h-5 w-5 mr-3 text-primary" />
          <h2 className="text-2xl font-bold text-primary">Income Tracker</h2>
        </div>
        
        <Popover open={isTimePopoverOpen} onOpenChange={setIsTimePopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              {selectedPeriod}
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-32 p-0">
            <div className="rounded-md overflow-hidden">
              {timePeriods.map((period) => (
                <Button 
                  key={period}
                  variant="ghost" 
                  className="w-full justify-start rounded-none"
                  onClick={() => {
                    setSelectedPeriod(period);
                    setIsTimePopoverOpen(false);
                  }}
                >
                  {period}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <p className="text-secondary mb-6">
        Track changes in income over time and access detailed data on each project and payments received
      </p>
      
      <div className="relative h-64 my-4">
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-primary-700 text-white px-3 py-1 rounded-md z-10">
          $2,567
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData} barSize={30}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-subtle)" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'var(--color-text-secondary)' }}
            />
            <YAxis hide />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-primary-700 text-white px-3 py-2 rounded-md">
                      <p>${payload[0].value}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="value" 
              fill="var(--color-primary-500)" 
              radius={[4, 4, 0, 0]}
              activeBar={{ fill: 'var(--color-primary-600)' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center mt-6">
        <div className="text-4xl font-bold text-primary">+20%</div>
        <div className="ml-4 text-sm text-secondary">
          This week's income is higher than last week's
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div 
            key={day + index}
            className={`flex items-center justify-center w-10 h-10 rounded-full ${
              day === 'T' && index === 2 
                ? 'bg-primary-700 text-white' 
                : 'bg-neutral-200 text-primary'
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};
