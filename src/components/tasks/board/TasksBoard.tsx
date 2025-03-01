import React from "react";
import { TaskStatusColumn } from "./TaskStatusColumn";
import { Skeleton } from "@/components/ui/skeleton";
import { Task, TASK_STATUSES } from "@/types/task";

interface TasksBoardProps {
  tasks: Task[];
  isLoading: boolean;
  onTaskClick: (taskId: string) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string, status: string) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, newStatus: "pending" | "in_progress" | "completed") => void;
}

export function TasksBoard({
  tasks,
  isLoading,
  onTaskClick,
  onDragStart,
  onDragOver,
  onDrop,
}: TasksBoardProps) {
  // Filter tasks by status
  const todoTasks = tasks.filter((task) => task.status === "pending");
  const inProgressTasks = tasks.filter((task) => task.status === "in_progress");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-sm rounded-lg p-5 h-[500px] border border-white/10">
            <Skeleton className="h-7 w-1/2 bg-white/10 mb-6" />
            <div className="space-y-4">
              {[...Array(3)].map((_, j) => (
                <Skeleton key={j} className="h-32 w-full bg-white/10" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* To Do Column */}
      <TaskStatusColumn
        title="To Do"
        tasks={todoTasks}
        onTaskClick={onTaskClick}
        onDragStart={(e, taskId) => onDragStart(e, taskId, "pending")}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, "pending")}
        className="bg-white/5 border border-white/10"
        emptyMessage="No tasks to do yet"
      />

      {/* In Progress Column */}
      <TaskStatusColumn
        title="In Progress"
        tasks={inProgressTasks}
        onTaskClick={onTaskClick}
        onDragStart={(e, taskId) => onDragStart(e, taskId, "in_progress")}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, "in_progress")}
        className="bg-white/5 border border-white/10"
        emptyMessage="No tasks in progress"
      />

      {/* Completed Column */}
      <TaskStatusColumn
        title="Done"
        tasks={completedTasks}
        onTaskClick={onTaskClick}
        onDragStart={(e, taskId) => onDragStart(e, taskId, "completed")}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, "completed")}
        className="bg-white/5 border border-white/10"
        emptyMessage="No completed tasks yet"
      />
    </div>
  );
}

export { TASK_STATUSES } from "@/types/task";
