# FluxWeave Control Center - Design System

This directory contains the design system for the FluxWeave Control Center application. The design system provides a consistent and accessible visual language across the application.

## Files

- `colors.css`: Contains all color variables as CSS custom properties
- `colors.ts`: TypeScript definitions for the color system (for use in JavaScript/TypeScript)
- `effects.css`: Contains standardized effects like glassmorphism

## Color System

### Usage

#### In CSS/Tailwind

```css
.my-element {
  color: var(--color-text-primary);
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
}
```

#### In Tailwind Classes

```html
<div class="text-primary bg-surface border-default">
  <!-- Content -->
</div>
```

#### In JavaScript/TypeScript

```typescript
import { colors } from '@/styles/colors';

// Use in styled-components or other CSS-in-JS libraries
const StyledComponent = styled.div`
  color: ${colors.text.primary};
  background-color: ${colors.bg.surface};
`;
```

### Color Categories

#### Base Colors

- **Primary Colors (Purple)**: Main brand colors
- **Secondary Colors (Magenta)**: Complementary brand colors
- **Neutral Colors (Grayscale)**: Neutral colors for text, backgrounds, etc.

#### Status Colors

- **Info (Blue)**: For informational messages and notifications
- **Success (Green)**: For successful actions and positive states
- **Warning (Yellow/Orange)**: For warnings and actions requiring attention
- **Error (Red)**: For errors and destructive actions

#### Semantic Colors

- **Text Colors**: For text elements
- **Background Colors**: For backgrounds
- **Border Colors**: For borders
- **Gradient**: For gradient backgrounds

## Effects System

The effects system provides standardized visual effects that can be applied consistently across the application.

### Glassmorphism Effects

Glassmorphism is a key visual style in our application. We provide several utility classes to create consistent glass effects:

#### Basic Glass Surfaces

- `.glass-sm`: Light blur effect with 30% opacity
- `.glass-md`: Medium blur effect with 40% opacity
- `.glass-lg`: Strong blur effect with 50% opacity
- `.glass-xl`: Extra strong blur effect with 60% opacity

#### Component-Specific Glass Effects

- `.glass-card`: For content containers and cards
- `.glass-panel`: For larger sections and panels
- `.glass-navbar`: Optimized for navigation bars
- `.glass-button`: For interactive elements
- `.glass-input`: For form elements
- `.glass-modal`: For dialogs and popovers
- `.glass-sidebar`: For side navigation
- `.glass-tooltip`: For tooltips and small popovers

#### Interactive Glass Effects

- `.glass-hover`: Adds hover effects to glass elements
- `.glass-active`: Adds active/pressed effects to glass elements
- `.glass-glow`: Adds a glowing border effect on hover

### Usage Examples

```html
<!-- Basic card with glass effect -->
<div class="glass-card p-6">
  <h2 class="text-xl font-bold">Card Title</h2>
  <p>Card content goes here</p>
</div>

<!-- Interactive button with glass effect -->
<button class="glass-button glass-hover glass-active px-4 py-2">
  Click Me
</button>

<!-- Glass panel with glow effect -->
<div class="glass-panel glass-glow p-8">
  <h2 class="text-2xl font-bold">Panel Title</h2>
  <p>Panel content goes here</p>
</div>
```

## Dark Mode

The color and effects systems support dark mode through CSS custom properties. Dark mode can be toggled by adding the `.dark` class to the `<html>` element.

### Toggling Dark Mode

You can use the `ThemeToggle` component to allow users to switch between light, dark, and system themes:

```tsx
import { ThemeToggle } from '@/components/ui/theme-toggle';

function Header() {
  return (
    <header>
      <ThemeToggle />
    </header>
  );
}
```

### Programmatically Toggling Dark Mode

You can also toggle dark mode programmatically using the theme utilities:

```typescript
import { setThemePreference, toggleDarkMode, isDarkMode } from '@/utils/themeUtils';

// Set theme to dark
setThemePreference('dark');

// Toggle between dark and light
toggleDarkMode();

// Check if dark mode is active
if (isDarkMode()) {
  // Do something
}
```

## Accessibility

The design system is designed with accessibility in mind:

- All text colors maintain at least a 4.5:1 contrast ratio against their backgrounds
- Interactive elements don't rely solely on color to convey information
- All interactive elements have visible focus states
- The color palette is designed to be distinguishable for users with color vision deficiencies

## Best Practices

1. **Use semantic color variables** instead of direct color values
2. **Use standardized effect classes** instead of custom backdrop-blur and transparency values
3. **Maintain contrast** between text and background
4. **Be consistent** in your use of colors and effects
5. **Consider accessibility** when using colors and effects
6. **Use color and effects purposefully** to convey meaning and guide users 