import React from 'react';
import { cn } from '@/lib/utils';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The size of the spinner
   * @default "medium"
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * The color of the spinner
   * @default "primary"
   */
  color?: 'primary' | 'secondary' | 'neutral' | 'info' | 'success' | 'warning' | 'error';
  
  /**
   * Whether to show a label next to the spinner
   * @default false
   */
  showLabel?: boolean;
  
  /**
   * The label to show next to the spinner
   * @default "Loading..."
   */
  label?: string;
  
  /**
   * The position of the label relative to the spinner
   * @default "right"
   */
  labelPosition?: 'top' | 'right' | 'bottom' | 'left';
}

/**
 * Spinner component for indicating loading states
 */
export function Spinner({
  size = 'medium',
  color = 'primary',
  showLabel = false,
  label = 'Loading...',
  labelPosition = 'right',
  className,
  ...props
}: SpinnerProps) {
  // Size classes
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-3',
    large: 'h-12 w-12 border-4',
  };
  
  // Color classes
  const colorClasses = {
    primary: 'border-primary-500 border-t-transparent',
    secondary: 'border-secondary-500 border-t-transparent',
    neutral: 'border-neutral-500 border-t-transparent',
    info: 'border-info-500 border-t-transparent',
    success: 'border-success-500 border-t-transparent',
    warning: 'border-warning-500 border-t-transparent',
    error: 'border-error-500 border-t-transparent',
  };
  
  // Label position classes
  const containerClasses = {
    top: 'flex-col-reverse items-center gap-2',
    right: 'flex-row items-center gap-3',
    bottom: 'flex-col items-center gap-2',
    left: 'flex-row-reverse items-center gap-3',
  };
  
  return (
    <div 
      className={cn(
        'flex',
        containerClasses[labelPosition],
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'rounded-full animate-spin',
          sizeClasses[size],
          colorClasses[color]
        )}
        role="status"
        aria-label={showLabel ? undefined : label}
      />
      
      {showLabel && (
        <span className="text-sm text-neutral-300">
          {label}
        </span>
      )}
    </div>
  );
} 