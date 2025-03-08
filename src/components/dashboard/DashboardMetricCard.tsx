import * as React from 'react';
import { FC, useState } from 'react';
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import { getAnimationClasses } from '@/hooks/useAnimation';

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
  /**
   * The animation duration
   * @default "medium"
   */
  duration?: 'fast' | 'medium' | 'slow';
  
  /**
   * The animation easing function
   * @default "standard"
   */
  easing?: 'standard' | 'decelerate' | 'accelerate' | 'sharp' | 'bounce';
  
  /**
   * The hover effect to apply
   * @default "scale"
   */
  hoverEffect?: 'scale' | 'elevate' | 'none';
}

export const DashboardMetricCard: FC<DashboardMetricCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  description,
  className,
  onClick,
  id = `metric-card-${Math.random().toString(36).substr(2, 9)}`,
  duration = 'medium',
  easing = 'standard',
  hoverEffect = 'scale'
}) => {
  const isInteractive = !!onClick;
  const [isPressed, setIsPressed] = useState(false);
  
  // Get animation classes
  const animationClasses = getAnimationClasses({
    transition: 'all',
    duration,
    easing,
    hover: isInteractive && hoverEffect !== 'none' ? hoverEffect : false,
  });
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick?.();
    }
  };

  const handleMouseDown = () => {
    if (isInteractive) {
      setIsPressed(true);
    }
  };
  
  const handleMouseUp = () => {
    if (isInteractive) {
      setIsPressed(false);
    }
  };

  const Component = isInteractive ? 'button' : 'section';
  
  const accessibilityProps = isInteractive ? {
    role: 'button',
    tabIndex: 0,
    onClick,
    onKeyDown: handleKeyDown,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseUp,
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
        animationClasses,
        isPressed && 'scale-98',
        isInteractive && "focus-visible:ring-2 focus-visible:ring-primary-400 outline-none",
        className
      )}
      {...accessibilityProps}
    >
      <div className="flex items-start justify-between">
        {icon && (
          <div className={cn(
            "p-3 glass-sm rounded-xl",
            "transition-transform duration-medium ease-bounce"
          )} aria-hidden="true">
            {icon}
          </div>
        )}
        <div className={cn("flex-1", icon ? "ml-4" : "")}>
          <h3 id={`${id}-title`} className="text-sm font-medium text-secondary">{title}</h3>
          <p className="text-2xl font-bold text-primary mt-1 transition-colors duration-fast" aria-live="polite">{value}</p>
          
          {change && (
            <div className="mt-2 flex items-center">
              <span 
                className={cn(
                  "flex items-center text-sm font-medium transition-all duration-fast", 
                  change.isPositive ? "text-success-500" : "text-error-500"
                )}
                aria-live="polite"
              >
                {change.isPositive ? (
                  <>
                    <ArrowUp className="w-4 h-4 mr-1 transition-transform duration-fast" aria-hidden="true" />
                    <span className="sr-only">Increased by</span>
                  </>
                ) : (
                  <>
                    <ArrowDown className="w-4 h-4 mr-1 transition-transform duration-fast" aria-hidden="true" />
                    <span className="sr-only">Decreased by</span>
                  </>
                )}
                {change.value}
              </span>
              
              {description && (
                <span id={`${id}-desc`} className="text-xs text-tertiary ml-2 transition-opacity duration-fast">{description}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Component>
  );
};
