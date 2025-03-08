import * as React from 'react';
import { FC, useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

declare module 'lucide-react' {
  import { ComponentType, SVGProps } from 'react';
  
  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
  }
  
  export type Icon = ComponentType<IconProps>;
  
  export const CalendarIcon: Icon;
  // Add other icons you use from lucide-react
}

export const DashboardCalendar: FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="bg-overlay backdrop-blur-xl border-default rounded-xl p-4 sm:p-6 shadow-lg h-[435px]">
      <h2 className="text-xl font-bold text-primary mb-4 flex items-center">
        <CalendarIcon className="h-5 w-5 mr-2" />
        Calendar
      </h2>
      <div className="flex flex-col h-[calc(100%-2rem)]">
        <div className="bg-elevated border-default rounded-lg p-3 mb-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className={cn(
              "text-primary",
              // Override calendar styles for better visibility
              "[&_.rdp-day]:text-primary [&_.rdp-day_button]:hover:bg-surface-hover",
              "[&_.rdp-day_button]:focus:bg-surface-active",
              "[&_.rdp-day_button.rdp-day_selected]:bg-primary-600",
              "[&_.rdp-day_button.rdp-day_selected]:hover:bg-primary-700",
              "[&_.rdp-head_cell]:text-secondary",
              "[&_.rdp-caption_label]:text-primary",
              "[&_.rdp-nav_button]:text-secondary [&_.rdp-nav_button]:hover:text-primary",
              "[&_.rdp-nav_button]:hover:bg-surface-hover [&_.rdp-nav_button]:border-subtle"
            )}
          />
        </div>
        
        <div className="mt-auto">
          <h3 className="font-medium text-primary mb-2">Upcoming Events</h3>
          <div className="space-y-2">
            {[1, 2].map((event) => (
              <div key={event} className="flex items-center gap-2 p-2 bg-surface border-subtle rounded hover:bg-surface-hover transition-colors">
                <div className="w-1 h-full min-h-[24px] bg-primary-600 rounded-full"></div>
                <div>
                  <p className="font-medium text-sm text-primary">Team Meeting</p>
                  <p className="text-xs text-secondary">3:00 PM - 4:00 PM</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
