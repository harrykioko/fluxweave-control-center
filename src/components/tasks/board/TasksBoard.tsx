
import React, { memo } from "react";
import { TaskStatusColumn } from "./TaskStatusColumn";

// Define task status type
type TaskStatus = "pending" | "in_progress" | "completed";

// Define task status configurations
export const TASK_STATUSES = [
  { id: "pending" as TaskStatus, label: "To-Do", glassBg: "bg-white/5", glassBorder: "border-white/10" },
  { id: "in_progress" as TaskStatus, label: "In Progress", glassBg: "bg-white/10", glassBorder: "border-white/20" },
  { id: "completed" as TaskStatus, label: "Done", glassBg: "bg-white/15", glassBorder: "border-white/30" }
];

interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
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

interface TasksBoardProps {
  tasks: Task[];
  isLoading: boolean;
  onTaskClick: (taskId: string) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, task: Task) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, newStatus: TaskStatus) => void;
}

// Using memo to prevent unnecessary re-renders
export const TasksBoard = memo(function TasksBoard({ 
  tasks, 
  isLoading, 
  onTaskClick, 
  onDragStart, 
  onDragOver, 
  onDrop 
}: TasksBoardProps) {
  if (isLoading) {
    return <div className="text-center text-white">Loading tasks...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {TASK_STATUSES.map((statusCol) => (
        <TaskStatusColumn
          key={statusCol.id}
          status={statusCol}
          tasks={tasks}
          onTaskClick={onTaskClick}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
        />
      ))}
    </div>
  );
});
