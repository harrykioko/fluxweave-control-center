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
  onClick?: () => void;
  id?: string;
}

export const DashboardMetricCard: FC<DashboardMetricCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  description,
  className,
  onClick,
  id = `metric-card-${Math.random().toString(36).substr(2, 9)}`
}) => {
  const isInteractive = !!onClick;
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick?.();
    }
  };

  const Component = isInteractive ? 'button' : 'section';
  
  const accessibilityProps = isInteractive ? {
    role: 'button',
    tabIndex: 0,
    onClick,
    onKeyDown: handleKeyDown,
    'aria-labelledby': `${id}-title`,
    'aria-describedby': description ? `${id}-desc` : undefined,
  } : {
    role: 'region',
    'aria-labelledby': `${id}-title`,
  };

  return (
    <Component
      id={id}
      className={cn(
        "glass-card p-6",
        isInteractive && "hover-scale focus-visible:ring-2 focus-visible:ring-primary-400 outline-none",
        className
      )}
      {...accessibilityProps}
    >
      <div className="flex items-start justify-between">
        {icon && (
          <div className="p-3 glass-sm rounded-xl" aria-hidden="true">
            {icon}
          </div>
        )}
        <div className={cn("flex-1", icon ? "ml-4" : "")}>
          <h3 id={`${id}-title`} className="text-sm font-medium text-secondary">{title}</h3>
          <p className="text-2xl font-bold text-primary mt-1" aria-live="polite">{value}</p>
          
          {change && (
            <div className="mt-2 flex items-center">
              <span 
                className={cn("flex items-center text-sm font-medium", 
                  change.isPositive ? "text-success-500" : "text-error-500"
                )}
                aria-live="polite"
              >
                {change.isPositive ? (
                  <>
                    <ArrowUp className="w-4 h-4 mr-1" aria-hidden="true" />
                    <span className="sr-only">Increased by</span>
                  </>
                ) : (
                  <>
                    <ArrowDown className="w-4 h-4 mr-1" aria-hidden="true" />
                    <span className="sr-only">Decreased by</span>
                  </>
                )}
                {change.value}
              </span>
              
              {description && (
                <span id={`${id}-desc`} className="text-xs text-tertiary ml-2">{description}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Component>
  );
};
