
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface TaskStatusBadgesProps {
  status: string;
  priority: string;
  dueDate?: string;
}

export function TaskStatusBadges({ status, priority, dueDate }: TaskStatusBadgesProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">To-Do</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">In Progress</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">Done</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {getStatusBadge(status)}
      
      <Badge variant="outline" className={`${getPriorityColor(priority)} capitalize`}>
        {priority || "Medium"} Priority
      </Badge>
      
      {dueDate && (
        <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200 flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {format(new Date(dueDate), "MMM d, yyyy")}
        </Badge>
      )}
    </div>
  );
}
