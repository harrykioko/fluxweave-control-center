
import React from "react";
import { Separator } from "@/components/ui/separator";
import { TaskStatusBadges } from "./TaskStatusBadges";
import { TaskDescription } from "./TaskDescription";
import { TaskAssignee } from "./TaskAssignee";
import { TaskStatusSelector } from "./TaskStatusSelector";
import { TaskPrioritySelector } from "./TaskPrioritySelector";
import { TaskDueDate } from "./TaskDueDate";
import { TaskCreatorInfo } from "./TaskCreatorInfo";
import { TaskComments } from "../TaskComments";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
}

interface TaskDetailContentProps {
  task: any;
  profiles: Profile[];
  currentUserId: string | null;
  onFieldUpdate: (field: string, value: any) => void;
}

export function TaskDetailContent({ 
  task, 
  profiles,
  currentUserId,
  onFieldUpdate 
}: TaskDetailContentProps) {
  if (!task) return null;

  return (
    <div className="space-y-6 mt-4">
      {/* Status and Priority */}
      <TaskStatusBadges 
        status={task.status} 
        priority={task.priority || "medium"} 
        dueDate={task.due_date} 
      />

      {/* Description */}
      <TaskDescription 
        description={task.description || ""} 
        onDescriptionChange={(value) => onFieldUpdate("description", value)} 
      />

      {/* Assignee */}
      <TaskAssignee 
        assignedTo={task.assigned_to || ""} 
        assigneeFirstName={task.assignee_first_name}
        assigneeLastName={task.assignee_last_name}
        assigneeAvatarUrl={task.assignee_avatar_url}
        profiles={profiles}
        onAssigneeChange={(value) => onFieldUpdate("assigned_to", value)}
      />

      {/* Status */}
      <TaskStatusSelector 
        status={task.status} 
        onStatusChange={(value) => onFieldUpdate("status", value)} 
      />

      {/* Priority */}
      <TaskPrioritySelector 
        priority={task.priority || "medium"} 
        onPriorityChange={(value) => onFieldUpdate("priority", value)} 
      />

      {/* Due Date */}
      <TaskDueDate 
        dueDate={task.due_date} 
        onDueDateChange={(date) => onFieldUpdate("due_date", date)} 
      />

      {/* Creator information */}
      <TaskCreatorInfo 
        creatorFirstName={task.creator_first_name}
        creatorLastName={task.creator_last_name}
        creatorAvatarUrl={task.creator_avatar_url}
        createdBy={task.created_by}
        createdAt={task.created_at}
      />
      
      <Separator />
      
      {/* Task Comments Section */}
      {currentUserId && task.id && (
        <TaskComments taskId={task.id} currentUserId={currentUserId} />
      )}
    </div>
  );
}
