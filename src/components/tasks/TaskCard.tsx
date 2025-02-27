
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, Clock } from "lucide-react";

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    status: "pending" | "in_progress" | "completed";
    priority?: string;
    due_date?: string;
    assignee?: User;
  };
}

// Map database status values to display labels
const statusDisplayMap = {
  "pending": "To-Do",
  "in_progress": "In Progress",
  "completed": "Done"
};

// Priority badge colors
const priorityColorMap: Record<string, string> = {
  "high": "bg-red-500/80 hover:bg-red-500/90",
  "medium": "bg-amber-500/80 hover:bg-amber-500/90",
  "low": "bg-green-500/80 hover:bg-green-500/90",
  "none": "bg-slate-500/80 hover:bg-slate-500/90"
};

export function TaskCard({ task }: TaskCardProps) {
  // Format the due date with time information
  const formatDueDate = (dateString?: string) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const today = new Date();
    
    // Reset time part for comparison
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dueDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const diffTime = dueDate.getTime() - todayDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Format date
    let dateDisplay = date.toLocaleDateString();
    
    // Add relative time indicator for upcoming due dates
    if (diffDays === 0) {
      return `Today (${dateDisplay})`;
    } else if (diffDays === 1) {
      return `Tomorrow (${dateDisplay})`;
    } else if (diffDays > 1 && diffDays <= 7) {
      return `In ${diffDays} days (${dateDisplay})`;
    } else if (diffDays < 0) {
      return `Overdue: ${dateDisplay}`;
    }
    
    return dateDisplay;
  };

  const priorityColor = task.priority ? priorityColorMap[task.priority.toLowerCase()] || priorityColorMap.none : priorityColorMap.none;

  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-lg p-4 hover:bg-white/50 transition-all hover-scale">
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <h4 className="font-medium text-slate-800">{task.title}</h4>
          
          {/* Priority Badge */}
          {task.priority && (
            <Badge className={`${priorityColor} text-white capitalize`}>
              {task.priority}
            </Badge>
          )}
          
          {/* Due Date */}
          {task.due_date && (
            <div className={`flex items-center space-x-2 text-sm ${
              new Date(task.due_date) < new Date() && task.status !== "completed" 
                ? "text-red-600 font-medium" 
                : "text-slate-500"
            }`}>
              {new Date(task.due_date) < new Date() && task.status !== "completed" 
                ? <Clock className="h-4 w-4" /> 
                : <Calendar className="h-4 w-4" />
              }
              <span>{formatDueDate(task.due_date)}</span>
            </div>
          )}
        </div>
        {task.assignee && (
          <Avatar className="ring-2 ring-white">
            <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
          </Avatar>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className={`flex items-center space-x-1.5 text-sm ${
          task.status === "completed" ? "text-green-600" : "text-slate-500"
        }`}>
          <CheckCircle2 className="h-4 w-4" />
          <span>{statusDisplayMap[task.status] || task.status}</span>
        </div>
      </div>
    </div>
  );
}
