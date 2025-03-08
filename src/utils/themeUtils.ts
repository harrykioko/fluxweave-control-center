/**
 * Theme utilities for FluxWeave Control Center
 * 
 * This file provides utilities for managing theme preferences
 * including dark mode, light mode, and system preference.
 */

type ThemeMode = 'dark' | 'light' | 'system';

/**
 * Get the current theme from localStorage or system preference
 */
export const getThemePreference = (): ThemeMode => {
  // Check if theme is stored in localStorage
  const storedTheme = localStorage.getItem('theme') as ThemeMode | null;
  
  if (storedTheme && (storedTheme === 'dark' || storedTheme === 'light' || storedTheme === 'system')) {
    return storedTheme;
  }
  
  // Default to system preference
  return 'system';
};

/**
 * Set the theme preference and apply it
 */
export const setThemePreference = (theme: ThemeMode): void => {
  // Store the preference
  localStorage.setItem('theme', theme);
  
  // Apply the theme
  applyTheme(theme);
};

/**
 * Apply the theme to the document
 */
export const applyTheme = (theme: ThemeMode): void => {
  const root = document.documentElement;
  
  // Remove existing theme classes
  root.classList.remove('dark', 'light');
  
  if (theme === 'system') {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply system preference, but don't add the class
    // This will let the CSS media query handle it
    if (prefersDark) {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }
  } else {
    // Apply the specified theme
    root.classList.add(theme);
  }
};

/**
 * Initialize theme based on stored preference
 * Call this function when the application loads
 */
export const initializeTheme = (): void => {
  const theme = getThemePreference();
  applyTheme(theme);
  
  // Listen for system preference changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Initial check
  if (theme === 'system') {
    applyTheme('system');
  }
  
  // Add listener for changes
  mediaQuery.addEventListener('change', () => {
    if (getThemePreference() === 'system') {
      applyTheme('system');
    }
  });
};

/**
 * Toggle between dark and light mode
 */
export const toggleDarkMode = (): void => {
  const currentTheme = getThemePreference();
  
  if (currentTheme === 'dark') {
    setThemePreference('light');
  } else {
    setThemePreference('dark');
  }
};

/**
 * Check if dark mode is currently active
 */
export const isDarkMode = (): boolean => {
  return document.documentElement.classList.contains('dark');
}; 