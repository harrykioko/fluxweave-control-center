
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wrench, BookOpen, Users, Plus, Link as LinkIcon } from "lucide-react";
import { ResourceType, ResourceInsert, ToolResource, ReadResource, SubscriptionResource } from "./types";
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

  // Additional fields for specific resource types
  const [author, setAuthor] = useState("");
  const [pricing, setPricing] = useState("");
  const [platform, setPlatform] = useState("");
  const [category, setCategory] = useState("");
  const [frequency, setFrequency] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLink("");
    setTags("");
    setType("tool");
    setAuthor("");
    setPricing("");
    setPlatform("");
    setCategory("");
    setFrequency("");
    setUsername("");
    setPassword("");
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
      
      // Create the base resource data
      const baseResource = {
        title,
        description,
        link: link || null,
        type,
        tags: tagsArray.length > 0 ? tagsArray : null,
        user_id: user.id
      };
      
      // Create the properly typed resource object based on the selected type
      let resourceData: ResourceInsert;
      
      if (type === "tool") {
        resourceData = {
          ...baseResource,
          type: "tool", // Explicitly set the type for TypeScript
          pricing: pricing || null,
          category: category || null
        } as ToolResource;
      } else if (type === "read") {
        resourceData = {
          ...baseResource,
          type: "read", // Explicitly set the type for TypeScript
          author: author || null,
          category: category || null
        } as ReadResource;
      } else {
        resourceData = {
          ...baseResource,
          type: "subscription", // Explicitly set the type for TypeScript
          platform: platform || null,
          frequency: frequency || null,
          username: username || null,
          password: password || null
        } as SubscriptionResource;
      }
      
      const { error } = await supabase.from("resources").insert(resourceData);
      
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
            {/* Resource Type Selector - Moved to the top */}
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

            {/* Common fields for all resource types */}
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

            {/* Dynamic fields based on resource type */}
            {type === "tool" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="pricing">Pricing</Label>
                  <Input
                    id="pricing"
                    value={pricing}
                    onChange={(e) => setPricing(e.target.value)}
                    placeholder="Free, $10/month, One-time $49"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Design, Development, Marketing"
                  />
                </div>
              </>
            )}

            {type === "read" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Author's name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Business, Self-help, Technology"
                  />
                </div>
              </>
            )}

            {type === "subscription" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Input
                    id="platform"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    placeholder="YouTube, Substack, Podcast, Twitter"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Input
                    id="frequency"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    placeholder="Daily, Weekly, Monthly"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Account username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Account password"
                  />
                </div>
              </>
            )}

            {/* Link field - common for all but with different placeholder */}
            <div className="space-y-2">
              <Label htmlFor="link">Link</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder={type === "tool" ? "https://tool-website.com" : 
                               type === "read" ? "https://book-link.com" : 
                               "https://subscription-url.com"}
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
