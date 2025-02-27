
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ToolResourceFormProps {
  pricing: string;
  category: string;
  onPricingChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export function ToolResourceForm({
  pricing,
  category,
  onPricingChange,
  onCategoryChange,
}: ToolResourceFormProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="pricing">Pricing</Label>
        <Input
          id="pricing"
          value={pricing}
          onChange={(e) => onPricingChange(e.target.value)}
          placeholder="Free, $10/month, One-time $49"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          placeholder="Design, Development, Marketing"
        />
      </div>
    </>
  );
}
