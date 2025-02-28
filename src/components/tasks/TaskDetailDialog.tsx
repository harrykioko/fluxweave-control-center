
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useTaskDetail } from "./detail/useTaskDetail";
import { TaskDetailHeader } from "./detail/TaskDetailHeader";
import { TaskDetailContent } from "./detail/TaskDetailContent";

interface TaskDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string | null;
  profiles: any[];
}

export function TaskDetailDialog({ open, onOpenChange, taskId, profiles }: TaskDetailDialogProps) {
  const {
    task,
    isLoading,
    currentUserId,
    handleFieldUpdate,
    handleDeleteTask
  } = useTaskDetail(taskId, open, onOpenChange);

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <p>Loading task details...</p>
        </DialogContent>
      </Dialog>
    );
  }

  if (!task) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <p>Task not found.</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <TaskDetailHeader 
          title={task.title} 
          onDeleteTask={handleDeleteTask} 
        />
        
        <TaskDetailContent 
          task={task} 
          profiles={profiles}
          currentUserId={currentUserId}
          onFieldUpdate={handleFieldUpdate}
        />
      </DialogContent>
    </Dialog>
  );
}
