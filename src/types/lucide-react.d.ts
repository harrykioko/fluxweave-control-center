import * as React from 'react';

declare module 'lucide-react' {
  export interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
  }
  
  export type Icon = React.ComponentType<IconProps>;
  
  // Common icons used in the project
  export const CalendarIcon: Icon;
  export const ChevronLeft: Icon;
  export const ChevronRight: Icon;
  export const ChevronDown: Icon;
  export const MessageSquare: Icon;
  export const CalendarDays: Icon;
} 