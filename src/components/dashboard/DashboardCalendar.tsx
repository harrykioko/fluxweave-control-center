import * as React from 'react';
import { FC, useState } from 'react';
import { CalendarIcon, Clock } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { getSpace, getBorderRadius, getTypography, getShadow } from '@/utils/tokenUtils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Sample event data - in a real app, this would come from an API
const EVENTS = [
  {
    id: 1,
    title: 'Team Meeting',
    time: '3:00 PM - 4:00 PM',
    color: 'var(--color-primary-600)'
  },
  {
    id: 2,
    title: 'Product Review',
    time: '5:00 PM - 6:00 PM',
    color: 'var(--color-info-500)'
  },
  {
    id: 3,
    title: 'Client Call',
    time: 'Tomorrow, 10:00 AM',
    color: 'var(--color-success-500)'
  }
];

export const DashboardCalendar: FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Typography styles
  const titleStyles = getTypography('sans', 'xl', 'bold');
  const subtitleStyles = getTypography('sans', 'md', 'medium');
  const eventTitleStyles = getTypography('sans', 'sm', 'medium');
  const eventTimeStyles = getTypography('sans', 'xs', 'normal');

  return (
    <Card
      variant="glass"
      shadow="card"
      style={{
        height: '435px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardHeader>
        <CardTitle
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: getSpace('2')
          }}
        >
          <CalendarIcon 
            style={{
              width: getSpace('5'),
              height: getSpace('5')
            }}
          />
          Calendar
        </CardTitle>
      </CardHeader>
      
      <CardContent
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          gap: getSpace('4')
        }}
      >
        <div
          className="glass-sm"
          style={{
            padding: getSpace('3'),
            borderRadius: getBorderRadius('lg'),
            boxShadow: getShadow('sm')
          }}
        >
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
        
        <div
          style={{
            marginTop: 'auto'
          }}
        >
          <h3
            style={{
              fontFamily: subtitleStyles.fontFamily,
              fontSize: subtitleStyles.fontSize,
              fontWeight: subtitleStyles.fontWeight,
              lineHeight: subtitleStyles.lineHeight,
              letterSpacing: subtitleStyles.letterSpacing,
              marginBottom: getSpace('2')
            }}
            className="text-primary"
          >
            Upcoming Events
          </h3>
          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: getSpace('2')
            }}
          >
            {EVENTS.map((event) => (
              <div
                key={event.id}
                className="glass-sm hover:glass-hover transition-all duration-fast"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: getSpace('2'),
                  padding: getSpace('2'),
                  borderRadius: getBorderRadius('md'),
                  cursor: 'pointer'
                }}
              >
                <div
                  style={{
                    width: getSpace('1'),
                    height: getSpace('6'),
                    backgroundColor: event.color,
                    borderRadius: getBorderRadius('full')
                  }}
                />
                
                <div>
                  <p
                    className="text-primary"
                    style={{
                      fontFamily: eventTitleStyles.fontFamily,
                      fontSize: eventTitleStyles.fontSize,
                      fontWeight: eventTitleStyles.fontWeight,
                      lineHeight: eventTitleStyles.lineHeight,
                      letterSpacing: eventTitleStyles.letterSpacing
                    }}
                  >
                    {event.title}
                  </p>
                  
                  <p
                    className="text-secondary flex items-center gap-1"
                    style={{
                      fontFamily: eventTimeStyles.fontFamily,
                      fontSize: eventTimeStyles.fontSize,
                      fontWeight: eventTimeStyles.fontWeight,
                      lineHeight: eventTimeStyles.lineHeight,
                      letterSpacing: eventTimeStyles.letterSpacing
                    }}
                  >
                    <Clock 
                      style={{
                        width: getSpace('3'),
                        height: getSpace('3')
                      }}
                    />
                    {event.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
