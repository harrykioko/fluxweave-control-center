import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  id: string; // Make id required for accessibility
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, id, required, "aria-describedby": ariaDescribedby, ...props }, ref) => {
    // Generate unique IDs for error message
    const errorId = error ? `${id}-error` : undefined;
    
    // Combine aria-describedby values
    const describedBy = [ariaDescribedby, errorId].filter(Boolean).join(' ') || undefined;
    
    return (
      <div className="relative w-full">
        <input
          id={id}
          type={type}
          className={cn(
            "flex h-11 w-full rounded-lg border-subtle bg-surface px-4 py-2 text-base text-primary ring-offset-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            error && "border-error-500 focus-visible:ring-error-500/30",
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          aria-required={required}
          required={required}
          {...props}
        />
        
        {/* Required field indicator for visual users */}
        {required && (
          <span className="absolute right-3 top-3 text-error-500" aria-hidden="true">*</span>
        )}
        
        {/* Error message */}
        {error && (
          <div id={errorId} className="error-message mt-1 text-sm text-error-600" role="alert">
            {error}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
