import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { getSpace, getBorderRadius } from '@/utils/tokenUtils'

// Define token-based values for use in the component
const buttonBorderRadius = getBorderRadius('button');
const buttonPaddingDefault = getSpace('button-padding');
const buttonPaddingSm = `${getSpace('2')} ${getSpace('3')}`;
const buttonPaddingLg = `${getSpace('3')} ${getSpace('8')}`;

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary-600 text-white hover:bg-primary-700",
        destructive:
          "bg-error-500 text-white hover:bg-error-600",
        outline:
          "border border-default bg-surface hover:bg-surface-hover hover:text-primary",
        secondary:
          "bg-secondary-600 text-white hover:bg-secondary-700",
        ghost: "hover:bg-surface hover:text-primary",
        link: "text-primary-600 underline-offset-4 hover:underline",
        glass: "backdrop-blur-md bg-surface hover:bg-surface-hover text-primary",
        gradient: "bg-gradient text-white hover:shadow-lg",
      },
      size: {
        default: "h-11",
        sm: "h-9",
        lg: "h-12",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Apply token-based styles
    const buttonStyle: React.CSSProperties = {
      borderRadius: buttonBorderRadius,
      ...style
    }
    
    // Add padding based on size (except for icon buttons)
    if (size !== 'icon') {
      if (size === 'sm') {
        buttonStyle.padding = buttonPaddingSm;
      } else if (size === 'lg') {
        buttonStyle.padding = buttonPaddingLg;
      } else {
        buttonStyle.padding = buttonPaddingDefault;
      }
    }
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        style={buttonStyle}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
