
import React, { memo, useMemo } from "react";
import { TaskCard } from "../TaskCard";

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
  status: {
    id: "pending" | "in_progress" | "completed";
    label: string;
    glassBg: string;
    glassBorder: string;
  };
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, task: Task) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, newStatus: "pending" | "in_progress" | "completed") => void;
}

// Using memo to prevent unnecessary re-renders
export const TaskStatusColumn = memo(function TaskStatusColumn({
  status,
  tasks,
  onTaskClick,
  onDragStart,
  onDragOver,
  onDrop
}: TaskStatusColumnProps) {
  // Using useMemo to filter tasks only when tasks or status changes
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => task.status === status.id);
  }, [tasks, status.id]);
  
  // Using useMemo for the handler to maintain reference stability
  const handleDrop = useMemo(() => {
    return (e: React.DragEvent<HTMLDivElement>) => onDrop(e, status.id);
  }, [onDrop, status.id]);

  return (
    <div
      className={`rounded-xl p-6 ${status.glassBg} backdrop-blur-xl border ${status.glassBorder} shadow-lg`}
      onDragOver={onDragOver}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium">{status.label}</h3>
        <span className="bg-white/10 text-white/70 text-xs font-medium px-2 py-1 rounded-md">
          {filteredTasks.length}
        </span>
      </div>
      
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-white/50 text-sm text-center py-4">
            No tasks
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task.id)}
              onDragStart={(e) => onDragStart(e, task)}
            />
          ))
        )}
      </div>
    </div>
  );
});
