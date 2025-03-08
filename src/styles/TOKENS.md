# FluxWeave Design Token System

This document outlines the design token system implemented in the FluxWeave Control Center. Design tokens are the visual design atoms of the design system — specifically, they are named entities that store visual design attributes.

## Overview

Our design token system follows these principles:

1. **Consistent**: All visual attributes are defined as tokens to ensure consistency across the application.
2. **Scalable**: Tokens are organized in a hierarchical structure, from primitive to semantic tokens.
3. **Maintainable**: Changes to the design system can be made by updating tokens rather than changing individual components.
4. **Typed**: All tokens have TypeScript definitions for type safety and developer experience.

## Token Categories

Our design token system includes the following categories:

- **Typography**: Font families, sizes, weights, line heights, and letter spacing
- **Spacing**: Margins, paddings, and gaps
- **Borders**: Border widths and radii
- **Shadows & Elevations**: Box shadows and elevation levels
- **Z-Index**: Stacking order values

## Implementation

The design token system is implemented in two main files:

- `src/styles/tokens.css`: CSS custom properties (variables) for all tokens
- `src/styles/tokens.ts`: TypeScript definitions and exports for all tokens

Additionally, utility functions are provided in `src/utils/tokenUtils.ts` to make it easier to use tokens in components.

## Typography Tokens

### Font Families

```css
--font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
--font-family-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
--font-family-display: var(--font-family-sans);
```

### Font Sizes

```css
--font-size-2xs: 0.625rem;   /* 10px */
--font-size-xs: 0.75rem;     /* 12px */
--font-size-sm: 0.875rem;    /* 14px */
--font-size-md: 1rem;        /* 16px */
--font-size-lg: 1.125rem;    /* 18px */
--font-size-xl: 1.25rem;     /* 20px */
--font-size-2xl: 1.5rem;     /* 24px */
--font-size-3xl: 1.875rem;   /* 30px */
--font-size-4xl: 2.25rem;    /* 36px */
--font-size-5xl: 3rem;       /* 48px */
--font-size-6xl: 3.75rem;    /* 60px */
```

### Line Heights

```css
--line-height-none: 1;       /* 100% */
--line-height-tight: 1.25;   /* 125% */
--line-height-snug: 1.375;   /* 137.5% */
--line-height-normal: 1.5;   /* 150% */
--line-height-relaxed: 1.625;/* 162.5% */
--line-height-loose: 2;      /* 200% */
```

### Font Weights

```css
--font-weight-thin: 100;
--font-weight-extralight: 200;
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;
--font-weight-black: 900;
```

### Letter Spacing

```css
--letter-spacing-tighter: -0.05em;
--letter-spacing-tight: -0.025em;
--letter-spacing-normal: 0em;
--letter-spacing-wide: 0.025em;
--letter-spacing-wider: 0.05em;
--letter-spacing-widest: 0.1em;
```

## Spacing Tokens

Our spacing system follows an 8-point grid (with some exceptions for finer control).

```css
--space-0: 0;
--space-px: 1px;
--space-0-5: 0.125rem;  /* 2px */
--space-1: 0.25rem;     /* 4px */
--space-1-5: 0.375rem;  /* 6px */
--space-2: 0.5rem;      /* 8px */
--space-2-5: 0.625rem;  /* 10px */
--space-3: 0.75rem;     /* 12px */
--space-3-5: 0.875rem;  /* 14px */
--space-4: 1rem;        /* 16px */
--space-5: 1.25rem;     /* 20px */
--space-6: 1.5rem;      /* 24px */
--space-7: 1.75rem;     /* 28px */
--space-8: 2rem;        /* 32px */
/* ... and so on */
```

### Semantic Spacing

We also provide semantic spacing tokens for specific use cases:

```css
--space-page-padding: var(--space-6);
--space-section-gap: var(--space-12);
--space-component-padding: var(--space-4);
--space-component-gap: var(--space-3);
--space-input-padding: var(--space-2) var(--space-3);
--space-button-padding: var(--space-2) var(--space-4);
--space-card-padding: var(--space-5);
--space-inline-element-gap: var(--space-2);
--space-stacked-element-gap: var(--space-4);
```

## Border Tokens

### Border Widths

```css
--border-width-0: 0px;
--border-width-1: 1px;
--border-width-2: 2px;
--border-width-4: 4px;
--border-width-8: 8px;
```

### Border Radius

```css
--border-radius-none: 0;
--border-radius-sm: 0.125rem;   /* 2px */
--border-radius-md: 0.25rem;    /* 4px */
--border-radius-lg: 0.5rem;     /* 8px */
--border-radius-xl: 0.75rem;    /* 12px */
--border-radius-2xl: 1rem;      /* 16px */
--border-radius-3xl: 1.5rem;    /* 24px */
--border-radius-full: 9999px;
```

### Semantic Border Radius

```css
--border-radius-button: var(--border-radius-lg);
--border-radius-input: var(--border-radius-md);
--border-radius-card: var(--border-radius-xl);
--border-radius-badge: var(--border-radius-full);
--border-radius-panel: var(--border-radius-2xl);
--border-radius-avatar: var(--border-radius-full);
```

## Shadow & Elevation Tokens

### Base Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
--shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
--shadow-none: none;
```

### Glassmorphism Shadows

```css
--shadow-glass-sm: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
--shadow-glass-md: 0 8px 16px 0 rgba(0, 0, 0, 0.12);
--shadow-glass-lg: 0 16px 24px 0 rgba(0, 0, 0, 0.16);
```

### Elevation Levels

```css
--elevation-1: var(--shadow-sm);
--elevation-2: var(--shadow-md);
--elevation-3: var(--shadow-lg);
--elevation-4: var(--shadow-xl);
--elevation-5: var(--shadow-2xl);
```

### Semantic Elevations

```css
--elevation-dropdown: var(--elevation-2);
--elevation-card: var(--elevation-1);
--elevation-card-hover: var(--elevation-2);
--elevation-modal: var(--elevation-4);
--elevation-popover: var(--elevation-2);
--elevation-tooltip: var(--elevation-1);
```

## Z-Index Tokens

```css
--z-index-negative: -1;
--z-index-0: 0;
--z-index-1: 10;
--z-index-2: 20;
--z-index-3: 30;
--z-index-4: 40;
--z-index-5: 50;
--z-index-max: 9999;
```

### Semantic Z-Index

```css
--z-index-background: var(--z-index-negative);
--z-index-base: var(--z-index-0);
--z-index-dropdown: var(--z-index-1);
--z-index-sticky: var(--z-index-2);
--z-index-fixed: var(--z-index-3);
--z-index-modal: var(--z-index-4);
--z-index-popover: var(--z-index-4);
--z-index-toast: var(--z-index-5);
--z-index-tooltip: var(--z-index-5);
```

## Using Tokens in TypeScript

The design token system provides TypeScript types and constants for all tokens:

```typescript
import tokens from '@/styles/tokens';

// Access typography tokens
const fontFamily = tokens.typography.fontFamilies.sans;
const fontSize = tokens.typography.fontSizes.md;
const fontWeight = tokens.typography.fontWeights.bold;

// Access spacing tokens
const space = tokens.spacing.spaces['4'];
const semanticSpace = tokens.spacing.semanticSpaces['card-padding'];

// Access border tokens
const borderRadius = tokens.borders.borderRadii.lg;
const semanticBorderRadius = tokens.borders.semanticBorderRadii.button;

// Access shadow tokens
const shadow = tokens.shadows.shadows.md;
const elevation = tokens.shadows.elevations['2'];
const semanticElevation = tokens.shadows.semanticElevations.card;

// Access z-index tokens
const zIndex = tokens.zIndices.zIndices['3'];
const semanticZIndex = tokens.zIndices.semanticZIndices.modal;
```

## Utility Functions

The `tokenUtils.ts` file provides utility functions to make it easier to use tokens in components:

### getTypography

```typescript
import { getTypography } from '@/utils/tokenUtils';

// Get typography styles for a heading
const headingStyles = getTypography('sans', '2xl', 'bold', 'tight');
// Returns: { fontFamily: '...', fontSize: '...', fontWeight: '...', lineHeight: '...', letterSpacing: '...' }
```

### getSpace

```typescript
import { getSpace } from '@/utils/tokenUtils';

// Get a spacing value
const padding = getSpace('4');
// Returns: 'var(--space-4)'

// Get a semantic spacing value
const cardPadding = getSpace('card-padding');
// Returns: 'var(--space-card-padding)'
```

### getBorderRadius

```typescript
import { getBorderRadius } from '@/utils/tokenUtils';

// Get a border radius value
const radius = getBorderRadius('lg');
// Returns: 'var(--border-radius-lg)'

// Get a semantic border radius value
const buttonRadius = getBorderRadius('button');
// Returns: 'var(--border-radius-button)'
```

### getShadow

```typescript
import { getShadow } from '@/utils/tokenUtils';

// Get a shadow value
const shadow = getShadow('md');
// Returns: 'var(--shadow-md)'

// Get an elevation value
const elevation = getShadow('2');
// Returns: 'var(--elevation-2)'

// Get a semantic elevation value
const cardShadow = getShadow('card');
// Returns: 'var(--elevation-card)'
```

### getZIndex

```typescript
import { getZIndex } from '@/utils/tokenUtils';

// Get a z-index value
const zIndex = getZIndex('3');
// Returns: 'var(--z-index-3)'

// Get a semantic z-index value
const modalZIndex = getZIndex('modal');
// Returns: 'var(--z-index-modal)'
```

### cssVar

```typescript
import { cssVar } from '@/utils/tokenUtils';

// Create a CSS variable reference
const color = cssVar('color-primary-500');
// Returns: 'var(--color-primary-500)'
```

### responsive

```typescript
import { responsive } from '@/utils/tokenUtils';

// Create responsive styles
const fontSize = responsive('fontSize', '1rem', {
  md: '1.25rem',
  lg: '1.5rem',
});
// Returns: { fontSize: '1rem', '@media (min-width: 768px)': { fontSize: '1.25rem' }, '@media (min-width: 1024px)': { fontSize: '1.5rem' } }
```

## Responsive Design

The design token system supports responsive design through media queries:

```css
@media (max-width: 640px) {
  :root {
    /* Mobile-specific adjustments */
    --space-page-padding: var(--space-4);
    --space-section-gap: var(--space-8);
    --space-card-padding: var(--space-4);
  }
}
```

## Accessibility

The design token system respects user preferences for reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    /* Disable animations and transitions for users who prefer reduced motion */
    --animation-duration-fast: 0.01ms;
    --animation-duration-medium: 0.01ms;
    --animation-duration-slow: 0.01ms;
  }
}
```

## Best Practices

1. **Always use tokens**: Avoid hardcoding values in your components. Use tokens for all visual attributes.
2. **Use semantic tokens**: When available, prefer semantic tokens over primitive tokens.
3. **Use utility functions**: Use the provided utility functions to access tokens in TypeScript.
4. **Respect responsive design**: Use responsive tokens for different screen sizes.
5. **Consider accessibility**: Ensure your design respects user preferences for reduced motion and other accessibility settings.

## Extending the System

When extending the design token system:

1. Add new tokens to `src/styles/tokens.css`
2. Add corresponding TypeScript types and constants to `src/styles/tokens.ts`
3. Update utility functions in `src/utils/tokenUtils.ts` if needed
4. Document the new tokens in this file 