import * as React from 'react';
import { FC, useState } from 'react';
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import { getAnimationClasses } from '@/hooks/useAnimation';
import { getTypography, getSpace, getBorderRadius } from '@/utils/tokenUtils';

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

  // Typography styles
  const titleStyles = getTypography('sans', 'sm', 'medium');
  const valueStyles = getTypography('sans', '2xl', 'bold');
  const changeStyles = getTypography('sans', 'sm', 'medium');
  const descriptionStyles = getTypography('sans', 'xs', 'normal');

  return (
    <Component
      id={id}
      className={cn(
        "glass-card",
        animationClasses,
        isPressed && 'scale-98',
        isInteractive && "focus-visible:ring-2 focus-visible:ring-primary-400 outline-none",
        className
      )}
      style={{
        padding: getSpace('6'),
        borderRadius: getBorderRadius('card'),
      }}
      {...accessibilityProps}
    >
      <div className="flex items-start justify-between">
        {icon && (
          <div 
            className={cn(
              "glass-sm transition-transform duration-medium ease-bounce"
            )}
            style={{
              padding: getSpace('3'),
              borderRadius: getBorderRadius('lg'),
            }}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
        <div className={cn("flex-1", icon ? `ml-${getSpace('4')}` : "")}>
          <h3 
            id={`${id}-title`} 
            className="text-secondary"
            style={{
              fontFamily: titleStyles.fontFamily,
              fontSize: titleStyles.fontSize,
              fontWeight: titleStyles.fontWeight,
              lineHeight: titleStyles.lineHeight,
              letterSpacing: titleStyles.letterSpacing,
            }}
          >
            {title}
          </h3>
          <p 
            className="text-primary transition-colors duration-fast" 
            aria-live="polite"
            style={{
              fontFamily: valueStyles.fontFamily,
              fontSize: valueStyles.fontSize,
              fontWeight: valueStyles.fontWeight,
              lineHeight: valueStyles.lineHeight,
              letterSpacing: valueStyles.letterSpacing,
              marginTop: getSpace('1'),
            }}
          >
            {value}
          </p>
          
          {change && (
            <div 
              style={{
                marginTop: getSpace('2'),
              }}
              className="flex items-center"
            >
              <span 
                className={cn(
                  "flex items-center transition-all duration-fast", 
                  change.isPositive ? "text-success-500" : "text-error-500"
                )}
                style={{
                  fontFamily: changeStyles.fontFamily,
                  fontSize: changeStyles.fontSize,
                  fontWeight: changeStyles.fontWeight,
                  lineHeight: changeStyles.lineHeight,
                  letterSpacing: changeStyles.letterSpacing,
                }}
                aria-live="polite"
              >
                {change.isPositive ? (
                  <>
                    <ArrowUp className="transition-transform duration-fast" 
                      style={{
                        width: getSpace('4'),
                        height: getSpace('4'),
                        marginRight: getSpace('1'),
                      }}
                      aria-hidden="true" 
                    />
                    <span className="sr-only">Increased by</span>
                  </>
                ) : (
                  <>
                    <ArrowDown className="transition-transform duration-fast" 
                      style={{
                        width: getSpace('4'),
                        height: getSpace('4'),
                        marginRight: getSpace('1'),
                      }}
                      aria-hidden="true" 
                    />
                    <span className="sr-only">Decreased by</span>
                  </>
                )}
                {change.value}
              </span>
              
              {description && (
                <span 
                  id={`${id}-desc`} 
                  className="text-tertiary transition-opacity duration-fast"
                  style={{
                    fontFamily: descriptionStyles.fontFamily,
                    fontSize: descriptionStyles.fontSize,
                    fontWeight: descriptionStyles.fontWeight,
                    lineHeight: descriptionStyles.lineHeight,
                    letterSpacing: descriptionStyles.letterSpacing,
                    marginLeft: getSpace('2'),
                  }}
                >
                  {description}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Component>
  );
};
