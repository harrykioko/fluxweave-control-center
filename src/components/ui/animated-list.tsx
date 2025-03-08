import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useStaggeredAnimation } from '@/hooks/useAnimation';

export interface AnimatedListProps {
  /**
   * The items to render in the list
   */
  items: React.ReactNode[];
  
  /**
   * The animation duration
   * @default "medium"
   */
  duration?: 'fast' | 'medium' | 'slow';
  
  /**
   * The animation easing function
   * @default "decelerate"
   */
  easing?: 'standard' | 'decelerate' | 'accelerate' | 'sharp' | 'bounce';
  
  /**
   * The delay between each item's animation
   * @default 50
   */
  staggerDelay?: number;
  
  /**
   * Whether to animate the list on mount
   * @default true
   */
  animateOnMount?: boolean;
  
  /**
   * The component to use for the list
   * @default "ul"
   */
  as?: 'ul' | 'ol' | 'div';
  
  /**
   * The component to use for list items
   * @default "li"
   */
  itemAs?: 'li' | 'div';
  
  /**
   * Additional class name for list items
   */
  itemClassName?: string;
  
  /**
   * Additional class name for the list container
   */
  className?: string;
  
  /**
   * Additional props to pass to the list container
   */
  [key: string]: any;
}

/**
 * AnimatedList component with staggered animations for list items
 */
export function AnimatedList({
  items,
  className,
  itemClassName,
  duration = 'medium',
  easing = 'decelerate',
  staggerDelay = 50,
  animateOnMount = true,
  as = 'ul',
  itemAs = 'li',
  ...props
}: AnimatedListProps) {
  // Use staggered animation hook
  const [itemStates, controls] = useStaggeredAnimation(items.length, {
    duration,
    easing,
    staggerDelay,
  });
  
  // Start animation on mount if enabled
  useEffect(() => {
    if (animateOnMount) {
      controls.start();
    }
  }, [animateOnMount, controls]);
  
  // Common props for list items
  const getItemProps = (index: number) => ({
    key: index,
    className: cn(
      'stagger-item',
      itemStates[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
      'transition-all',
      duration === 'fast' ? 'duration-fast' : duration === 'slow' ? 'duration-slow' : 'duration-medium',
      easing === 'standard' ? 'ease-standard' : 
      easing === 'decelerate' ? 'ease-decelerate' : 
      easing === 'accelerate' ? 'ease-accelerate' : 
      easing === 'sharp' ? 'ease-sharp' : 'ease-bounce',
      itemClassName
    ),
    style: { transitionDelay: `${index * staggerDelay}ms` }
  });
  
  // Render the appropriate component based on the 'as' prop
  if (as === 'ul') {
    return (
      <ul className={cn('stagger-container', className)} {...props}>
        {items.map((item, index) => 
          itemAs === 'li' ? (
            <li {...getItemProps(index)}>{item}</li>
          ) : (
            <div {...getItemProps(index)}>{item}</div>
          )
        )}
      </ul>
    );
  } else if (as === 'ol') {
    return (
      <ol className={cn('stagger-container', className)} {...props}>
        {items.map((item, index) => 
          itemAs === 'li' ? (
            <li {...getItemProps(index)}>{item}</li>
          ) : (
            <div {...getItemProps(index)}>{item}</div>
          )
        )}
      </ol>
    );
  } else {
    return (
      <div className={cn('stagger-container', className)} {...props}>
        {items.map((item, index) => 
          itemAs === 'li' ? (
            <li {...getItemProps(index)}>{item}</li>
          ) : (
            <div {...getItemProps(index)}>{item}</div>
          )
        )}
      </div>
    );
  }
} 