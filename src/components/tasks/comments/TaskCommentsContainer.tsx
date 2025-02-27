
import React from "react";
import { Separator } from "@/components/ui/separator";
import { MessageSquare } from "lucide-react";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";
import { useTaskComments } from "./useTaskComments";

interface TaskCommentsContainerProps {
  taskId: string;
  currentUserId: string;
}

export function TaskCommentsContainer({ taskId, currentUserId }: TaskCommentsContainerProps) {
  const {
    comments,
    isLoading,
    handleAddComment,
    handleDeleteComment,
    addCommentMutation,
  } = useTaskComments(taskId, currentUserId);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare className="h-5 w-5 text-slate-600" />
        <h3 className="text-lg font-medium text-slate-700">
          Comments{comments.length > 0 ? ` (${comments.length})` : ""}
        </h3>
      </div>

      <Separator className="my-4" />

      {/* Add new comment form */}
      <CommentForm
        currentUserId={currentUserId}
        onAddComment={handleAddComment}
        isSubmitting={addCommentMutation.isPending}
      />

      <div className="space-y-4 mt-6">
        <CommentList
          comments={comments}
          isLoading={isLoading}
          currentUserId={currentUserId}
          onDeleteComment={handleDeleteComment}
        />
      </div>
    </div>
  );
}
