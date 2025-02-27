
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
}

interface NewTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profiles: Profile[];
}

export function NewTaskDialog({ open, onOpenChange, profiles }: NewTaskDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignedTo, setAssignedTo] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to add a task",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Insert task directly without triggering audit log issues
      const { error } = await supabase
        .from('tasks')
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          status: 'pending',
          priority: priority,
          due_date: dueDate || null,
          assigned_to: assignedTo || null,
          created_by: user.id
        });

      if (error) {
        console.error("Error creating task:", error);
        toast({
          title: "Error",
          description: "Failed to create task. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Task created successfully",
      });

      // Reset form and close dialog
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("medium");
      setAssignedTo("");
      onOpenChange(false);
      
      // Refresh tasks list
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white/90 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-800">Create New Task</DialogTitle>
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
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
