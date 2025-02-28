
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TaskDescriptionProps {
  description: string;
  onDescriptionChange: (value: string) => void;
}

export function TaskDescription({ description, onDescriptionChange }: TaskDescriptionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="description">Description</Label>
      <Textarea
        id="description"
        value={description || ""}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Add a description..."
        className="min-h-[100px]"
      />
    </div>
  );
}
