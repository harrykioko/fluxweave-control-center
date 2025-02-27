
import React from "react";
import { CommentItem } from "./CommentItem";
import { TaskComment } from "./types";

interface CommentListProps {
  comments: TaskComment[];
  isLoading: boolean;
  currentUserId: string;
  onDeleteComment: (commentId: string) => void;
}

export function CommentList({ comments, isLoading, currentUserId, onDeleteComment }: CommentListProps) {
  if (isLoading) {
    return <div className="py-4 text-center text-slate-500">Loading comments...</div>;
  }

  if (comments.length === 0) {
    return <div className="py-4 text-center text-slate-500">No comments yet. Be the first to comment!</div>;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          currentUserId={currentUserId}
          onDeleteComment={onDeleteComment}
        />
      ))}
    </div>
  );
}
