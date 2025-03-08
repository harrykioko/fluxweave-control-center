import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { getAnimationClasses } from '@/hooks/useAnimation';

export interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The animation effect to apply on hover
   * @default "scale"
   */
  hoverEffect?: 'scale' | 'elevate' | 'none';
  
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
   * Whether the card is interactive (clickable)
   * @default false
   */
  interactive?: boolean;
  
  /**
   * The variant of the card
   * @default "default"
   */
  variant?: 'default' | 'glass' | 'outline' | 'solid';
}

/**
 * AnimatedCard component with configurable animations
 */
export function AnimatedCard({
  children,
  className,
  hoverEffect = 'scale',
  duration = 'medium',
  easing = 'standard',
  interactive = false,
  variant = 'default',
  onClick,
  ...props
}: AnimatedCardProps) {
  const [isPressed, setIsPressed] = useState(false);
  
  // Get animation classes
  const animationClasses = getAnimationClasses({
    transition: 'all',
    duration,
    easing,
    hover: hoverEffect !== 'none' ? hoverEffect : false,
  });
  
  // Variant classes
  const variantClasses = {
    default: 'bg-neutral-800/50 border border-neutral-700/50',
    glass: 'glass-card',
    outline: 'bg-transparent border border-neutral-700/50',
    solid: 'bg-neutral-800 border border-neutral-700',
  };
  
  // Handle mouse down for pressed state
  const handleMouseDown = () => {
    if (interactive) {
      setIsPressed(true);
    }
  };
  
  // Handle mouse up for pressed state
  const handleMouseUp = () => {
    if (interactive) {
      setIsPressed(false);
    }
  };
  
  return (
    <div
      className={cn(
        'rounded-xl p-4',
        variantClasses[variant],
        animationClasses,
        isPressed && 'scale-98',
        interactive && 'cursor-pointer',
        className
      )}
      onClick={interactive ? onClick : undefined}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
} 