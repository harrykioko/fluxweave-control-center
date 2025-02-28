
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
}

interface TaskAssigneeProps {
  assignedTo: string;
  assigneeFirstName?: string;
  assigneeLastName?: string;
  assigneeAvatarUrl?: string;
  profiles: Profile[];
  onAssigneeChange: (value: string) => void;
}

export function TaskAssignee({ 
  assignedTo, 
  assigneeFirstName, 
  assigneeLastName, 
  assigneeAvatarUrl, 
  profiles, 
  onAssigneeChange 
}: TaskAssigneeProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="assignee">Assignee</Label>
      <Select
        value={assignedTo || ""}
        onValueChange={onAssigneeChange}
      >
        <SelectTrigger id="assignee" className="w-full">
          <SelectValue placeholder="Select assignee">
            {assignedTo && assigneeFirstName ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={assigneeAvatarUrl || `https://avatar.vercel.sh/${assignedTo}`} />
                </Avatar>
                <span>{assigneeFirstName} {assigneeLastName}</span>
              </div>
            ) : (
              "Unassigned"
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Unassigned</SelectItem>
          {profiles.map((profile) => (
            <SelectItem key={profile.id} value={profile.id}>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={profile.avatar_url || `https://avatar.vercel.sh/${profile.id}`} />
                </Avatar>
                <span>{profile.first_name} {profile.last_name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
