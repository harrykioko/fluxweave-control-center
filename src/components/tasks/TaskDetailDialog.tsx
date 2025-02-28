
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { TaskDetailHeader } from "@/components/tasks/detail";
import { TaskDetailContent } from "@/components/tasks/detail";
import { useTaskDetail } from "@/components/tasks/detail/useTaskDetail";

interface TaskDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string | null;
  profiles: any[];
}

export function TaskDetailDialog({ open, onOpenChange, taskId, profiles }: TaskDetailDialogProps) {
  const { task, isLoading, currentUserId, handleFieldUpdate, handleDeleteTask } = useTaskDetail(
    taskId,
    open,
    onOpenChange
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white border-none">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
          </div>
        ) : task ? (
          <div className="space-y-6">
            {/* Task Detail Header */}
            <TaskDetailHeader
              title={task.title}
              onTitleChange={(title) => handleFieldUpdate("title", title)}
              onDeleteTask={handleDeleteTask}
            />
            
            <Separator />
            
            {/* Task Detail Content */}
            <TaskDetailContent
              task={task}
              profiles={profiles}
              currentUserId={currentUserId}
              onFieldUpdate={handleFieldUpdate}
            />
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            This task could not be found or has been deleted.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
