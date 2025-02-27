
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Plus, Share2, Calendar } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { NewTaskDialog } from "@/components/tasks/NewTaskDialog";
import { TaskDetailDialog } from "@/components/tasks/TaskDetailDialog";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  avatar: string;
}

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

// Updated status mapping with new display labels but same database values
const TASK_STATUSES = [
  { id: "pending", label: "To-Do", glassBg: "bg-white/5", glassBorder: "border-white/10" },
  { id: "in_progress", label: "In Progress", glassBg: "bg-white/10", glassBorder: "border-white/20" },
  { id: "completed", label: "Done", glassBg: "bg-white/15", glassBorder: "border-white/30" }
];

export default function Tasks() {
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
  });

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsTaskDetailOpen(true);
  };

  // Handle drag start event
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task) => {
    e.dataTransfer.setData("taskId", task.id);
    e.dataTransfer.setData("taskTitle", task.title);
    e.dataTransfer.effectAllowed = "move";
  };

  // Handle drag over event
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // Handle drop event
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, newStatus: "pending" | "in_progress" | "completed") => {
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
  };

  return (
    <main className="min-h-screen pt-20 px-4 md:px-8 bg-gradient-to-br from-slate-800/90 via-slate-700/80 to-slate-800/90">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg">
          <div>
            <h1 className="text-3xl font-bold text-white text-gradient">Customer Journeys</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white/5 backdrop-blur-md border-white/10 text-white hover:bg-white/10">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" className="bg-white/5 backdrop-blur-md border-white/10 text-white hover:bg-white/10">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
            <Button 
              className="bg-purple-600/90 hover:bg-purple-700/90 text-white border border-purple-500/30"
              onClick={() => setIsNewTaskOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        </div>

        {/* Tasks Grid */}
        {isLoading ? (
          <div className="text-center text-white">Loading tasks...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Task Status Columns */}
            {TASK_STATUSES.map((statusCol) => (
              <div 
                key={statusCol.id} 
                className="space-y-4"
              >
                {/* Section header directly on background */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-white">{statusCol.label}</h3>
                    <span className="text-sm text-white/70 bg-white/10 px-2 py-0.5 rounded-full">
                      {tasks.filter(task => task.status === statusCol.id).length}
                    </span>
                  </div>
                </div>
                
                {/* Tasks container with varied glassmorphism - droppable area */}
                <div 
                  className={`${statusCol.glassBg} backdrop-blur-xl border ${statusCol.glassBorder} rounded-xl p-6 shadow-lg h-full`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, statusCol.id as "pending" | "in_progress" | "completed")}
                >
                  <div className="space-y-4">
                    {tasks
                      .filter(task => task.status === statusCol.id)
                      .map(task => (
                        <div 
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task)}
                        >
                          <TaskCard 
                            task={{
                              ...task,
                              priority: task.priority,
                              project_name: task.project_name,
                              comment_count: task.comment_count,
                              assignee: task.assignee_first_name ? {
                                id: task.assigned_to || "",
                                name: `${task.assignee_first_name} ${task.assignee_last_name}`,
                                avatar: task.assignee_avatar_url || `https://avatar.vercel.sh/${task.assigned_to}`
                              } : undefined
                            }}
                            onClick={() => handleTaskClick(task.id)} 
                          />
                        </div>
                      ))
                    }
                    {tasks.filter(task => task.status === statusCol.id).length === 0 && (
                      <div className="text-center py-8 text-white/50 italic">
                        No tasks
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Task Dialog */}
      <NewTaskDialog 
        open={isNewTaskOpen} 
        onOpenChange={setIsNewTaskOpen} 
        profiles={profiles} 
      />

      {/* Task Detail Dialog */}
      <TaskDetailDialog
        open={isTaskDetailOpen}
        onOpenChange={setIsTaskDetailOpen}
        taskId={selectedTaskId}
        profiles={profiles}
      />
    </main>
  );
}
