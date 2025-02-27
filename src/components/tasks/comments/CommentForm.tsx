
import React, { useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface CommentFormProps {
  currentUserId: string;
  onAddComment: (content: string) => void;
  isSubmitting: boolean;
}

export function CommentForm({ currentUserId, onAddComment, isSubmitting }: CommentFormProps) {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage 
            src={`https://avatar.vercel.sh/${currentUserId}`} 
            alt="Your avatar" 
          />
        </Avatar>
        <div className="flex-1">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="min-h-[80px] bg-white/80 backdrop-blur-sm"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={!newComment.trim() || isSubmitting} 
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isSubmitting ? (
            "Adding..."
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Add Comment
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
