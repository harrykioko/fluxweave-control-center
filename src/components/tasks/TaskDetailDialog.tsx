
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Calendar as CalendarIcon, User, Check, Clock, Edit, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TaskComments } from "./TaskComments";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
}

interface Project {
  id: string;
  name: string;
  logo_url?: string;
}

interface TaskDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string | null;
  profiles: Profile[];
}

// Map database status values to display labels
const statusDisplayMap = {
  "pending": "To-Do",
  "in_progress": "In Progress",
  "completed": "Done"
};

// Priority badge colors
const priorityColorMap: Record<string, string> = {
  "high": "bg-red-500/80 hover:bg-red-500/90",
  "medium": "bg-amber-500/80 hover:bg-amber-500/90",
  "low": "bg-green-500/80 hover:bg-green-500/90",
  "none": "bg-slate-500/80 hover:bg-slate-500/90"
};

export function TaskDetailDialog({ open, onOpenChange, taskId, profiles }: TaskDetailDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [task, setTask] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("pending");
  const [assignedTo, setAssignedTo] = useState("");
  const [projectId, setProjectId] = useState("");
  const [activeTab, setActiveTab] = useState<"details" | "comments">("details");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user's ID for comments
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setCurrentUserId(data.session.user.id);
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch projects for selection
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, name, logo_url");

      if (error) throw error;
      return data as Project[];
    },
    enabled: open, // Only fetch when dialog is open
  });

  // Fetch comment count for this task
  const { data: commentCount = 0 } = useQuery({
    queryKey: ["taskCommentCount", taskId],
    queryFn: async () => {
      if (!taskId) return 0;
      
      const { count, error } = await supabase
        .from("task_comments")
        .select("*", { count: "exact", head: true })
        .eq("task_id", taskId);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!taskId && open,
  });

  useEffect(() => {
    if (taskId && open) {
      fetchTaskDetails(taskId);
    }
    
    if (!open) {
      // Reset states when dialog closes
      setIsEditing(false);
      setTask(null);
      setActiveTab("details");
    }
  }, [taskId, open]);

  const fetchTaskDetails = async (id: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("recent_tasks")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setTask(data);
        setTitle(data.title);
        setDescription(data.description || "");
        setDueDate(data.due_date ? new Date(data.due_date).toISOString().split('T')[0] : "");
        setPriority(data.priority || "medium");
        setStatus(data.status || "pending");
        setAssignedTo(data.assigned_to || "");
        setProjectId(data.project_id || "");
      }
    } catch (error: any) {
      console.error("Error fetching task:", error);
      toast({
        title: "Error",
        description: "Failed to load task details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDueDate = (dateString?: string) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const today = new Date();
    
    // Reset time part for comparison
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dueDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const diffTime = dueDate.getTime() - todayDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Format date
    let dateDisplay = date.toLocaleDateString();
    
    // Add relative time indicator for upcoming due dates
    if (diffDays === 0) {
      return `Today (${dateDisplay})`;
    } else if (diffDays === 1) {
      return `Tomorrow (${dateDisplay})`;
    } else if (diffDays > 1 && diffDays <= 7) {
      return `In ${diffDays} days (${dateDisplay})`;
    } else if (diffDays < 0) {
      return `Overdue: ${dateDisplay}`;
    }
    
    return dateDisplay;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a task title",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: title.trim(),
          description: description.trim() || null,
          status: status,
          priority: priority,
          due_date: dueDate || null,
          assigned_to: assignedTo || null,
          project_id: projectId || null,
        })
        .eq('id', taskId);

      if (error) {
        console.error("Error updating task:", error);
        toast({
          title: "Error",
          description: "Failed to update task. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Task updated successfully",
      });

      // Refresh task list and exit edit mode
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsEditing(false);
      // Refresh the task details after update
      fetchTaskDetails(taskId!);
      
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAssigneeName = () => {
    if (!task || !task.assignee_first_name) return "Unassigned";
    return `${task.assignee_first_name} ${task.assignee_last_name}`;
  };

  const getAssigneeAvatar = () => {
    if (!task || !task.assignee_avatar_url) return `https://avatar.vercel.sh/${task.assigned_to || "unassigned"}`;
    return task.assignee_avatar_url;
  };

  const getProjectName = () => {
    if (!task || !task.project_name) return "No project";
    return task.project_name;
  };

  if (isLoading && !task) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] bg-white/90 backdrop-blur-xl">
          <div className="flex items-center justify-center p-6">
            <div className="text-center">Loading task details...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white/90 backdrop-blur-xl max-h-[85vh] overflow-y-auto">
        {!isEditing && task ? (
          <>
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle className="text-xl font-semibold text-slate-800 truncate pr-4">
                {task.title}
              </DialogTitle>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/50 border-slate-300"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
            </DialogHeader>
            
            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-4">
              <button
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === "details"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                onClick={() => setActiveTab("details")}
              >
                Details
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm flex items-center ${
                  activeTab === "comments"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                onClick={() => setActiveTab("comments")}
              >
                Comments
                {commentCount > 0 && (
                  <span className="ml-1.5 bg-purple-100 text-purple-600 rounded-full px-2 py-0.5 text-xs">
                    {commentCount}
                  </span>
                )}
              </button>
            </div>
            
            {activeTab === "details" ? (
              <div className="space-y-4 mt-2">
                {/* Status Badge */}
                <div className="flex items-center space-x-2">
                  <div className={`flex items-center space-x-1.5 text-sm ${
                    task.status === "completed" ? "text-green-600" : "text-slate-500"
                  } px-2 py-0.5 rounded-full bg-white/60 border border-white/30`}>
                    <Check className="h-4 w-4" />
                    <span className="font-medium">{statusDisplayMap[task.status] || task.status}</span>
                  </div>
                  
                  {/* Priority Badge */}
                  {task.priority && (
                    <Badge className={`${priorityColorMap[task.priority.toLowerCase()] || priorityColorMap.none} text-white capitalize`}>
                      {task.priority}
                    </Badge>
                  )}
                </div>
                
                {/* Description */}
                {task.description && (
                  <div className="bg-white/50 rounded-lg p-3 border border-white/30">
                    <Label className="text-sm text-slate-700 font-medium">Description</Label>
                    <p className="mt-1 text-slate-600 whitespace-pre-line">{task.description}</p>
                  </div>
                )}
                
                {/* Due Date */}
                {task.due_date && (
                  <div className="flex items-center space-x-2">
                    <div className={`flex items-center space-x-2 text-sm ${
                      new Date(task.due_date) < new Date() && task.status !== "completed" 
                        ? "text-red-600 font-medium" 
                        : "text-slate-500"
                    }`}>
                      {new Date(task.due_date) < new Date() && task.status !== "completed" 
                        ? <Clock className="h-4 w-4" /> 
                        : <CalendarIcon className="h-4 w-4" />
                      }
                      <span>Due: {formatDueDate(task.due_date)}</span>
                    </div>
                  </div>
                )}
                
                {/* Project */}
                <div className="flex items-center space-x-2 mt-4">
                  <Label className="text-sm text-slate-500">Project:</Label>
                  <div className="flex items-center space-x-2">
                    {task.project_id ? (
                      <span className="text-sm font-medium text-slate-700">{getProjectName()}</span>
                    ) : (
                      <span className="text-sm text-slate-500 italic">No project assigned</span>
                    )}
                  </div>
                </div>
                
                {/* Assignee */}
                <div className="flex items-center space-x-2 mt-4">
                  <Label className="text-sm text-slate-500">Assigned to:</Label>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6 ring-2 ring-white">
                      <AvatarImage src={getAssigneeAvatar()} alt={getAssigneeName()} />
                    </Avatar>
                    <span className="text-sm font-medium text-slate-700">{getAssigneeName()}</span>
                  </div>
                </div>
                
                {/* Created by */}
                {task.creator_first_name && (
                  <div className="text-xs text-slate-400 mt-4">
                    Created by {task.creator_first_name} {task.creator_last_name} on {new Date(task.created_at).toLocaleDateString()}
                  </div>
                )}
              </div>
            ) : (
              <TaskComments taskId={taskId || ""} currentUserId={currentUserId} />
            )}
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-slate-800">
                {isEditing ? "Edit Task" : "Create New Task"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-700">Task Title*</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter task title"
                  required
                  className="border-slate-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-700">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter task description"
                  className="min-h-[80px] border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate" className="text-slate-700">Due Date</Label>
                  <div className="relative">
                    <Input
                      id="dueDate"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="border-slate-300 pr-8"
                    />
                    <CalendarIcon className="absolute right-2 top-2.5 h-4 w-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-slate-700">Priority</Label>
                  <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="flex h-11 w-full rounded-lg border border-slate-300 bg-white/10 px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-slate-700">Status</Label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="flex h-11 w-full rounded-lg border border-slate-300 bg-white/10 px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    <option value="pending">To-Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Done</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="assignedTo" className="text-slate-700">Assign To</Label>
                  <div className="relative">
                    <select
                      id="assignedTo"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="flex h-11 w-full rounded-lg border border-slate-300 bg-white/10 px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    >
                      <option value="">Unassigned</option>
                      {profiles.map((profile) => (
                        <option key={profile.id} value={profile.id}>
                          {profile.first_name} {profile.last_name}
                        </option>
                      ))}
                    </select>
                    <User className="absolute right-2 top-2.5 h-4 w-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>
              </div>
              
              {/* Project select field */}
              <div className="space-y-2">
                <Label htmlFor="projectId" className="text-slate-700">Project</Label>
                <div className="relative">
                  <select
                    id="projectId"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="flex h-11 w-full rounded-lg border border-slate-300 bg-white/10 px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    <option value="">No Project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  <Briefcase className="absolute right-2 top-2.5 h-4 w-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => isEditing ? setIsEditing(false) : onOpenChange(false)}
                  className="border-slate-300 text-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
