
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskPrioritySelectorProps {
  priority: string;
  onPriorityChange: (value: string) => void;
}

export function TaskPrioritySelector({ priority, onPriorityChange }: TaskPrioritySelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="priority">Priority</Label>
      <Select
        value={priority || "medium"}
        onValueChange={onPriorityChange}
      >
        <SelectTrigger id="priority">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
