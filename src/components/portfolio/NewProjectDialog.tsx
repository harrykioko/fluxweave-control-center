
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectAdded?: () => void;
}

export function NewProjectDialog({ open, onOpenChange, onProjectAdded }: NewProjectDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a project name",
        variant: "destructive",
      });
      return;
    }

    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to add a project",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await supabase
      .from('projects')
      .insert({
        name: name.trim(),
        description: description.trim() || null,
        url: url.trim() || null,
        status: 'draft',
        user_id: user.id
      });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add project. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Project added successfully",
    });

    // Reset form and close dialog
    setName("");
    setDescription("");
    setUrl("");
    onOpenChange(false);
    onProjectAdded?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white/60 backdrop-blur-xl">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/50 backdrop-blur-md rounded-lg">
              <Package className="h-5 w-5 text-slate-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">Add New Project</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name*</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Awesome Project"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief description of your project"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">Project URL</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://myproject.com"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-700"
              disabled={isLoading}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
