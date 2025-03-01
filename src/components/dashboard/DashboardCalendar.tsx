
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

export function DashboardCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 sm:p-6 shadow-lg h-[435px]">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <CalendarIcon className="h-5 w-5 mr-2" />
        Calendar
      </h2>
      <div className="flex flex-col h-[calc(100%-2rem)]">
        <div className="bg-white/5 border border-white/20 rounded-lg p-3 mb-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="text-white"
          />
        </div>
        
        <div className="mt-auto">
          <h3 className="font-medium text-white mb-2">Upcoming Events</h3>
          <div className="space-y-2">
            {[1, 2].map((event) => (
              <div key={event} className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded">
                <div className="w-1 h-full min-h-[24px] bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-sm text-white">Team Meeting</p>
                  <p className="text-xs text-slate-300">3:00 PM - 4:00 PM</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
