
import React, { useState } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash, Pencil, Check } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TaskDetailHeaderProps {
  title: string;
  onDeleteTask: () => void;
  onTitleChange?: (title: string) => void;
}

export function TaskDetailHeader({ title, onDeleteTask, onTitleChange }: TaskDetailHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleSaveTitle = () => {
    if (editedTitle.trim() && onTitleChange) {
      onTitleChange(editedTitle);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      setEditedTitle(title);
      setIsEditing(false);
    }
  };

  return (
    <DialogHeader>
      <div className="flex justify-between items-center">
        {isEditing ? (
          <div className="flex gap-2 items-center flex-1">
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="text-xl font-bold flex-1"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSaveTitle}
              className="text-green-500 hover:text-green-700 hover:bg-green-50"
            >
              <Check className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
            {onTitleChange && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
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
