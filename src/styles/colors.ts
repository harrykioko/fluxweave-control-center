/**
 * FluxWeave Control Center - Color System
 * 
 * TypeScript definitions for the color system.
 * This file provides type-safe access to the color variables defined in colors.css.
 */

// Primary Colors (Purple)
export const primary = {
  50: 'var(--color-primary-50)',
  100: 'var(--color-primary-100)',
  200: 'var(--color-primary-200)',
  300: 'var(--color-primary-300)',
  400: 'var(--color-primary-400)',
  500: 'var(--color-primary-500)',
  600: 'var(--color-primary-600)',
  700: 'var(--color-primary-700)',
  800: 'var(--color-primary-800)',
  900: 'var(--color-primary-900)',
  950: 'var(--color-primary-950)',
};

// Secondary Colors (Magenta)
export const secondary = {
  50: 'var(--color-secondary-50)',
  100: 'var(--color-secondary-100)',
  200: 'var(--color-secondary-200)',
  300: 'var(--color-secondary-300)',
  400: 'var(--color-secondary-400)',
  500: 'var(--color-secondary-500)',
  600: 'var(--color-secondary-600)',
  700: 'var(--color-secondary-700)',
  800: 'var(--color-secondary-800)',
  900: 'var(--color-secondary-900)',
  950: 'var(--color-secondary-950)',
};

// Neutral Colors (Grayscale)
export const neutral = {
  50: 'var(--color-neutral-50)',
  100: 'var(--color-neutral-100)',
  200: 'var(--color-neutral-200)',
  300: 'var(--color-neutral-300)',
  400: 'var(--color-neutral-400)',
  500: 'var(--color-neutral-500)',
  600: 'var(--color-neutral-600)',
  700: 'var(--color-neutral-700)',
  800: 'var(--color-neutral-800)',
  900: 'var(--color-neutral-900)',
  950: 'var(--color-neutral-950)',
};

// Status Colors
export const info = {
  50: 'var(--color-info-50)',
  100: 'var(--color-info-100)',
  200: 'var(--color-info-200)',
  300: 'var(--color-info-300)',
  400: 'var(--color-info-400)',
  500: 'var(--color-info-500)',
  600: 'var(--color-info-600)',
  700: 'var(--color-info-700)',
  800: 'var(--color-info-800)',
  900: 'var(--color-info-900)',
};

export const success = {
  50: 'var(--color-success-50)',
  100: 'var(--color-success-100)',
  200: 'var(--color-success-200)',
  300: 'var(--color-success-300)',
  400: 'var(--color-success-400)',
  500: 'var(--color-success-500)',
  600: 'var(--color-success-600)',
  700: 'var(--color-success-700)',
  800: 'var(--color-success-800)',
  900: 'var(--color-success-900)',
};

export const warning = {
  50: 'var(--color-warning-50)',
  100: 'var(--color-warning-100)',
  200: 'var(--color-warning-200)',
  300: 'var(--color-warning-300)',
  400: 'var(--color-warning-400)',
  500: 'var(--color-warning-500)',
  600: 'var(--color-warning-600)',
  700: 'var(--color-warning-700)',
  800: 'var(--color-warning-800)',
  900: 'var(--color-warning-900)',
};

export const error = {
  50: 'var(--color-error-50)',
  100: 'var(--color-error-100)',
  200: 'var(--color-error-200)',
  300: 'var(--color-error-300)',
  400: 'var(--color-error-400)',
  500: 'var(--color-error-500)',
  600: 'var(--color-error-600)',
  700: 'var(--color-error-700)',
  800: 'var(--color-error-800)',
  900: 'var(--color-error-900)',
};

// Semantic Colors
export const text = {
  primary: 'var(--color-text-primary)',
  secondary: 'var(--color-text-secondary)',
  tertiary: 'var(--color-text-tertiary)',
  disabled: 'var(--color-text-disabled)',
  inverse: 'var(--color-text-inverse)',
  link: 'var(--color-text-link)',
  linkHover: 'var(--color-text-link-hover)',
};

export const bg = {
  surface: 'var(--color-bg-surface)',
  surfaceHover: 'var(--color-bg-surface-hover)',
  surfaceMuted: 'var(--color-bg-surface-muted)',
  elevated: 'var(--color-bg-elevated)',
  elevatedHover: 'var(--color-bg-elevated-hover)',
  overlay: 'var(--color-bg-overlay)',
  overlayHover: 'var(--color-bg-overlay-hover)',
  page: 'var(--color-bg-page)',
};

export const border = {
  default: 'var(--color-border-default)',
  subtle: 'var(--color-border-subtle)',
  focus: 'var(--color-border-focus)',
  error: 'var(--color-border-error)',
};

export const gradient = 'var(--color-gradient)';

export const shadow = {
  sm: 'var(--color-shadow-sm)',
  DEFAULT: 'var(--color-shadow)',
  md: 'var(--color-shadow-md)',
  lg: 'var(--color-shadow-lg)',
  xl: 'var(--color-shadow-xl)',
  '2xl': 'var(--color-shadow-2xl)',
  inner: 'var(--color-shadow-inner)',
  outline: 'var(--color-shadow-outline)',
};

// Export all colors as a single object
export const colors = {
  primary,
  secondary,
  neutral,
  info,
  success,
  warning,
  error,
  text,
  bg,
  border,
  gradient,
  shadow,
};

export default colors; 