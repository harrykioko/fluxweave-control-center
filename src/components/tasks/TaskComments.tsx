
import React, { useState, useEffect } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { MessageSquare, Trash2, Send } from "lucide-react";
import { format } from "date-fns";

interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  commenter_first_name: string;
  commenter_last_name: string;
  commenter_avatar_url: string | null;
}

interface TaskCommentsProps {
  taskId: string;
  currentUserId: string;
}

export function TaskComments({ taskId, currentUserId }: TaskCommentsProps) {
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
    mutationFn: async () => {
      if (!newComment.trim()) {
        throw new Error("Comment cannot be empty");
      }

      const { data, error } = await supabase
        .from("task_comments")
        .insert({
          task_id: taskId,
          user_id: currentUserId,
          content: newComment.trim(),
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

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    addCommentMutation.mutate();
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  // Format the date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy 'at' h:mm a");
  };

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
      <form onSubmit={handleAddComment} className="space-y-3">
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
            disabled={!newComment.trim() || addCommentMutation.isPending} 
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {addCommentMutation.isPending ? (
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

      <div className="space-y-4 mt-6">
        {isLoading ? (
          <div className="py-4 text-center text-slate-500">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="py-4 text-center text-slate-500">No comments yet. Be the first to comment!</div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/40 shadow-sm">
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
                    onClick={() => handleDeleteComment(comment.id)}
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
          ))
        )}
      </div>
    </div>
  );
}
