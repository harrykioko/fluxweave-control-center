
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ResourceTypeSelector } from "./ResourceTypeSelector";
import { CommonResourceFields } from "./CommonResourceFields";
import { ResourceLinkField } from "./ResourceLinkField";
import { ToolResourceForm } from "./forms/ToolResourceForm";
import { ReadResourceForm } from "./forms/ReadResourceForm";
import { SubscriptionResourceForm } from "./forms/SubscriptionResourceForm";
import { useResourceForm } from "./hooks/useResourceForm";

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
  const {
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
  } = useResourceForm({
    onResourceAdded,
    onFormSubmitted: () => onOpenChange(false),
  });

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
            {/* Resource Type Selector */}
            <div className="space-y-2">
              <Label>Resource Type*</Label>
              <ResourceTypeSelector
                selectedType={type}
                onTypeChange={setType}
              />
            </div>

            {/* Common Fields */}
            <CommonResourceFields
              title={title}
              description={description}
              tags={tags}
              onTitleChange={setTitle}
              onDescriptionChange={setDescription}
              onTagsChange={setTags}
            />

            {/* Type-specific Fields */}
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

            {/* Link Field */}
            <ResourceLinkField
              link={link}
              type={type}
              onLinkChange={setLink}
            />

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
