
import React, { memo } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MessageSquare } from "lucide-react";
import { format } from "date-fns";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed";
  priority: string;
  due_date?: string;
  assigned_to?: string;
  project_id?: string;
  created_by: string;
  project_name?: string;
  assignee_first_name?: string;
  assignee_last_name?: string;
  assignee_avatar_url?: string;
  comment_count?: number;
}

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
}

// Using memo to prevent unnecessary re-renders
export const TaskCard = memo(function TaskCard({ task, onClick, onDragStart }: TaskCardProps) {
  // Map priority to appropriate tailwind classes for styling
  const priorityClasses = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-amber-100 text-amber-800",
    high: "bg-red-100 text-red-800",
  };

  // Get the appropriate priority class or default to gray
  const priorityClass = 
    task.priority && priorityClasses[task.priority as keyof typeof priorityClasses]
    ? priorityClasses[task.priority as keyof typeof priorityClasses]
    : "bg-gray-100 text-gray-800";

  return (
    <div
      className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg p-4 shadow-md hover:shadow-lg cursor-pointer hover:bg-white/15 transition-all duration-200 hover:translate-y-[-2px] draggable"
      onClick={onClick}
      draggable
      onDragStart={onDragStart}
      data-task-id={task.id}
    >
      <div className="flex flex-col space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-white">{task.title}</h3>
          <Badge variant="outline" className={`${priorityClass} text-xs`}>
            {task.priority || "No priority"}
          </Badge>
        </div>

        {task.description && (
          <p className="text-xs text-white/70 line-clamp-2">{task.description}</p>
        )}

        <div className="flex justify-between items-center pt-2">
          {task.assignee_first_name ? (
            <div className="flex items-center gap-1">
              <Avatar 
                className="h-5 w-5 border border-white/20"
                src={task.assignee_avatar_url || undefined}
                alt={`${task.assignee_first_name} ${task.assignee_last_name}`}
              />
              <span className="text-xs text-white/70">
                {task.assignee_first_name}
              </span>
            </div>
          ) : (
            <span className="text-xs text-white/50">Unassigned</span>
          )}

          <div className="flex items-center gap-2">
            {task.due_date && (
              <div className="flex items-center space-x-1 text-white/70">
                <CalendarDays className="h-3 w-3" />
                <span className="text-xs">
                  {format(new Date(task.due_date), "MMM d")}
                </span>
              </div>
            )}
            
            {task.comment_count !== undefined && task.comment_count > 0 && (
              <div className="flex items-center space-x-1 text-white/70">
                <MessageSquare className="h-3 w-3" />
                <span className="text-xs">{task.comment_count}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
