import { useState, useEffect, useCallback, useRef } from 'react';

type AnimationTiming = 'fast' | 'medium' | 'slow';
type AnimationEasing = 'standard' | 'decelerate' | 'accelerate' | 'sharp' | 'bounce';

interface AnimationOptions {
  duration?: AnimationTiming;
  easing?: AnimationEasing;
  delay?: number;
  onComplete?: () => void;
}

interface AnimationControls {
  start: () => void;
  stop: () => void;
  reset: () => void;
  isAnimating: boolean;
}

/**
 * Hook for managing animations in React components
 * 
 * @param initialState - Whether the animation should start in the animated state
 * @param options - Animation configuration options
 * @returns Animation controls and current animation state
 */
export function useAnimation(
  initialState = false,
  options: AnimationOptions = {}
): [boolean, AnimationControls] {
  const [isAnimating, setIsAnimating] = useState(initialState);
  const timeoutRef = useRef<number | null>(null);
  const { duration = 'medium', delay = 0, onComplete } = options;

  // Convert duration string to milliseconds
  const getDurationMs = useCallback(() => {
    const durationMap = {
      fast: 150,
      medium: 300,
      slow: 500,
    };
    return durationMap[duration];
  }, [duration]);

  // Clear any existing timeout
  const clearAnimationTimeout = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Start the animation
  const start = useCallback(() => {
    clearAnimationTimeout();
    setIsAnimating(true);
    
    if (onComplete) {
      const durationMs = getDurationMs();
      timeoutRef.current = window.setTimeout(() => {
        onComplete();
      }, durationMs + delay);
    }
  }, [clearAnimationTimeout, getDurationMs, delay, onComplete]);

  // Stop the animation
  const stop = useCallback(() => {
    clearAnimationTimeout();
    setIsAnimating(false);
  }, [clearAnimationTimeout]);

  // Reset the animation
  const reset = useCallback(() => {
    clearAnimationTimeout();
    setIsAnimating(false);
    
    // Small delay to ensure DOM updates before restarting
    timeoutRef.current = window.setTimeout(() => {
      setIsAnimating(true);
    }, 10);
  }, [clearAnimationTimeout]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearAnimationTimeout();
    };
  }, [clearAnimationTimeout]);

  return [
    isAnimating,
    { start, stop, reset, isAnimating }
  ];
}

/**
 * Hook for creating staggered animations for lists
 * 
 * @param itemCount - Number of items to animate
 * @param options - Animation configuration options
 * @returns Array of boolean values indicating whether each item should be animated
 */
export function useStaggeredAnimation(
  itemCount: number,
  options: AnimationOptions & { staggerDelay?: number } = {}
): [boolean[], AnimationControls] {
  const { staggerDelay = 50, ...animationOptions } = options;
  const [isAnimating, controls] = useAnimation(false, animationOptions);
  const [itemStates, setItemStates] = useState<boolean[]>(Array(itemCount).fill(false));

  useEffect(() => {
    if (!isAnimating) {
      setItemStates(Array(itemCount).fill(false));
      return;
    }

    // Animate items with staggered delay
    const timeouts: number[] = [];
    
    for (let i = 0; i < itemCount; i++) {
      const timeout = window.setTimeout(() => {
        setItemStates(prev => {
          const newState = [...prev];
          newState[i] = true;
          return newState;
        });
      }, i * staggerDelay);
      
      timeouts.push(timeout);
    }

    return () => {
      timeouts.forEach(timeout => window.clearTimeout(timeout));
    };
  }, [isAnimating, itemCount, staggerDelay]);

  return [itemStates, controls];
}

/**
 * Hook for creating loading state animations
 * 
 * @param isLoading - Whether the component is in a loading state
 * @param options - Animation configuration options
 * @returns Animation state and class name for the loading animation
 */
export function useLoadingAnimation(
  isLoading: boolean,
  options: { type?: 'pulse' | 'spin' | 'shimmer' } = {}
): { isAnimating: boolean; className: string } {
  const { type = 'pulse' } = options;
  const [isAnimating, setIsAnimating] = useState(isLoading);
  
  useEffect(() => {
    if (isLoading) {
      setIsAnimating(true);
    } else {
      // Small delay before stopping animation to allow for transitions
      const timeout = window.setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      
      return () => {
        window.clearTimeout(timeout);
      };
    }
  }, [isLoading]);
  
  const getAnimationClass = () => {
    if (!isAnimating) return '';
    
    switch (type) {
      case 'pulse':
        return 'animate-pulse';
      case 'spin':
        return 'animate-spin';
      case 'shimmer':
        return 'animate-shimmer';
      default:
        return 'animate-pulse';
    }
  };
  
  return {
    isAnimating,
    className: getAnimationClass()
  };
}

/**
 * Hook for creating transition animations when components mount/unmount
 * 
 * @param show - Whether the component should be shown
 * @param options - Animation configuration options
 * @returns Whether the component should be rendered and its animation classes
 */
export function useTransitionAnimation(
  show: boolean,
  options: AnimationOptions & { 
    type?: 'fade' | 'slide-up' | 'slide-down' | 'scale';
    unmountOnExit?: boolean;
  } = {}
): { shouldRender: boolean; className: string } {
  const { 
    type = 'fade', 
    duration = 'medium',
    unmountOnExit = true 
  } = options;
  
  const [shouldRender, setShouldRender] = useState(show);
  const [animationClass, setAnimationClass] = useState('');
  const prevShowRef = useRef(show);
  
  useEffect(() => {
    if (show && !shouldRender) {
      // Mount component before animation starts
      setShouldRender(true);
    }
    
    // Handle animation classes
    if (show !== prevShowRef.current) {
      if (show) {
        // Enter animation
        setAnimationClass(`${type}-enter ${type}-enter-active`);
      } else {
        // Exit animation
        setAnimationClass(`${type}-exit ${type}-exit-active`);
        
        if (unmountOnExit) {
          // Unmount after animation completes
          const durationMs = duration === 'fast' ? 150 : duration === 'slow' ? 500 : 300;
          const timeout = window.setTimeout(() => {
            setShouldRender(false);
          }, durationMs);
          
          return () => {
            window.clearTimeout(timeout);
          };
        }
      }
      
      prevShowRef.current = show;
    }
  }, [show, shouldRender, type, duration, unmountOnExit]);
  
  return {
    shouldRender,
    className: animationClass
  };
}

/**
 * Get CSS classes for animation based on options
 * 
 * @param options - Animation configuration options
 * @returns CSS class string for the animation
 */
export function getAnimationClasses(options: {
  transition?: 'all' | 'transform' | 'opacity' | 'colors';
  duration?: AnimationTiming;
  easing?: AnimationEasing;
  hover?: 'scale' | 'elevate' | boolean;
}): string {
  const { 
    transition = 'all', 
    duration, 
    easing,
    hover
  } = options;
  
  const classes: string[] = [];
  
  // Add transition class
  classes.push(`transition-${transition}`);
  
  // Add duration class if specified
  if (duration) {
    classes.push(`duration-${duration}`);
  }
  
  // Add easing class if specified
  if (easing) {
    classes.push(`ease-${easing}`);
  }
  
  // Add hover effect if specified
  if (hover) {
    if (hover === true) {
      classes.push('hover-scale');
    } else {
      classes.push(`hover-${hover}`);
    }
  }
  
  return classes.join(' ');
} 