
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil, ExternalLink } from "lucide-react";
import type { Resource } from "./types";
import { ResourceTypeSelector } from "./ResourceTypeSelector";
import { CommonResourceFields } from "./CommonResourceFields";
import { ResourceLinkField } from "./ResourceLinkField";
import { ToolResourceForm } from "./forms/ToolResourceForm";
import { ReadResourceForm } from "./forms/ReadResourceForm";
import { SubscriptionResourceForm } from "./forms/SubscriptionResourceForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ResourceDetailDialogProps {
  resource: Resource | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResourceUpdated: () => void;
}

export function ResourceDetailDialog({ 
  resource, 
  open, 
  onOpenChange,
  onResourceUpdated 
}: ResourceDetailDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(resource?.title || "");
  const [description, setDescription] = useState(resource?.description || "");
  const [link, setLink] = useState(resource?.link || "");
  const [tags, setTags] = useState(resource?.tags?.join(", ") || "");
  const [type, setType] = useState(resource?.type || "tool");
  const [pricing, setPricing] = useState(resource?.pricing || "");
  const [category, setCategory] = useState(resource?.category || "");
  const [author, setAuthor] = useState(resource?.author || "");
  const [price, setPrice] = useState(resource?.price || "");
  const [frequency, setFrequency] = useState(resource?.frequency || "");
  const [username, setUsername] = useState(resource?.username || "");
  const [password, setPassword] = useState(resource?.password || "");
  const { toast } = useToast();

  if (!resource) return null;

  const handleEdit = () => {
    setTitle(resource.title);
    setDescription(resource.description);
    setLink(resource.link || "");
    setTags(resource.tags?.join(", ") || "");
    setType(resource.type);
    setPricing(resource.pricing || "");
    setCategory(resource.category || "");
    setAuthor(resource.author || "");
    setPrice(resource.price || "");
    setFrequency(resource.frequency || "");
    setUsername(resource.username || "");
    setPassword(resource.password || "");
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("resources")
        .update({
          title,
          description,
          link,
          tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
          type,
          ...(type === "tool" && { pricing, category }),
          ...(type === "read" && { author, category }),
          ...(type === "subscription" && { price, frequency, username, password }),
        })
        .eq("id", resource.id);

      if (error) throw error;

      toast({
        title: "Resource updated",
        description: "The resource has been successfully updated.",
      });

      setIsEditing(false);
      onResourceUpdated();
    } catch (error) {
      console.error("Error updating resource:", error);
      toast({
        title: "Error",
        description: "Failed to update the resource. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center justify-between">
            {isEditing ? "Edit Resource" : resource.title}
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="ml-4"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </DialogTitle>
          <DialogDescription>
            {!isEditing && 
              `Added ${format(new Date(resource.created_at), "MMMM d, yyyy")}`
            }
          </DialogDescription>
        </DialogHeader>

        {isEditing ? (
          <div className="space-y-4 mt-4">
            <ResourceTypeSelector
              selectedType={type}
              onTypeChange={setType}
            />

            <CommonResourceFields
              title={title}
              description={description}
              tags={tags}
              onTitleChange={setTitle}
              onDescriptionChange={setDescription}
              onTagsChange={setTags}
            />

            {type === "tool" && (
              <ToolResourceForm
                pricing={pricing}
                category={category}
                onPricingChange={setPricing}
                onCategoryChange={setCategory}
              />
            )}

            {type === "read" && (
              <ReadResourceForm
                author={author}
                category={category}
                onAuthorChange={setAuthor}
                onCategoryChange={setCategory}
              />
            )}

            {type === "subscription" && (
              <SubscriptionResourceForm
                price={price}
                frequency={frequency}
                username={username}
                password={password}
                onPriceChange={setPrice}
                onFrequencyChange={setFrequency}
                onUsernameChange={setUsername}
                onPasswordChange={setPassword}
              />
            )}

            <ResourceLinkField
              link={link}
              type={type}
              onLinkChange={setLink}
            />

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            <p className="text-slate-600">{resource.description}</p>

            {resource.tags && resource.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mt-6">
              {type === "tool" && (
                <>
                  {resource.pricing && (
                    <div>
                      <h4 className="font-medium text-slate-700">Pricing</h4>
                      <p className="text-slate-600">{resource.pricing}</p>
                    </div>
                  )}
                  {resource.category && (
                    <div>
                      <h4 className="font-medium text-slate-700">Category</h4>
                      <p className="text-slate-600">{resource.category}</p>
                    </div>
                  )}
                </>
              )}

              {type === "read" && (
                <>
                  {resource.author && (
                    <div>
                      <h4 className="font-medium text-slate-700">Author</h4>
                      <p className="text-slate-600">{resource.author}</p>
                    </div>
                  )}
                  {resource.category && (
                    <div>
                      <h4 className="font-medium text-slate-700">Category</h4>
                      <p className="text-slate-600">{resource.category}</p>
                    </div>
                  )}
                </>
              )}

              {type === "subscription" && (
                <>
                  {resource.price && (
                    <div>
                      <h4 className="font-medium text-slate-700">Price</h4>
                      <p className="text-slate-600">{resource.price}</p>
                    </div>
                  )}
                  {resource.frequency && (
                    <div>
                      <h4 className="font-medium text-slate-700">Frequency</h4>
                      <p className="text-slate-600">{resource.frequency}</p>
                    </div>
                  )}
                  {resource.username && (
                    <div>
                      <h4 className="font-medium text-slate-700">Username</h4>
                      <p className="text-slate-600">{resource.username}</p>
                    </div>
                  )}
                  {resource.password && (
                    <div>
                      <h4 className="font-medium text-slate-700">Password</h4>
                      <p className="text-slate-600">••••••••</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {resource.link && (
              <div className="mt-6">
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-purple-600 hover:text-purple-800"
                >
                  Visit Resource
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
