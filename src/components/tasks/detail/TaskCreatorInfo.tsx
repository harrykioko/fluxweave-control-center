
import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

interface TaskCreatorInfoProps {
  creatorFirstName: string;
  creatorLastName: string;
  creatorAvatarUrl?: string;
  createdBy: string;
  createdAt: string;
}

export function TaskCreatorInfo({ 
  creatorFirstName, 
  creatorLastName, 
  creatorAvatarUrl, 
  createdBy,
  createdAt
}: TaskCreatorInfoProps) {
  return (
    <div className="bg-slate-50 p-3 rounded-md">
      <div className="text-sm text-slate-500 mb-2">Created by</div>
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={creatorAvatarUrl || `https://avatar.vercel.sh/${createdBy}`} />
        </Avatar>
        <div>
          <div className="text-sm font-medium">{creatorFirstName} {creatorLastName}</div>
          <div className="text-xs text-slate-500">
            {format(new Date(createdAt), "MMM d, yyyy 'at' h:mm a")}
          </div>
        </div>
      </div>
    </div>
  );
}
