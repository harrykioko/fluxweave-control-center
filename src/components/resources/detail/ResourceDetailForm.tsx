
import { Button } from "@/components/ui/button";
import { ResourceTypeSelector } from "../ResourceTypeSelector";
import { CommonResourceFields } from "../CommonResourceFields";
import { ResourceLinkField } from "../ResourceLinkField";
import { ToolResourceForm } from "../forms/ToolResourceForm";
import { ReadResourceForm } from "../forms/ReadResourceForm";
import { SubscriptionResourceForm } from "../forms/SubscriptionResourceForm";
import type { ResourceType } from "../types";

interface ResourceDetailFormProps {
  title: string;
  description: string;
  link: string;
  tags: string;
  type: ResourceType;
  pricing: string;
  category: string;
  author: string;
  price: string;
  frequency: string;
  username: string;
  password: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onTagsChange: (value: string) => void;
  onTypeChange: (value: ResourceType) => void;
  onLinkChange: (value: string) => void;
  onPricingChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onAuthorChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onFrequencyChange: (value: string) => void;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ResourceDetailForm({
  title,
  description,
  link,
  tags,
  type,
  pricing,
  category,
  author,
  price,
  frequency,
  username,
  password,
  onTitleChange,
  onDescriptionChange,
  onTagsChange,
  onTypeChange,
  onLinkChange,
  onPricingChange,
  onCategoryChange,
  onAuthorChange,
  onPriceChange,
  onFrequencyChange,
  onUsernameChange,
  onPasswordChange,
  onSave,
  onCancel
}: ResourceDetailFormProps) {
  return (
    <div className="space-y-4 mt-4">
      <ResourceTypeSelector
        selectedType={type}
        onTypeChange={onTypeChange}
      />

      <CommonResourceFields
        title={title}
        description={description}
        tags={tags}
        onTitleChange={onTitleChange}
        onDescriptionChange={onDescriptionChange}
        onTagsChange={onTagsChange}
      />

      {type === "tool" && (
        <ToolResourceForm
          pricing={pricing}
          category={category}
          onPricingChange={onPricingChange}
          onCategoryChange={onCategoryChange}
        />
      )}

      {type === "read" && (
        <ReadResourceForm
          author={author}
          category={category}
          onAuthorChange={onAuthorChange}
          onCategoryChange={onCategoryChange}
        />
      )}

      {type === "subscription" && (
        <SubscriptionResourceForm
          price={price}
          frequency={frequency}
          username={username}
          password={password}
          onPriceChange={onPriceChange}
          onFrequencyChange={onFrequencyChange}
          onUsernameChange={onUsernameChange}
          onPasswordChange={onPasswordChange}
        />
      )}

      <ResourceLinkField
        link={link}
        type={type}
        onLinkChange={onLinkChange}
      />

      <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
