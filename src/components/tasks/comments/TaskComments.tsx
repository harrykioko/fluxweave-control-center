
import React, { useState } from "react";
import { useTaskComments } from "./useTaskComments";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";

interface TaskCommentsProps {
  taskId: string;
  currentUserId: string;
}

export function TaskComments({ taskId, currentUserId }: TaskCommentsProps) {
  const [newComment, setNewComment] = useState("");
  const { 
    comments, 
    isLoading, 
    handleAddComment,
    handleDeleteComment, 
    addCommentMutation 
  } = useTaskComments(taskId, currentUserId);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      handleAddComment(newComment);
      setNewComment("");
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800">Comments</h3>
      
      <CommentForm 
        newComment={newComment}
        setNewComment={setNewComment}
        handleSubmitComment={handleSubmitComment}
        isSubmitting={addCommentMutation.isPending}
        currentUserId={currentUserId}
      />
      
      <CommentList 
        comments={comments}
        isLoading={isLoading}
        currentUserId={currentUserId}
        onDeleteComment={handleDeleteComment}
      />
    </div>
  );
}
