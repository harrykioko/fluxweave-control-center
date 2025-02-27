
import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { TaskComment } from "./types";

interface CommentItemProps {
  comment: TaskComment;
  currentUserId: string;
  onDeleteComment: (commentId: string) => void;
}

export function CommentItem({ comment, currentUserId, onDeleteComment }: CommentItemProps) {
  // Format the date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy 'at' h:mm a");
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/40 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={comment.commenter_avatar_url || `https://avatar.vercel.sh/${comment.user_id}`} 
              alt={`${comment.commenter_first_name} ${comment.commenter_last_name}`} 
            />
          </Avatar>
          <div>
            <div className="font-medium text-sm text-slate-800">
              {comment.commenter_first_name} {comment.commenter_last_name}
            </div>
            <div className="text-xs text-slate-500">
              {formatDate(comment.created_at)}
            </div>
          </div>
        </div>
        {comment.user_id === currentUserId && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDeleteComment(comment.id)}
            className="h-8 w-8 p-0 text-slate-500 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="mt-2 text-sm text-slate-700 whitespace-pre-line pl-11">
        {comment.content}
      </div>
    </div>
  );
}
