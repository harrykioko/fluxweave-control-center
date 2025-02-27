
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, User, Briefcase } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useQuery } from "@tanstack/react-query";

interface NewTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profiles: any[];
}

export function NewTaskDialog({ open, onOpenChange, profiles }: NewTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [projectId, setProjectId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch projects for selection
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, name, logo_url");

      if (error) throw error;
      return data;
    },
    enabled: open, // Only fetch when dialog is open
  });

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

    setIsSubmitting(true);
    
    try {
      // Get the authenticated user's ID for the created_by field
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You need to be logged in to create tasks",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const { data, error } = await supabase
        .from("tasks")
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          status,
          priority,
          due_date: dueDate || null,
          assigned_to: assignedTo || null,
          project_id: projectId || null,
          created_by: user.id,
        })
        .select();

      if (error) {
        console.error("Error creating task:", error);
        toast({
          title: "Error",
          description: "Failed to create task. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Reset form fields
      setTitle("");
      setDescription("");
      setStatus("pending");
      setPriority("medium");
      setDueDate("");
      setAssignedTo("");
      setProjectId("");
      
      // Invalidate and refetch tasks query
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      
      // Close dialog
      onOpenChange(false);
      
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white/90 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
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
              onClick={() => onOpenChange(false)}
              className="border-slate-300 text-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
