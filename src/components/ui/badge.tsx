import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary-600 text-white hover:bg-primary-700",
        secondary:
          "border-transparent bg-secondary-600 text-white hover:bg-secondary-700",
        destructive:
          "border-transparent bg-error-500 text-white hover:bg-error-600",
        outline: "text-primary border-default",
        success: "border-transparent bg-success-500 text-white hover:bg-success-600",
        warning: "border-transparent bg-warning-500 text-white hover:bg-warning-600",
        info: "border-transparent bg-info-500 text-white hover:bg-info-600",
        ghost: "border-transparent bg-surface text-primary hover:bg-surface-hover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge: React.FC<BadgeProps> = ({ className, variant, ...props }) => {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
