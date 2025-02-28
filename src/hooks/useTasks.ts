
import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed";
  priority: string;
  due_date?: string;
  assigned_to?: string;
  project_id?: string;
  created_by: string;
  project_name?: string;
  assignee_first_name?: string;
  assignee_last_name?: string;
  assignee_avatar_url?: string;
  comment_count?: number;
}

export function useTasks() {
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      // First get the tasks with basic information
      const { data: tasksData, error: tasksError } = await supabase
        .from("recent_tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (tasksError) throw tasksError;

      // Get comment counts for each task
      const taskIds = tasksData.map(task => task.id);
      
      // If there are no tasks, return empty array
      if (taskIds.length === 0) {
        return [];
      }
      
      // Use a raw SQL query to get comment counts grouped by task_id
      const { data: commentCounts, error: commentsError } = await supabase
        .from('task_comments')
        .select('task_id, count', { count: 'exact' })
        .in('task_id', taskIds);

      if (commentsError) console.error("Error fetching comment counts:", commentsError);

      // Process the raw comment data to create a map of task_id to comment count
      const commentCountMap: Record<string, number> = {};
      
      // Count occurrences of each task_id in the comments
      if (commentCounts) {
        commentCounts.forEach(comment => {
          if (comment.task_id) {
            if (!commentCountMap[comment.task_id]) {
              commentCountMap[comment.task_id] = 1;
            } else {
              commentCountMap[comment.task_id]++;
            }
          }
        });
      }

      // Merge the comment counts into the tasks data
      const tasksWithCommentCounts = tasksData.map(task => ({
        ...task,
        comment_count: commentCountMap[task.id] || 0
      }));

      return tasksWithCommentCounts as Task[];
    },
    staleTime: 30000, // Add stale time to reduce unnecessary refetches
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, avatar_url");

      if (error) throw error;
      return data;
    },
    staleTime: 300000, // Profile data changes less frequently
  });

  // Use useCallback to maintain reference stability for event handlers
  const handleTaskClick = useCallback((taskId: string) => {
    setSelectedTaskId(taskId);
    setIsTaskDetailOpen(true);
  }, []);

  // Handle drag start event
  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, task: Task) => {
    e.dataTransfer.setData("taskId", task.id);
    e.dataTransfer.setData("taskTitle", task.title);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  // Handle drag over event
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  // Handle drop event
  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>, newStatus: "pending" | "in_progress" | "completed") => {
    e.preventDefault();
    
    const taskId = e.dataTransfer.getData("taskId");
    const taskTitle = e.dataTransfer.getData("taskTitle");
    
    if (!taskId) return;

    // Find the task that is being moved
    const taskToUpdate = tasks.find(task => task.id === taskId);
    
    // If the task is already in this status, do nothing
    if (taskToUpdate && taskToUpdate.status === newStatus) return;
    
    // Optimistically update UI first
    queryClient.setQueryData(["tasks"], (oldData: Task[] | undefined) => {
      if (!oldData) return [];
      return oldData.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      );
    });

    // Update the task status in the database
    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", taskId);

    if (error) {
      console.error("Error updating task status:", error);
      
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      });
    } else {
      const statusLabel = TASK_STATUSES.find(status => status.id === newStatus)?.label;
      
      toast({
        title: "Task Updated",
        description: `"${taskTitle}" moved to ${statusLabel}`,
        variant: "default",
      });
    }
  }, [queryClient, tasks, toast]);

  return {
    tasks,
    isLoading,
    profiles,
    isNewTaskOpen,
    setIsNewTaskOpen,
    isTaskDetailOpen,
    setIsTaskDetailOpen,
    selectedTaskId,
    handleTaskClick,
    handleDragStart,
    handleDragOver,
    handleDrop,
  };
}

// Import TASK_STATUSES from the board component
import { TASK_STATUSES } from "@/components/tasks/board/TasksBoard";
