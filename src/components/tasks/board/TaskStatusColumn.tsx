
import React from "react";

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

interface TaskStatusColumnProps {
  title: string;
  statusId: "pending" | "in_progress" | "completed";
  tasks: Task[];
  isLoading: boolean;
  onTaskClick: (taskId: string) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, task: Task) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, newStatus: "pending" | "in_progress" | "completed") => void;
  renderTask: (task: Task) => React.ReactNode;
}

export function TaskStatusColumn({
  title,
  statusId,
  tasks,
  isLoading,
  onDragOver,
  onDrop,
  renderTask,
}: TaskStatusColumnProps) {
  // Get color based on status
  const getStatusColor = () => {
    switch (statusId) {
      case "pending":
        return "bg-blue-500/20 text-blue-100";
      case "in_progress":
        return "bg-amber-500/20 text-amber-100";
      case "completed":
        return "bg-green-500/20 text-green-100";
      default:
        return "bg-gray-500/20 text-gray-100";
    }
  };

  return (
    <div 
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden flex flex-col"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, statusId)}
    >
      {/* Column Header */}
      <div className={`px-4 py-3 border-b border-white/10 ${getStatusColor()}`}>
        <div className="flex justify-between items-center">
          <h3 className="font-medium">{title}</h3>
          <span className="text-xs px-2 py-1 bg-white/10 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>
      
      {/* Column Content */}
      <div className="flex-1 p-4 space-y-3 min-h-[300px] max-h-[70vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin h-6 w-6 border-4 border-white/30 rounded-full border-t-transparent"></div>
          </div>
        ) : tasks.length > 0 ? (
          tasks.map(renderTask)
        ) : (
          <div className="flex items-center justify-center h-full text-white/50 text-sm italic">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}
