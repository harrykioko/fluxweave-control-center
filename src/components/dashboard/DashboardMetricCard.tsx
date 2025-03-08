import * as React from 'react';
import { FC } from 'react';
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

interface DashboardMetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  description?: string;
  className?: string;
}

export const DashboardMetricCard: FC<DashboardMetricCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  description,
  className 
}) => {
  return (
    <div className={cn(
      "glass-card p-6 hover-scale",
      className
    )}>
      <div className="flex items-start justify-between">
        {icon && (
          <div className="p-3 glass-sm rounded-xl">
            {icon}
          </div>
        )}
        <div className={cn("flex-1", icon ? "ml-4" : "")}>
          <p className="text-sm font-medium text-secondary">{title}</p>
          <p className="text-2xl font-bold text-primary mt-1">{value}</p>
          
          {change && (
            <div className="mt-2 flex items-center">
              <span className={cn("flex items-center text-sm font-medium", 
                change.isPositive ? "text-success-500" : "text-error-500"
              )}>
                {change.isPositive ? (
                  <ArrowUp className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDown className="w-4 h-4 mr-1" />
                )}
                {change.value}
              </span>
              
              {description && (
                <span className="text-xs text-tertiary ml-2">{description}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
