
import React, { memo } from "react";
import { TaskStatusColumn } from "./TaskStatusColumn";
import { TaskCard } from "../card";

// Define the task statuses
export const TASK_STATUSES = [
  { id: "pending", label: "To Do" },
  { id: "in_progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
];

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

interface TasksBoardProps {
  tasks: Task[];
  isLoading: boolean;
  onTaskClick: (taskId: string) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, task: Task) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, newStatus: "pending" | "in_progress" | "completed") => void;
}

// Using memo to prevent unnecessary re-renders
export const TasksBoard = memo(function TasksBoard({
  tasks,
  isLoading,
  onTaskClick,
  onDragStart,
  onDragOver,
  onDrop,
}: TasksBoardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {TASK_STATUSES.map((statusColumn) => {
        // Filter tasks for this column
        const columnTasks = tasks.filter(task => task.status === statusColumn.id);
        
        return (
          <TaskStatusColumn
            key={statusColumn.id}
            title={statusColumn.label}
            statusId={statusColumn.id as "pending" | "in_progress" | "completed"}
            tasks={columnTasks}
            isLoading={isLoading}
            onTaskClick={onTaskClick}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            renderTask={(task) => (
              <TaskCard
                key={task.id} 
                task={task}
                onClick={() => onTaskClick(task.id)}
                onDragStart={(e) => onDragStart(e, task)}
              />
            )}
          />
        );
      })}
    </div>
  );
});
