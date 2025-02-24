
import { cn } from "@/lib/utils";

interface DashboardMetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function DashboardMetricCard({ title, value, change, icon, className }: DashboardMetricCardProps) {
  return (
    <div className={cn(
      "bg-white/50 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg transition-all duration-200 hover:shadow-xl hover:translate-y-[-2px] hover:bg-white/60",
      className
    )}>
      <div className="flex items-start justify-between space-x-4">
        {icon && (
          <div className="p-3 bg-white/50 backdrop-blur-md rounded-xl">
            {icon}
          </div>
        )}
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
          {change && (
            <p className={cn("text-sm font-medium mt-2 flex items-center", 
              change.startsWith('+') ? "text-emerald-600" : "text-rose-600"
            )}>
              {change}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
