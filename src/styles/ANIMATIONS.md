# Animation System for FluxWeave Control Center

This document outlines the animation system implemented in the FluxWeave Control Center design system. The animation system provides consistent motion across the application, enhancing user experience and providing visual feedback.

## Core Principles

Our animation system follows these core principles:

1. **Purposeful**: Animations should serve a purpose, such as guiding attention, providing feedback, or enhancing understanding.
2. **Consistent**: Animations should be consistent across the application, using standardized durations, easings, and effects.
3. **Performant**: Animations should be optimized for performance, using GPU-accelerated properties when possible.
4. **Accessible**: Animations should respect user preferences, including reduced motion settings.

## Animation Durations

We define three standard durations for animations:

| Duration | Value | Use Case |
|----------|-------|----------|
| Fast     | 150ms | Micro-interactions, button states, hover effects |
| Medium   | 300ms | Standard transitions, component animations |
| Slow     | 500ms | Complex animations, page transitions |

These durations are defined as CSS custom properties:

```css
--animation-duration-fast: 150ms;
--animation-duration-medium: 300ms;
--animation-duration-slow: 500ms;
```

## Easing Functions

We use specific easing functions to create natural and pleasing animations:

| Easing | Function | Use Case |
|--------|----------|----------|
| Standard | cubic-bezier(0.4, 0, 0.2, 1) | General animations |
| Decelerate | cubic-bezier(0, 0, 0.2, 1) | Elements entering the screen |
| Accelerate | cubic-bezier(0.4, 0, 1, 1) | Elements exiting the screen |
| Sharp | cubic-bezier(0.4, 0, 0.6, 1) | Emphasized animations |
| Bounce | cubic-bezier(0.34, 1.56, 0.64, 1) | Playful animations with slight overshoot |

These easing functions are defined as CSS custom properties:

```css
--animation-easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
--animation-easing-decelerate: cubic-bezier(0, 0, 0.2, 1);
--animation-easing-accelerate: cubic-bezier(0.4, 0, 1, 1);
--animation-easing-sharp: cubic-bezier(0.4, 0, 0.6, 1);
--animation-easing-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
```

## Transition Utilities

The animation system provides utility classes for common transitions:

| Class | Properties | Description |
|-------|------------|-------------|
| `.transition-all` | all | Transitions all properties |
| `.transition-transform` | transform | Transitions only transform properties |
| `.transition-opacity` | opacity | Transitions only opacity |
| `.transition-colors` | background-color, border-color, color, fill, stroke | Transitions only color properties |

Duration and easing modifiers can be combined with these classes:

```html
<div class="transition-transform duration-fast ease-bounce">
  <!-- Content -->
</div>
```

## State Transitions

The animation system includes predefined animations for common state transitions:

| Class | Effect | Description |
|-------|--------|-------------|
| `.hover-scale` | Scale on hover | Slightly scales up on hover, down on active |
| `.hover-elevate` | Elevation on hover | Lifts element and adds shadow on hover |

## Loading Animations

The animation system provides animations for loading states:

| Class | Effect | Description |
|-------|--------|-------------|
| `.animate-pulse` | Opacity pulsing | Pulses opacity for loading states |
| `.animate-spin` | Rotation | Spins elements (like loading spinners) |
| `.animate-shimmer` | Gradient movement | Creates a shimmering effect for skeletons |

## Page Transitions

The animation system includes classes for page transitions using React Transition Group:

| Class Pair | Effect | Description |
|------------|--------|-------------|
| `.fade-enter` / `.fade-exit` | Fade | Fades elements in/out |
| `.slide-up-enter` / `.slide-up-exit` | Slide up | Slides elements up while fading |

## Staggered Animations

The animation system supports staggered animations for lists:

```html
<ul class="stagger-container">
  <li class="stagger-item">Item 1</li>
  <li class="stagger-item">Item 2</li>
  <li class="stagger-item">Item 3</li>
</ul>
```

## React Hooks

The animation system includes React hooks for more complex animations:

| Hook | Purpose | Description |
|------|---------|-------------|
| `useAnimation` | General animations | Controls animation states |
| `useStaggeredAnimation` | Staggered animations | Animates lists with staggered delays |
| `useLoadingAnimation` | Loading states | Manages loading animation states |
| `useTransitionAnimation` | Mount/unmount transitions | Handles component transitions |

Example usage:

```jsx
const [isAnimating, controls] = useAnimation(false, {
  duration: 'medium',
  easing: 'bounce',
  onComplete: () => console.log('Animation complete')
});

// Start animation
controls.start();
```

## Accessibility

The animation system respects user preferences for reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Components

The animation system includes pre-built animated components:

| Component | Purpose | Description |
|-----------|---------|-------------|
| `Spinner` | Loading indicator | Configurable loading spinner |
| `AnimatedCard` | Interactive card | Card with configurable animations |
| `AnimatedList` | List animations | List with staggered item animations |

Example usage:

```jsx
<AnimatedCard
  hoverEffect="scale"
  duration="medium"
  easing="bounce"
  interactive
>
  Card content
</AnimatedCard>
```

## Best Practices

1. **Use animations purposefully**: Animations should enhance the user experience, not distract from it.
2. **Keep it simple**: Use the simplest animation that achieves the desired effect.
3. **Maintain consistency**: Use the standard durations and easings for similar interactions.
4. **Optimize performance**: Prefer animating `transform` and `opacity` properties for better performance.
5. **Consider accessibility**: Always provide a way for users to disable animations if needed.
6. **Test on different devices**: Ensure animations work well on both high and low-end devices.

## Implementation Guidelines

When implementing animations:

1. Use CSS custom properties for durations and easings
2. Use utility classes for simple animations
3. Use React hooks for complex animations
4. Always respect user preferences for reduced motion
5. Test animations on different devices and browsers 