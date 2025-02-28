
import React from "react";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

interface TaskDueDateProps {
  dueDate?: string;
  onDueDateChange: (date: Date | null) => void;
}

export function TaskDueDate({ dueDate, onDueDateChange }: TaskDueDateProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="dueDate">Due Date</Label>
      <input
        type="date"
        id="dueDate"
        value={dueDate ? format(new Date(dueDate), "yyyy-MM-dd") : ""}
        onChange={(e) => {
          const date = e.target.value ? new Date(e.target.value) : null;
          onDueDateChange(date);
        }}
        className="w-full rounded-md border border-gray-300 px-3 py-2"
      />
    </div>
  );
}
