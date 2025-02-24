
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
    <div className={cn("glass-card rounded-xl p-6 hover-scale", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
          {change && (
            <p className={cn("text-sm mt-2", 
              change.startsWith('+') ? "text-green-500" : "text-red-500"
            )}>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-2 bg-white/5 rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
