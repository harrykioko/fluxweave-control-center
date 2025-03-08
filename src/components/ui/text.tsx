import React from 'react';
import { cn } from '@/lib/utils';
import { getTypography } from '@/utils/tokenUtils';
import { FontFamily, FontSize, FontWeight, LineHeight, LetterSpacing } from '@/styles/tokens';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The HTML element to render
   * @default "p"
   */
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  
  /**
   * The font family to use
   * @default "sans"
   */
  family?: FontFamily;
  
  /**
   * The font size to use
   * @default "md"
   */
  size?: FontSize;
  
  /**
   * The font weight to use
   * @default "normal"
   */
  weight?: FontWeight;
  
  /**
   * The line height to use
   * @default "normal"
   */
  lineHeight?: LineHeight;
  
  /**
   * The letter spacing to use
   * @default "normal"
   */
  letterSpacing?: LetterSpacing;
  
  /**
   * Whether to truncate text with an ellipsis
   * @default false
   */
  truncate?: boolean;
  
  /**
   * The variant of the text
   * @default "default"
   */
  variant?: 'default' | 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error' | 'info';
}

/**
 * Text component with design token support
 */
export function Text({
  as: Component = 'p',
  family = 'sans',
  size = 'md',
  weight = 'normal',
  lineHeight = 'normal',
  letterSpacing = 'normal',
  truncate = false,
  variant = 'default',
  className,
  style,
  children,
  ...props
}: TextProps) {
  // Get typography styles
  const typographyStyles = getTypography(family, size, weight, lineHeight, letterSpacing);
  
  // Variant classes
  const variantClasses = {
    default: 'text-neutral-100',
    primary: 'text-primary-500',
    secondary: 'text-secondary-500',
    tertiary: 'text-neutral-400',
    success: 'text-success-500',
    warning: 'text-warning-500',
    error: 'text-error-500',
    info: 'text-info-500',
  };
  
  return (
    <Component
      className={cn(
        variantClasses[variant],
        truncate && 'truncate',
        className
      )}
      style={{
        fontFamily: typographyStyles.fontFamily,
        fontSize: typographyStyles.fontSize,
        fontWeight: typographyStyles.fontWeight,
        lineHeight: typographyStyles.lineHeight,
        letterSpacing: typographyStyles.letterSpacing,
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Heading component with design token support
 */
export function Heading({
  as = 'h2',
  size = '2xl',
  weight = 'bold',
  lineHeight = 'tight',
  ...props
}: TextProps) {
  return (
    <Text
      as={as as any}
      size={size}
      weight={weight}
      lineHeight={lineHeight}
      {...props}
    />
  );
}

/**
 * Paragraph component with design token support
 */
export function Paragraph({
  size = 'md',
  lineHeight = 'relaxed',
  ...props
}: TextProps) {
  return (
    <Text
      as="p"
      size={size}
      lineHeight={lineHeight}
      {...props}
    />
  );
}

/**
 * Label component with design token support
 */
export function Label({
  size = 'sm',
  weight = 'medium',
  ...props
}: TextProps) {
  return (
    <Text
      as="span"
      size={size}
      weight={weight}
      {...props}
    />
  );
}

/**
 * Caption component with design token support
 */
export function Caption({
  size = 'xs',
  variant = 'tertiary',
  ...props
}: TextProps) {
  return (
    <Text
      as="span"
      size={size}
      variant={variant}
      {...props}
    />
  );
} 