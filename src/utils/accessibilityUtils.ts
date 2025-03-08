/**
 * FluxWeave Control Center - Accessibility Utilities
 * 
 * This file provides utility functions for implementing ARIA attributes and roles
 * to enhance accessibility throughout the application.
 */

/**
 * Generate props for a button element that uses a div or other non-button element
 * @param onClick - The click handler function
 * @param label - Accessible label for the button
 * @param isDisabled - Whether the button is disabled
 * @returns Props object with appropriate ARIA attributes
 */
export const getButtonProps = (
  onClick: () => void,
  label: string,
  isDisabled = false
) => {
  return {
    role: 'button',
    tabIndex: isDisabled ? -1 : 0,
    'aria-label': label,
    'aria-disabled': isDisabled,
    onClick: isDisabled ? undefined : onClick,
    onKeyDown: isDisabled
      ? undefined
      : (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        },
  };
};

/**
 * Generate props for a toggle button
 * @param isPressed - Whether the button is in a pressed state
 * @param onClick - The click handler function
 * @param label - Accessible label for the button
 * @param isDisabled - Whether the button is disabled
 * @returns Props object with appropriate ARIA attributes
 */
export const getToggleButtonProps = (
  isPressed: boolean,
  onClick: () => void,
  label: string,
  isDisabled = false
) => {
  return {
    ...getButtonProps(onClick, label, isDisabled),
    'aria-pressed': isPressed,
  };
};

/**
 * Generate props for an expandable section
 * @param isExpanded - Whether the section is expanded
 * @param onClick - The click handler function
 * @param controlsId - ID of the element being controlled
 * @param label - Accessible label for the button
 * @returns Props object with appropriate ARIA attributes
 */
export const getExpandableProps = (
  isExpanded: boolean,
  onClick: () => void,
  controlsId: string,
  label: string
) => {
  return {
    ...getButtonProps(onClick, label),
    'aria-expanded': isExpanded,
    'aria-controls': controlsId,
  };
};

/**
 * Generate props for a tab
 * @param isSelected - Whether the tab is selected
 * @param onClick - The click handler function
 * @param controlsId - ID of the panel being controlled
 * @param label - Accessible label for the tab
 * @param index - Index of the tab in the tablist
 * @returns Props object with appropriate ARIA attributes
 */
export const getTabProps = (
  isSelected: boolean,
  onClick: () => void,
  controlsId: string,
  label: string,
  index: number
) => {
  return {
    role: 'tab',
    tabIndex: isSelected ? 0 : -1,
    'aria-selected': isSelected,
    'aria-controls': controlsId,
    id: `tab-${controlsId}`,
    onClick,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    },
  };
};

/**
 * Generate props for a tab panel
 * @param isSelected - Whether the panel is selected
 * @param id - ID of the panel
 * @param labelledBy - ID of the tab that labels this panel
 * @returns Props object with appropriate ARIA attributes
 */
export const getTabPanelProps = (
  isSelected: boolean,
  id: string,
  labelledBy: string
) => {
  return {
    role: 'tabpanel',
    id,
    'aria-labelledby': labelledBy,
    tabIndex: 0,
    hidden: !isSelected,
  };
};

/**
 * Generate props for a modal dialog
 * @param isOpen - Whether the dialog is open
 * @param titleId - ID of the element containing the dialog title
 * @param descriptionId - ID of the element containing the dialog description (optional)
 * @returns Props object with appropriate ARIA attributes
 */
export const getDialogProps = (
  isOpen: boolean,
  titleId: string,
  descriptionId?: string
) => {
  return {
    role: 'dialog',
    'aria-modal': true,
    'aria-labelledby': titleId,
    'aria-describedby': descriptionId,
    'aria-hidden': !isOpen,
  };
};

/**
 * Generate props for a form input
 * @param id - ID of the input
 * @param labelId - ID of the label element
 * @param isRequired - Whether the input is required
 * @param isInvalid - Whether the input has an invalid value
 * @param errorId - ID of the element containing the error message (if any)
 * @returns Props object with appropriate ARIA attributes
 */
export const getInputProps = (
  id: string,
  labelId: string,
  isRequired = false,
  isInvalid = false,
  errorId?: string
) => {
  return {
    id,
    'aria-labelledby': labelId,
    'aria-required': isRequired,
    'aria-invalid': isInvalid,
    'aria-errormessage': isInvalid && errorId ? errorId : undefined,
    required: isRequired,
  };
};

/**
 * Generate props for a live region that announces dynamic content changes
 * @param politeness - The politeness level of the announcement
 * @returns Props object with appropriate ARIA attributes
 */
export const getLiveRegionProps = (politeness: 'polite' | 'assertive' = 'polite') => {
  return {
    'aria-live': politeness,
    'aria-atomic': true,
  };
};

/**
 * Generate props for a tooltip
 * @param id - ID of the tooltip
 * @returns Props object with appropriate ARIA attributes
 */
export const getTooltipProps = (id: string) => {
  return {
    role: 'tooltip',
    id,
  };
};

/**
 * Generate props for an element that triggers a tooltip
 * @param tooltipId - ID of the tooltip element
 * @returns Props object with appropriate ARIA attributes
 */
export const getTooltipTriggerProps = (tooltipId: string) => {
  return {
    'aria-describedby': tooltipId,
  };
};

/**
 * Generate props for a menu
 * @param id - ID of the menu
 * @returns Props object with appropriate ARIA attributes
 */
export const getMenuProps = (id: string) => {
  return {
    role: 'menu',
    id,
  };
};

/**
 * Generate props for a menu item
 * @param onClick - The click handler function
 * @param isDisabled - Whether the item is disabled
 * @returns Props object with appropriate ARIA attributes
 */
export const getMenuItemProps = (
  onClick: () => void,
  isDisabled = false
) => {
  return {
    role: 'menuitem',
    tabIndex: isDisabled ? -1 : 0,
    'aria-disabled': isDisabled,
    onClick: isDisabled ? undefined : onClick,
    onKeyDown: isDisabled
      ? undefined
      : (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        },
  };
}; 