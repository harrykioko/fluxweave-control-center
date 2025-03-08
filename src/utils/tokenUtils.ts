/**
 * Utility functions for working with design tokens
 */
import tokens from '@/styles/tokens';

/**
 * Get a typography token value
 * 
 * @param family Font family token
 * @param size Font size token
 * @param weight Font weight token
 * @param lineHeight Line height token
 * @param letterSpacing Letter spacing token
 * @returns Object with CSS properties for the typography token
 */
export function getTypography(
  family: keyof typeof tokens.typography.fontFamilies,
  size: keyof typeof tokens.typography.fontSizes,
  weight: keyof typeof tokens.typography.fontWeights,
  lineHeight: keyof typeof tokens.typography.lineHeights = 'normal',
  letterSpacing: keyof typeof tokens.typography.letterSpacings = 'normal'
) {
  return {
    fontFamily: tokens.typography.fontFamilies[family],
    fontSize: tokens.typography.fontSizes[size],
    fontWeight: tokens.typography.fontWeights[weight],
    lineHeight: tokens.typography.lineHeights[lineHeight],
    letterSpacing: tokens.typography.letterSpacings[letterSpacing],
  };
}

/**
 * Get a spacing token value
 * 
 * @param space Spacing token
 * @returns CSS value for the spacing token
 */
export function getSpace(space: keyof typeof tokens.spacing.spaces | keyof typeof tokens.spacing.semanticSpaces) {
  // Check if it's a semantic space
  if (space in tokens.spacing.semanticSpaces) {
    return tokens.spacing.semanticSpaces[space as keyof typeof tokens.spacing.semanticSpaces];
  }
  
  // Otherwise, it's a regular space
  return tokens.spacing.spaces[space as keyof typeof tokens.spacing.spaces];
}

/**
 * Get a border radius token value
 * 
 * @param radius Border radius token
 * @returns CSS value for the border radius token
 */
export function getBorderRadius(radius: keyof typeof tokens.borders.borderRadii | keyof typeof tokens.borders.semanticBorderRadii) {
  // Check if it's a semantic border radius
  if (radius in tokens.borders.semanticBorderRadii) {
    return tokens.borders.semanticBorderRadii[radius as keyof typeof tokens.borders.semanticBorderRadii];
  }
  
  // Otherwise, it's a regular border radius
  return tokens.borders.borderRadii[radius as keyof typeof tokens.borders.borderRadii];
}

/**
 * Get a shadow token value
 * 
 * @param shadow Shadow token
 * @returns CSS value for the shadow token
 */
export function getShadow(
  shadow: 
    | keyof typeof tokens.shadows.shadows 
    | keyof typeof tokens.shadows.glassShadows 
    | keyof typeof tokens.shadows.elevations 
    | keyof typeof tokens.shadows.semanticElevations
) {
  // Check if it's a semantic elevation
  if (shadow in tokens.shadows.semanticElevations) {
    return tokens.shadows.semanticElevations[shadow as keyof typeof tokens.shadows.semanticElevations];
  }
  
  // Check if it's an elevation
  if (shadow in tokens.shadows.elevations) {
    return tokens.shadows.elevations[shadow as keyof typeof tokens.shadows.elevations];
  }
  
  // Check if it's a glass shadow
  if (shadow in tokens.shadows.glassShadows) {
    return tokens.shadows.glassShadows[shadow as keyof typeof tokens.shadows.glassShadows];
  }
  
  // Otherwise, it's a regular shadow
  return tokens.shadows.shadows[shadow as keyof typeof tokens.shadows.shadows];
}

/**
 * Get a z-index token value
 * 
 * @param zIndex Z-index token
 * @returns CSS value for the z-index token
 */
export function getZIndex(zIndex: keyof typeof tokens.zIndices.zIndices | keyof typeof tokens.zIndices.semanticZIndices) {
  // Check if it's a semantic z-index
  if (zIndex in tokens.zIndices.semanticZIndices) {
    return tokens.zIndices.semanticZIndices[zIndex as keyof typeof tokens.zIndices.semanticZIndices];
  }
  
  // Otherwise, it's a regular z-index
  return tokens.zIndices.zIndices[zIndex as keyof typeof tokens.zIndices.zIndices];
}

/**
 * Create a CSS variable reference
 * 
 * @param name CSS variable name (without the -- prefix)
 * @returns CSS variable reference
 */
export function cssVar(name: string) {
  return `var(--${name})`;
}

/**
 * Create a responsive style object
 * 
 * @param property CSS property name
 * @param defaultValue Default value
 * @param breakpoints Breakpoint values
 * @returns Object with responsive styles
 */
export function responsive<T>(
  property: string,
  defaultValue: T,
  breakpoints?: {
    sm?: T;
    md?: T;
    lg?: T;
    xl?: T;
    '2xl'?: T;
  }
) {
  const styles: Record<string, any> = {
    [property]: defaultValue,
  };
  
  if (breakpoints) {
    if (breakpoints.sm) {
      styles['@media (min-width: 640px)'] = {
        [property]: breakpoints.sm,
      };
    }
    
    if (breakpoints.md) {
      styles['@media (min-width: 768px)'] = {
        [property]: breakpoints.md,
      };
    }
    
    if (breakpoints.lg) {
      styles['@media (min-width: 1024px)'] = {
        [property]: breakpoints.lg,
      };
    }
    
    if (breakpoints.xl) {
      styles['@media (min-width: 1280px)'] = {
        [property]: breakpoints.xl,
      };
    }
    
    if (breakpoints['2xl']) {
      styles['@media (min-width: 1536px)'] = {
        [property]: breakpoints['2xl'],
      };
    }
  }
  
  return styles;
}

export default {
  getTypography,
  getSpace,
  getBorderRadius,
  getShadow,
  getZIndex,
  cssVar,
  responsive,
}; 