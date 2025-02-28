
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskStatusSelectorProps {
  status: string;
  onStatusChange: (value: string) => void;
}

export function TaskStatusSelector({ status, onStatusChange }: TaskStatusSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="status">Status</Label>
      <Select
        value={status}
        onValueChange={onStatusChange}
      >
        <SelectTrigger id="status">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">To-Do</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="completed">Done</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
