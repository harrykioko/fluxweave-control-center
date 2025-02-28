
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

export function DashboardMetricCard({ 
  title, 
  value, 
  change, 
  icon, 
  description,
  className 
}: DashboardMetricCardProps) {
  return (
    <div className={cn(
      "bg-white/50 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg transition-all duration-200 hover:shadow-xl",
      className
    )}>
      <div className="flex items-start justify-between">
        {icon && (
          <div className="p-3 bg-white/50 backdrop-blur-md rounded-xl">
            {icon}
          </div>
        )}
        <div className={cn("flex-1", icon ? "ml-4" : "")}>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
          
          {change && (
            <div className="mt-2 flex items-center">
              <span className={cn("flex items-center text-sm font-medium", 
                change.isPositive ? "text-emerald-600" : "text-rose-600"
              )}>
                {change.isPositive ? (
                  <ArrowUp className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDown className="w-4 h-4 mr-1" />
                )}
                {change.value}
              </span>
              
              {description && (
                <span className="text-xs text-slate-500 ml-2">{description}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
