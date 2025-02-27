
import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string;
    status: string;
    priority: string;
    due_date?: string;
    assignee?: {
      id: string;
      name: string;
      avatar: string;
    };
    project_name?: string;
  };
  onClick: () => void;
}

// Priority badge colors
const priorityColorMap: Record<string, string> = {
  "high": "bg-red-500/80 hover:bg-red-500/90",
  "medium": "bg-amber-500/80 hover:bg-amber-500/90",
  "low": "bg-green-500/80 hover:bg-green-500/90",
};

export function TaskCard({ task, onClick }: TaskCardProps) {
  // Format date to readable format
  const formatDueDate = (dateStr?: string) => {
    if (!dateStr) return "";
    
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dateFormatOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString('en-US', dateFormatOptions);
    }
  };

  // Check if task is overdue
  const isOverdue = () => {
    if (!task.due_date || task.status === "completed") return false;
    const dueDate = new Date(task.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  return (
    <div 
      className="group bg-white/80 hover:bg-white/90 backdrop-blur-md rounded-lg border border-white/40 shadow-sm hover:shadow-md transition-all cursor-pointer p-4"
      onClick={onClick}
    >
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-slate-800 line-clamp-2 group-hover:text-slate-900">
            {task.title}
          </h3>
          {task.priority && (
            <Badge className={`${priorityColorMap[task.priority.toLowerCase()] || ""} text-white`}>
              {task.priority}
            </Badge>
          )}
        </div>

        {task.description && (
          <p className="text-sm text-slate-500 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="pt-2 flex flex-col space-y-2">
          {/* Project info */}
          {task.project_name && (
            <div className="flex items-center text-xs text-slate-500">
              <Briefcase className="h-3.5 w-3.5 mr-1.5" />
              <span className="truncate">{task.project_name}</span>
            </div>
          )}
          
          {/* Due date */}
          {task.due_date && (
            <div className={`flex items-center text-xs ${isOverdue() ? "text-red-600 font-medium" : "text-slate-500"}`}>
              <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
              <span>{formatDueDate(task.due_date)}</span>
              {isOverdue() && <span className="ml-1.5">(Overdue)</span>}
            </div>
          )}
          
          {/* Assignee */}
          {task.assignee && (
            <div className="flex justify-end pt-1">
              <Avatar className="h-6 w-6 ring-2 ring-white">
                <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
              </Avatar>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
