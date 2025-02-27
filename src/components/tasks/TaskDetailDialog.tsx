
import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Calendar, MessageSquare, Trash } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { TaskComments } from "./TaskComments";
import { useToast } from "@/hooks/use-toast";

interface TaskDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string | null;
  profiles: any[];
}

export function TaskDetailDialog({ open, onOpenChange, taskId, profiles }: TaskDetailDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get current authenticated user
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    
    fetchCurrentUser();
  }, []);

  // Fetch task details
  const { data: task, isLoading } = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      if (!taskId) return null;
      
      const { data, error } = await supabase
        .from("recent_tasks")
        .select("*")
        .eq("id", taskId)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!taskId && open,
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async (updatedTask: any) => {
      const { error } = await supabase
        .from("tasks")
        .update(updatedTask)
        .eq("id", taskId);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error updating the task.",
        variant: "destructive",
      });
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onOpenChange(false);
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error deleting the task.",
        variant: "destructive",
      });
    },
  });

  // Handle field updates
  const handleFieldUpdate = (field: string, value: any) => {
    updateTaskMutation.mutate({ [field]: value });
  };

  const handleDeleteTask = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTaskMutation.mutate();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">To-Do</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">In Progress</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">Done</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <p>Loading task details...</p>
        </DialogContent>
      </Dialog>
    );
  }

  if (!task) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <p>Task not found.</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold">{task.title}</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDeleteTask}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Status and Priority */}
          <div className="flex flex-wrap gap-3">
            {getStatusBadge(task.status)}
            
            <Badge variant="outline" className={`${getPriorityColor(task.priority)} capitalize`}>
              {task.priority || "Medium"} Priority
            </Badge>
            
            {task.due_date && (
              <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(task.due_date), "MMM d, yyyy")}
              </Badge>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={task.description || ""}
              onChange={(e) => handleFieldUpdate("description", e.target.value)}
              placeholder="Add a description..."
              className="min-h-[100px]"
            />
          </div>

          {/* Assignee */}
          <div className="space-y-2">
            <Label htmlFor="assignee">Assignee</Label>
            <Select
              value={task.assigned_to || ""}
              onValueChange={(value) => handleFieldUpdate("assigned_to", value)}
            >
              <SelectTrigger id="assignee" className="w-full">
                <SelectValue placeholder="Select assignee">
                  {task.assigned_to ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assignee_avatar_url || `https://avatar.vercel.sh/${task.assigned_to}`} />
                      </Avatar>
                      <span>{task.assignee_first_name} {task.assignee_last_name}</span>
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

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={task.status}
              onValueChange={(value) => handleFieldUpdate("status", value)}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">To-Do</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={task.priority || "medium"}
              onValueChange={(value) => handleFieldUpdate("priority", value)}
            >
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <input
              type="date"
              id="dueDate"
              value={task.due_date ? format(new Date(task.due_date), "yyyy-MM-dd") : ""}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null;
                handleFieldUpdate("due_date", date);
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          {/* Creator information */}
          <div className="bg-slate-50 p-3 rounded-md">
            <div className="text-sm text-slate-500 mb-2">Created by</div>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={task.creator_avatar_url || `https://avatar.vercel.sh/${task.created_by}`} />
              </Avatar>
              <div>
                <div className="text-sm font-medium">{task.creator_first_name} {task.creator_last_name}</div>
                <div className="text-xs text-slate-500">
                  {format(new Date(task.created_at), "MMM d, yyyy 'at' h:mm a")}
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Task Comments Section */}
          {currentUserId && taskId && (
            <TaskComments taskId={taskId} currentUserId={currentUserId} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
