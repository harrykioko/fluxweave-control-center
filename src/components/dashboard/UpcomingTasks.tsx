import * as React from 'react';
import { FC } from 'react';
import { CheckSquare } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { Task } from "@/types/task";
import { format, isPast, isToday, isTomorrow } from "date-fns";

export const UpcomingTasks: FC = () => {
  const { tasks, isLoading, handleTaskClick } = useTasks();

  // Filter for upcoming tasks, sorted by due date
  const upcomingTasks = tasks
    ?.filter((task: Task) => 
      task.status !== "completed" && 
      task.due_date
    )
    .sort((a: Task, b: Task) => {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    })
    .slice(0, 3); // Show only the 3 most urgent upcoming tasks

  const getDueDateLabel = (dueDate: string) => {
    const date = new Date(dueDate);
    
    if (isPast(date) && !isToday(date)) {
      return "Overdue";
    } else if (isToday(date)) {
      return "Due today";
    } else if (isTomorrow(date)) {
      return "Due tomorrow";
    } else {
      return `Due ${format(date, "MMM d")}`;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-error-500";
      case "medium":
        return "bg-warning-500";
      case "low":
        return "bg-success-500";
      default:
        return "bg-info-500";
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-primary px-1 flex items-center">
        <CheckSquare className="h-5 w-5 mr-2" />
        Upcoming Tasks
      </h2>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="flex items-start p-4 glass-md rounded-xl animate-pulse"
            >
              <div className="w-full space-y-2">
                <div className="h-4 bg-elevated rounded w-3/4"></div>
                <div className="h-3 bg-elevated rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : upcomingTasks && upcomingTasks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {upcomingTasks.map((task: Task) => (
            <div 
              key={task.id} 
              className="flex items-start p-4 glass-card rounded-xl cursor-pointer glass-hover"
              onClick={() => handleTaskClick(task.id)}
            >
              <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)} mt-2 mr-3 flex-shrink-0`}></div>
              <div>
                <p className="font-medium text-primary line-clamp-2">{task.title}</p>
                <p className="text-xs text-secondary">
                  {task.due_date ? getDueDateLabel(task.due_date) : "No due date"}
                </p>
                {task.project_name && (
                  <p className="text-xs text-tertiary mt-1">{task.project_name}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-6 text-center">
          <p className="text-secondary">No upcoming tasks</p>
        </div>
      )}
    </div>
  );
};
