
import React from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface TaskDetailHeaderProps {
  title: string;
  onDeleteTask: () => void;
  onTitleChange?: (title: string) => void; // Added the missing prop
}

export function TaskDetailHeader({ title, onDeleteTask, onTitleChange }: TaskDetailHeaderProps) {
  return (
    <DialogHeader>
      <div className="flex justify-between items-center">
        <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDeleteTask}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash className="h-5 w-5" />
        </Button>
      </div>
    </DialogHeader>
  );
}
