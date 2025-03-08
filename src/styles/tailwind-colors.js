// Tailwind plugin to add our custom color system
const plugin = require('tailwindcss/plugin');

module.exports = plugin(function({ addUtilities }) {
  // Add custom utilities for our color system
  const colorUtilities = {
    // Background colors
    '.bg-base': {
      backgroundColor: 'var(--color-bg-base)',
    },
    '.bg-surface': {
      backgroundColor: 'var(--color-bg-surface)',
    },
    '.bg-surface-hover': {
      backgroundColor: 'var(--color-bg-surface-hover)',
    },
    '.bg-surface-active': {
      backgroundColor: 'var(--color-bg-surface-active)',
    },
    '.bg-elevated': {
      backgroundColor: 'var(--color-bg-elevated)',
    },
    '.bg-elevated-hover': {
      backgroundColor: 'var(--color-bg-elevated-hover)',
    },
    '.bg-elevated-active': {
      backgroundColor: 'var(--color-bg-elevated-active)',
    },
    '.bg-overlay': {
      backgroundColor: 'var(--color-bg-overlay)',
    },
    '.bg-overlay-hover': {
      backgroundColor: 'var(--color-bg-overlay-hover)',
    },
    '.bg-overlay-active': {
      backgroundColor: 'var(--color-bg-overlay-active)',
    },
    
    // Border colors
    '.border-subtle': {
      borderColor: 'var(--color-border-subtle)',
    },
    '.border-default': {
      borderColor: 'var(--color-border-default)',
    },
    '.border-prominent': {
      borderColor: 'var(--color-border-prominent)',
    },
    
    // Text colors
    '.text-primary': {
      color: 'var(--color-text-primary)',
    },
    '.text-secondary': {
      color: 'var(--color-text-secondary)',
    },
    '.text-tertiary': {
      color: 'var(--color-text-tertiary)',
    },
    '.text-disabled': {
      color: 'var(--color-text-disabled)',
    },
    
    // Status colors
    '.text-info': {
      color: 'var(--color-info)',
    },
    '.bg-info': {
      backgroundColor: 'var(--color-info-bg)',
    },
    '.border-info': {
      borderColor: 'var(--color-info-border)',
    },
    
    '.text-success': {
      color: 'var(--color-success)',
    },
    '.bg-success': {
      backgroundColor: 'var(--color-success-bg)',
    },
    '.border-success': {
      borderColor: 'var(--color-success-border)',
    },
    
    '.text-warning': {
      color: 'var(--color-warning)',
    },
    '.bg-warning': {
      backgroundColor: 'var(--color-warning-bg)',
    },
    '.border-warning': {
      borderColor: 'var(--color-warning-border)',
    },
    
    '.text-error': {
      color: 'var(--color-error)',
    },
    '.bg-error': {
      backgroundColor: 'var(--color-error-bg)',
    },
    '.border-error': {
      borderColor: 'var(--color-error-border)',
    },
    
    // Gradient
    '.bg-gradient': {
      backgroundImage: 'var(--color-gradient)',
    },
  };

  addUtilities(colorUtilities);
}); 