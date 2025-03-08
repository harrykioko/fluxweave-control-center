import React from 'react';
import { cn } from '@/lib/utils';
import { getSpace, getBorderRadius, getShadow } from '@/utils/tokenUtils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The variant of the card
   * @default "default"
   */
  variant?: 'default' | 'glass' | 'outline' | 'solid';
  
  /**
   * Whether the card is interactive (clickable)
   * @default false
   */
  interactive?: boolean;
  
  /**
   * The padding size to use
   * @default "card-padding"
   */
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'card-padding';
  
  /**
   * The border radius to use
   * @default "card"
   */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full' | 'card';
  
  /**
   * The shadow to use
   * @default "card"
   */
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'card';
  
  /**
   * Whether to apply a hover effect
   * @default false
   */
  hover?: boolean;
}

/**
 * Card component with design token support
 */
export function Card({
  variant = 'default',
  interactive = false,
  padding = 'card-padding',
  radius = 'card',
  shadow = 'card',
  hover = false,
  className,
  style,
  onClick,
  children,
  ...props
}: CardProps) {
  // Get spacing, border radius, and shadow values
  const paddingValue = padding === 'none' 
    ? '0' 
    : padding === 'xs' 
      ? '2' 
      : padding === 'sm' 
        ? '3' 
        : padding === 'md' 
          ? '4' 
          : padding === 'lg' 
            ? '5' 
            : padding === 'xl' 
              ? '6' 
              : 'card-padding';
  
  const paddingStyle = padding === 'none' ? {} : { padding: getSpace(paddingValue) };
  
  // Variant classes
  const variantClasses = {
    default: 'bg-neutral-800/50 border border-neutral-700/50',
    glass: 'glass-card',
    outline: 'bg-transparent border border-neutral-700/50',
    solid: 'bg-neutral-800 border border-neutral-700',
  };
  
  // Interactive classes
  const interactiveClasses = interactive
    ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900'
    : '';
  
  // Hover classes
  const hoverClasses = hover && interactive
    ? 'transition-all duration-medium ease-standard hover:translate-y-[-2px]'
    : '';
  
  return (
    <div
      className={cn(
        variantClasses[variant],
        interactiveClasses,
        hoverClasses,
        className
      )}
      style={{
        borderRadius: getBorderRadius(radius),
        boxShadow: getShadow(shadow),
        ...paddingStyle,
        ...style,
      }}
      onClick={interactive ? onClick : undefined}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? 'button' : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Card header component
 */
export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mb-4', className)}
      {...props}
    />
  );
}

/**
 * Card title component
 */
export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'text-xl font-semibold text-neutral-100',
        className
      )}
      {...props}
    />
  );
}

/**
 * Card description component
 */
export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        'text-sm text-neutral-400',
        className
      )}
      {...props}
    />
  );
}

/**
 * Card content component
 */
export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(className)}
      {...props}
    />
  );
}

/**
 * Card footer component
 */
export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mt-4 flex items-center', className)}
      {...props}
    />
  );
}
