
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CommonResourceFieldsProps {
  title: string;
  description: string;
  tags: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onTagsChange: (value: string) => void;
}

export function CommonResourceFields({
  title,
  description,
  tags,
  onTitleChange,
  onDescriptionChange,
  onTagsChange,
}: CommonResourceFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Title*</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="e.g., Figma, Atomic Habits, Paul Graham"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description*</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="A brief description of this resource"
          className="min-h-[80px]"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => onTagsChange(e.target.value)}
          placeholder="design, productivity, startup"
        />
      </div>
    </>
  );
}
