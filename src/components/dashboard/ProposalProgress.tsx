
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

// Mock data for proposal tracking
const PROPOSAL_METRICS = [
  { title: "Proposals sent", value: 64, color: "bg-slate-300" },
  { title: "Interviews", value: 12, color: "bg-orange-500" },
  { title: "Hires", value: 10, color: "bg-slate-800" },
];

export function ProposalProgress() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  return (
    <div className="w-full bg-white/40 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          Proposal Progress
        </h2>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {date ? format(date, "MMMM d, yyyy") : "Select date"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {PROPOSAL_METRICS.map((metric) => (
          <div key={metric.title} className="flex flex-col items-center">
            <h3 className="text-sm text-slate-500 mb-2">{metric.title}</h3>
            <div className="text-3xl font-bold text-slate-800 mb-3">
              {metric.value}
            </div>
            <div className="w-full h-16 flex items-end justify-center">
              <div className={`w-10 ${metric.color}`} style={{
                height: `${(metric.value / 64) * 100}%`,
                minHeight: '10%',
                borderRadius: '4px 4px 0 0'
              }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
