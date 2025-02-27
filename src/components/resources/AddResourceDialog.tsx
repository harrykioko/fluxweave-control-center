
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wrench, BookOpen, Users, Plus, Link as LinkIcon } from "lucide-react";
import { ResourceType } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface AddResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResourceAdded: () => void;
}

export function AddResourceDialog({
  open,
  onOpenChange,
  onResourceAdded,
}: AddResourceDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [tags, setTags] = useState("");
  const [type, setType] = useState<ResourceType>("tool");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLink("");
    setTags("");
    setType("tool");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Convert tags string to array
    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");
    
    setIsSubmitting(true);
    
    try {
      // Get the current authenticated user's ID from Supabase
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      const { error } = await supabase.from("resources").insert({
        title,
        description,
        link: link || null,
        type,
        tags: tagsArray.length > 0 ? tagsArray : null,
        user_id: user.id
      });
      
      if (error) throw error;
      
      toast({
        title: "Resource added",
        description: "Your resource has been added successfully",
      });
      
      resetForm();
      onResourceAdded();
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding resource:", error);
      toast({
        title: "Failed to add resource",
        description: "An error occurred while adding the resource",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white/80 backdrop-blur-xl">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Plus className="h-5 w-5 text-slate-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">Add New Resource</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title*</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Figma, Atomic Habits, Paul Graham"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description*</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief description of this resource"
                className="min-h-[80px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">Link</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://example.com"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="design, productivity, startup"
              />
            </div>

            <div className="space-y-2">
              <Label>Resource Type*</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={type === "tool" ? "default" : "outline"}
                  className={type === "tool" ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                  onClick={() => setType("tool")}
                >
                  <Wrench className="mr-2 h-4 w-4" />
                  Tool
                </Button>
                
                <Button
                  type="button"
                  variant={type === "read" ? "default" : "outline"}
                  className={type === "read" ? "bg-blue-500 hover:bg-blue-600" : ""}
                  onClick={() => setType("read")}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Read
                </Button>
                
                <Button
                  type="button"
                  variant={type === "subscription" ? "default" : "outline"}
                  className={type === "subscription" ? "bg-purple-500 hover:bg-purple-600" : ""}
                  onClick={() => setType("subscription")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Subscription
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Resource"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
