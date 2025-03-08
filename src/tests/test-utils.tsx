import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

// Add custom jest matchers
expect.extend(toHaveNoViolations);

// Define a custom render function that includes providers if needed
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  return render(ui, { ...options });
};

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override the render method
export { customRender as render };

// Export axe for accessibility testing
export { axe };

// Helper function to test component accessibility
export async function testComponentAccessibility(component: ReactElement) {
  const { container } = render(component);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
  return results;
} 