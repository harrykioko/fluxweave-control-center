
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { TaskComment } from "./types";

export function useTaskComments(taskId: string, currentUserId: string) {
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch the comments for this task
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["taskComments", taskId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recent_task_comments")
        .select("*")
        .eq("task_id", taskId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as TaskComment[];
    },
    enabled: !!taskId,
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!content.trim()) {
        throw new Error("Comment cannot be empty");
      }

      const { data, error } = await supabase
        .from("task_comments")
        .insert({
          task_id: taskId,
          user_id: currentUserId,
          content: content.trim(),
        })
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["taskComments", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // To update comment counts
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      });
    },
    onError: (error) => {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from("task_comments")
        .delete()
        .eq("id", commentId)
        .eq("user_id", currentUserId);

      if (error) throw error;
      return commentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskComments", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // To update comment counts
      toast({
        title: "Comment deleted",
        description: "Your comment has been deleted.",
      });
    },
    onError: (error) => {
      console.error("Error deleting comment:", error);
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddComment = (content: string) => {
    addCommentMutation.mutate(content);
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  return {
    comments,
    isLoading,
    handleAddComment,
    handleDeleteComment,
    addCommentMutation,
  };
}
