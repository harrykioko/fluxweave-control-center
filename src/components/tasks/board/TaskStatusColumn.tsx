
import React from "react";
import { TaskCard } from "../card";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string;
  assigned_to?: string;
  project_id?: string;
  created_by: string;
  // Additional fields for display
  assignee_first_name?: string;
  assignee_last_name?: string;
  assignee_avatar_url?: string;
  comment_count?: number;
}

interface TaskStatusColumnProps {
  title: string;
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  className?: string;
  emptyMessage?: string;
}

export function TaskStatusColumn({
  title,
  tasks,
  onTaskClick,
  onDragStart,
  onDragOver,
  onDrop,
  className = "",
  emptyMessage = "No tasks",
}: TaskStatusColumnProps) {
  return (
    <div 
      className={`rounded-lg p-5 backdrop-blur-sm ${className}`}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-white text-lg">{title}</h3>
        <span className="text-sm text-white/70 bg-white/10 px-2.5 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      
      {tasks.length > 0 ? (
        <div className="space-y-3 max-h-[calc(100vh-240px)] overflow-y-auto pr-1 scrollbar-thin">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task.id)}
              onDragStart={(e) => onDragStart(e, task.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-32 border border-dashed border-white/20 rounded-lg bg-white/5 text-white/50 text-sm">
          {emptyMessage}
        </div>
      )}
    </div>
  );
}
