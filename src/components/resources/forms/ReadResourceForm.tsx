
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ReadResourceFormProps {
  author: string;
  category: string;
  onAuthorChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export function ReadResourceForm({
  author,
  category,
  onAuthorChange,
  onCategoryChange,
}: ReadResourceFormProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="author">Author</Label>
        <Input
          id="author"
          value={author}
          onChange={(e) => onAuthorChange(e.target.value)}
          placeholder="Author's name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          placeholder="Business, Self-help, Technology"
        />
      </div>
    </>
  );
}
