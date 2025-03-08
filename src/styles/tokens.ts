/**
 * FluxWeave Design Tokens
 * TypeScript definitions for the design token system
 */

// --------------------------------
// Typography
// --------------------------------

export type FontFamily = 'sans' | 'mono' | 'display';

export type FontSize = 
  | '2xs' 
  | 'xs' 
  | 'sm' 
  | 'md' 
  | 'lg' 
  | 'xl' 
  | '2xl' 
  | '3xl' 
  | '4xl' 
  | '5xl' 
  | '6xl';

export type LineHeight = 
  | 'none' 
  | 'tight' 
  | 'snug' 
  | 'normal' 
  | 'relaxed' 
  | 'loose';

export type FontWeight = 
  | 'thin' 
  | 'extralight' 
  | 'light' 
  | 'normal' 
  | 'medium' 
  | 'semibold' 
  | 'bold' 
  | 'extrabold' 
  | 'black';

export type LetterSpacing = 
  | 'tighter' 
  | 'tight' 
  | 'normal' 
  | 'wide' 
  | 'wider' 
  | 'widest';

export const fontFamilies: Record<FontFamily, string> = {
  sans: 'var(--font-family-sans)',
  mono: 'var(--font-family-mono)',
  display: 'var(--font-family-display)',
};

export const fontSizes: Record<FontSize, string> = {
  '2xs': 'var(--font-size-2xs)',
  'xs': 'var(--font-size-xs)',
  'sm': 'var(--font-size-sm)',
  'md': 'var(--font-size-md)',
  'lg': 'var(--font-size-lg)',
  'xl': 'var(--font-size-xl)',
  '2xl': 'var(--font-size-2xl)',
  '3xl': 'var(--font-size-3xl)',
  '4xl': 'var(--font-size-4xl)',
  '5xl': 'var(--font-size-5xl)',
  '6xl': 'var(--font-size-6xl)',
};

export const lineHeights: Record<LineHeight, string> = {
  none: 'var(--line-height-none)',
  tight: 'var(--line-height-tight)',
  snug: 'var(--line-height-snug)',
  normal: 'var(--line-height-normal)',
  relaxed: 'var(--line-height-relaxed)',
  loose: 'var(--line-height-loose)',
};

export const fontWeights: Record<FontWeight, string> = {
  thin: 'var(--font-weight-thin)',
  extralight: 'var(--font-weight-extralight)',
  light: 'var(--font-weight-light)',
  normal: 'var(--font-weight-normal)',
  medium: 'var(--font-weight-medium)',
  semibold: 'var(--font-weight-semibold)',
  bold: 'var(--font-weight-bold)',
  extrabold: 'var(--font-weight-extrabold)',
  black: 'var(--font-weight-black)',
};

export const letterSpacings: Record<LetterSpacing, string> = {
  tighter: 'var(--letter-spacing-tighter)',
  tight: 'var(--letter-spacing-tight)',
  normal: 'var(--letter-spacing-normal)',
  wide: 'var(--letter-spacing-wide)',
  wider: 'var(--letter-spacing-wider)',
  widest: 'var(--letter-spacing-widest)',
};

// --------------------------------
// Spacing
// --------------------------------

export type Space = 
  | '0'
  | 'px'
  | '0.5'
  | '1'
  | '1.5'
  | '2'
  | '2.5'
  | '3'
  | '3.5'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '14'
  | '16'
  | '20'
  | '24'
  | '28'
  | '32'
  | '36'
  | '40'
  | '44'
  | '48'
  | '52'
  | '56'
  | '60'
  | '64'
  | '72'
  | '80'
  | '96';

export type SemanticSpace = 
  | 'page-padding'
  | 'section-gap'
  | 'component-padding'
  | 'component-gap'
  | 'input-padding'
  | 'button-padding'
  | 'card-padding'
  | 'inline-element-gap'
  | 'stacked-element-gap';

export const spaces: Record<Space, string> = {
  '0': 'var(--space-0)',
  'px': 'var(--space-px)',
  '0.5': 'var(--space-0-5)',
  '1': 'var(--space-1)',
  '1.5': 'var(--space-1-5)',
  '2': 'var(--space-2)',
  '2.5': 'var(--space-2-5)',
  '3': 'var(--space-3)',
  '3.5': 'var(--space-3-5)',
  '4': 'var(--space-4)',
  '5': 'var(--space-5)',
  '6': 'var(--space-6)',
  '7': 'var(--space-7)',
  '8': 'var(--space-8)',
  '9': 'var(--space-9)',
  '10': 'var(--space-10)',
  '11': 'var(--space-11)',
  '12': 'var(--space-12)',
  '14': 'var(--space-14)',
  '16': 'var(--space-16)',
  '20': 'var(--space-20)',
  '24': 'var(--space-24)',
  '28': 'var(--space-28)',
  '32': 'var(--space-32)',
  '36': 'var(--space-36)',
  '40': 'var(--space-40)',
  '44': 'var(--space-44)',
  '48': 'var(--space-48)',
  '52': 'var(--space-52)',
  '56': 'var(--space-56)',
  '60': 'var(--space-60)',
  '64': 'var(--space-64)',
  '72': 'var(--space-72)',
  '80': 'var(--space-80)',
  '96': 'var(--space-96)',
};

export const semanticSpaces: Record<SemanticSpace, string> = {
  'page-padding': 'var(--space-page-padding)',
  'section-gap': 'var(--space-section-gap)',
  'component-padding': 'var(--space-component-padding)',
  'component-gap': 'var(--space-component-gap)',
  'input-padding': 'var(--space-input-padding)',
  'button-padding': 'var(--space-button-padding)',
  'card-padding': 'var(--space-card-padding)',
  'inline-element-gap': 'var(--space-inline-element-gap)',
  'stacked-element-gap': 'var(--space-stacked-element-gap)',
};

// --------------------------------
// Borders
// --------------------------------

export type BorderWidth = '0' | '1' | '2' | '4' | '8';

export type BorderRadius = 
  | 'none' 
  | 'sm' 
  | 'md' 
  | 'lg' 
  | 'xl' 
  | '2xl' 
  | '3xl' 
  | 'full';

export type SemanticBorderRadius = 
  | 'button' 
  | 'input' 
  | 'card' 
  | 'badge' 
  | 'panel' 
  | 'avatar';

export const borderWidths: Record<BorderWidth, string> = {
  '0': 'var(--border-width-0)',
  '1': 'var(--border-width-1)',
  '2': 'var(--border-width-2)',
  '4': 'var(--border-width-4)',
  '8': 'var(--border-width-8)',
};

export const borderRadii: Record<BorderRadius, string> = {
  'none': 'var(--border-radius-none)',
  'sm': 'var(--border-radius-sm)',
  'md': 'var(--border-radius-md)',
  'lg': 'var(--border-radius-lg)',
  'xl': 'var(--border-radius-xl)',
  '2xl': 'var(--border-radius-2xl)',
  '3xl': 'var(--border-radius-3xl)',
  'full': 'var(--border-radius-full)',
};

export const semanticBorderRadii: Record<SemanticBorderRadius, string> = {
  'button': 'var(--border-radius-button)',
  'input': 'var(--border-radius-input)',
  'card': 'var(--border-radius-card)',
  'badge': 'var(--border-radius-badge)',
  'panel': 'var(--border-radius-panel)',
  'avatar': 'var(--border-radius-avatar)',
};

// --------------------------------
// Shadows & Elevations
// --------------------------------

export type Shadow = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner' | 'none';

export type GlassShadow = 'sm' | 'md' | 'lg';

export type Elevation = '1' | '2' | '3' | '4' | '5';

export type SemanticElevation = 
  | 'dropdown' 
  | 'card' 
  | 'card-hover' 
  | 'modal' 
  | 'popover' 
  | 'tooltip';

export const shadows: Record<Shadow, string> = {
  'sm': 'var(--shadow-sm)',
  'md': 'var(--shadow-md)',
  'lg': 'var(--shadow-lg)',
  'xl': 'var(--shadow-xl)',
  '2xl': 'var(--shadow-2xl)',
  'inner': 'var(--shadow-inner)',
  'none': 'var(--shadow-none)',
};

export const glassShadows: Record<GlassShadow, string> = {
  'sm': 'var(--shadow-glass-sm)',
  'md': 'var(--shadow-glass-md)',
  'lg': 'var(--shadow-glass-lg)',
};

export const elevations: Record<Elevation, string> = {
  '1': 'var(--elevation-1)',
  '2': 'var(--elevation-2)',
  '3': 'var(--elevation-3)',
  '4': 'var(--elevation-4)',
  '5': 'var(--elevation-5)',
};

export const semanticElevations: Record<SemanticElevation, string> = {
  'dropdown': 'var(--elevation-dropdown)',
  'card': 'var(--elevation-card)',
  'card-hover': 'var(--elevation-card-hover)',
  'modal': 'var(--elevation-modal)',
  'popover': 'var(--elevation-popover)',
  'tooltip': 'var(--elevation-tooltip)',
};

// --------------------------------
// Z-Index
// --------------------------------

export type ZIndex = 'negative' | '0' | '1' | '2' | '3' | '4' | '5' | 'max';

export type SemanticZIndex = 
  | 'background' 
  | 'base' 
  | 'dropdown' 
  | 'sticky' 
  | 'fixed' 
  | 'modal' 
  | 'popover' 
  | 'toast' 
  | 'tooltip';

export const zIndices: Record<ZIndex, string> = {
  'negative': 'var(--z-index-negative)',
  '0': 'var(--z-index-0)',
  '1': 'var(--z-index-1)',
  '2': 'var(--z-index-2)',
  '3': 'var(--z-index-3)',
  '4': 'var(--z-index-4)',
  '5': 'var(--z-index-5)',
  'max': 'var(--z-index-max)',
};

export const semanticZIndices: Record<SemanticZIndex, string> = {
  'background': 'var(--z-index-background)',
  'base': 'var(--z-index-base)',
  'dropdown': 'var(--z-index-dropdown)',
  'sticky': 'var(--z-index-sticky)',
  'fixed': 'var(--z-index-fixed)',
  'modal': 'var(--z-index-modal)',
  'popover': 'var(--z-index-popover)',
  'toast': 'var(--z-index-toast)',
  'tooltip': 'var(--z-index-tooltip)',
};

// --------------------------------
// Combined Exports
// --------------------------------

export const tokens = {
  typography: {
    fontFamilies,
    fontSizes,
    lineHeights,
    fontWeights,
    letterSpacings,
  },
  spacing: {
    spaces,
    semanticSpaces,
  },
  borders: {
    borderWidths,
    borderRadii,
    semanticBorderRadii,
  },
  shadows: {
    shadows,
    glassShadows,
    elevations,
    semanticElevations,
  },
  zIndices: {
    zIndices,
    semanticZIndices,
  },
};

export default tokens; 