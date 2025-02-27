
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ResourceType, ResourceInsert, ToolResource, ReadResource, SubscriptionResource } from "../types";

interface UseResourceFormProps {
  onResourceAdded: () => void;
  onFormSubmitted: () => void;
}

export function useResourceForm({ onResourceAdded, onFormSubmitted }: UseResourceFormProps) {
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
  const [price, setPrice] = useState("");
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
    setPrice("");
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
          type: "tool",
          pricing: pricing || null,
          category: category || null
        } as ToolResource;
      } else if (type === "read") {
        resourceData = {
          ...baseResource,
          type: "read",
          author: author || null,
          category: category || null
        } as ReadResource;
      } else {
        resourceData = {
          ...baseResource,
          type: "subscription",
          price: price || null,
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
      onFormSubmitted();
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

  return {
    formState: {
      title,
      description,
      link,
      tags,
      type,
      author,
      pricing,
      price,
      category,
      frequency,
      username,
      password,
      isSubmitting,
    },
    setters: {
      setTitle,
      setDescription,
      setLink,
      setTags,
      setType,
      setAuthor,
      setPricing,
      setPrice,
      setCategory,
      setFrequency,
      setUsername,
      setPassword,
    },
    handleSubmit,
  };
}
