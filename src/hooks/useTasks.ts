import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Task, TASK_STATUSES } from "@/types/task";

export function useTasks() {
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data: tasksData, error: tasksError } = await supabase
        .from("recent_tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (tasksError) throw tasksError;

      const taskIds = tasksData.map(task => task.id);
      
      if (taskIds.length === 0) {
        return [];
      }
      
      const { data: commentsData, error: commentsError } = await supabase
        .from('task_comments')
        .select('task_id')
        .in('task_id', taskIds);

      if (commentsError) {
        console.error("Error fetching comment counts:", commentsError);
        return tasksData.map(task => ({
          ...task,
          status: task.status as "pending" | "in_progress" | "completed"
        })) as Task[];
      }

      const commentCountMap: Record<string, number> = {};
      
      if (commentsData) {
        commentsData.forEach(comment => {
          if (comment.task_id) {
            commentCountMap[comment.task_id] = (commentCountMap[comment.task_id] || 0) + 1;
          }
        });
      }

      const tasksWithCommentCounts = tasksData.map(task => ({
        ...task,
        status: task.status as "pending" | "in_progress" | "completed",
        comment_count: commentCountMap[task.id] || 0
      }));

      return tasksWithCommentCounts as Task[];
    },
    staleTime: 30000,
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
    staleTime: 300000,
  });

  const handleTaskClick = useCallback((taskId: string) => {
    setSelectedTaskId(taskId);
    setIsTaskDetailOpen(true);
  }, []);

  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, taskId: string, status: string) => {
    e.dataTransfer.setData("taskId", taskId);
    
    const task = tasks?.find(t => t.id === taskId);
    if (task?.title) {
      e.dataTransfer.setData("taskTitle", task.title);
    }
    
    e.dataTransfer.effectAllowed = "move";
  }, [tasks]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>, newStatus: "pending" | "in_progress" | "completed") => {
    e.preventDefault();
    
    const taskId = e.dataTransfer.getData("taskId");
    const taskTitle = e.dataTransfer.getData("taskTitle");
    
    if (!taskId) return;

    const taskToUpdate = tasks.find(task => task.id === taskId);
    
    if (taskToUpdate && taskToUpdate.status === newStatus) return;
    
    queryClient.setQueryData(["tasks"], (oldData: Task[] | undefined) => {
      if (!oldData) return [];
      return oldData.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      );
    });

    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", taskId);

    if (error) {
      console.error("Error updating task status:", error);
      
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
