
import React from "react";
import { TaskCard } from "@/components/tasks/TaskCard";

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

interface StatusColumnProps {
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

export function TaskStatusColumn({ 
  status, 
  tasks, 
  onTaskClick, 
  onDragStart, 
  onDragOver,
  onDrop 
}: StatusColumnProps) {
  const filteredTasks = tasks.filter(task => task.status === status.id);

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-white">{status.label}</h3>
          <span className="text-sm text-white/70 bg-white/10 px-2 py-0.5 rounded-full">
            {filteredTasks.length}
          </span>
        </div>
      </div>
      
      {/* Tasks container - droppable area */}
      <div 
        className={`${status.glassBg} backdrop-blur-xl border ${status.glassBorder} rounded-xl p-6 shadow-lg h-full`}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, status.id)}
      >
        <div className="space-y-4">
          {filteredTasks.map(task => (
            <div 
              key={task.id}
              draggable
              onDragStart={(e) => onDragStart(e, task)}
            >
              <TaskCard 
                task={{
                  ...task,
                  priority: task.priority,
                  project_name: task.project_name,
                  comment_count: task.comment_count,
                  assignee: task.assignee_first_name ? {
                    id: task.assigned_to || "",
                    name: `${task.assignee_first_name} ${task.assignee_last_name}`,
                    avatar: task.assignee_avatar_url || `https://avatar.vercel.sh/${task.assigned_to}`
                  } : undefined
                }}
                onClick={() => onTaskClick(task.id)} 
              />
            </div>
          ))}
          {filteredTasks.length === 0 && (
            <div className="text-center py-8 text-white/50 italic">
              No tasks
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
