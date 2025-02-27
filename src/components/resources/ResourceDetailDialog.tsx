
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Resource } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ResourceDetailHeader } from "./detail/ResourceDetailHeader";
import { ResourceDetailForm } from "./detail/ResourceDetailForm";
import { ResourceDetailContent } from "./detail/ResourceDetailContent";

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
        <ResourceDetailHeader 
          resource={resource}
          isEditing={isEditing}
          onEdit={handleEdit}
        />

        {isEditing ? (
          <ResourceDetailForm
            title={title}
            description={description}
            link={link}
            tags={tags}
            type={type}
            pricing={pricing}
            category={category}
            author={author}
            price={price}
            frequency={frequency}
            username={username}
            password={password}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onTagsChange={setTags}
            onTypeChange={setType}
            onLinkChange={setLink}
            onPricingChange={setPricing}
            onCategoryChange={setCategory}
            onAuthorChange={setAuthor}
            onPriceChange={setPrice}
            onFrequencyChange={setFrequency}
            onUsernameChange={setUsername}
            onPasswordChange={setPassword}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <ResourceDetailContent resource={resource} />
        )}
      </DialogContent>
    </Dialog>
  );
}
