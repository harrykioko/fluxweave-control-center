import * as React from "react";
import { cn } from "@/lib/utils";

interface SkipLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * The target element ID to skip to
   */
  targetId: string;
  /**
   * Optional custom text for the skip link
   */
  text?: string;
}

/**
 * SkipLink component allows keyboard users to bypass navigation and jump directly to main content
 * It's visually hidden until focused, making it accessible only to keyboard users
 */
export function SkipLink({
  targetId,
  text = "Skip to main content",
  className,
  ...props
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        "skip-link",
        "fixed top-0 left-0 z-50 p-3 -translate-y-full bg-primary-600 text-white rounded-br-md transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2",
        className
      )}
      {...props}
    >
      {text}
    </a>
  );
}

/**
 * SkipLinkTarget component creates an accessible target for skip links
 */
export function SkipLinkTarget({
  id,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      id={id}
      tabIndex={-1}
      className={cn("outline-none", className)}
      {...props}
    />
  );
} 