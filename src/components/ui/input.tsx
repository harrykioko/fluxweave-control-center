import * as React from "react"
import { cn } from "@/lib/utils"
import { getSpace, getBorderRadius, getTypography } from '@/utils/tokenUtils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  id: string; // Make id required for accessibility
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, id, required, "aria-describedby": ariaDescribedby, style, ...props }, ref) => {
    // Generate unique IDs for error message
    const errorId = error ? `${id}-error` : undefined;
    
    // Combine aria-describedby values
    const describedBy = [ariaDescribedby, errorId].filter(Boolean).join(' ') || undefined;
    
    // Get typography styles
    const inputStyles = getTypography('sans', 'md', 'normal');
    const errorStyles = getTypography('sans', 'sm', 'normal');
    
    // Get token values
    const inputBorderRadius = getBorderRadius('input');
    const inputPadding = getSpace('input-padding');
    
    return (
      <div className="relative w-full">
        <input
          id={id}
          type={type}
          className={cn(
            "flex h-11 w-full border-subtle bg-surface transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-error-500 focus-visible:ring-error-500/30",
            className
          )}
          style={{
            borderRadius: inputBorderRadius,
            padding: inputPadding,
            fontFamily: inputStyles.fontFamily,
            fontSize: inputStyles.fontSize,
            fontWeight: inputStyles.fontWeight,
            lineHeight: inputStyles.lineHeight,
            letterSpacing: inputStyles.letterSpacing,
            ...style
          }}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          aria-required={required}
          required={required}
          {...props}
        />
        
        {/* Required field indicator for visual users */}
        {required && (
          <span 
            className="absolute text-error-500" 
            aria-hidden="true"
            style={{
              right: getSpace('3'),
              top: getSpace('3')
            }}
          >*</span>
        )}
        
        {/* Error message */}
        {error && (
          <div 
            id={errorId} 
            className="error-message text-error-600" 
            role="alert"
            style={{
              marginTop: getSpace('1'),
              fontFamily: errorStyles.fontFamily,
              fontSize: errorStyles.fontSize,
              fontWeight: errorStyles.fontWeight,
              lineHeight: errorStyles.lineHeight,
              letterSpacing: errorStyles.letterSpacing
            }}
          >
            {error}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
