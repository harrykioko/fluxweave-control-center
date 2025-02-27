
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link as LinkIcon } from "lucide-react";
import { ResourceType } from "./types";

interface ResourceLinkFieldProps {
  link: string;
  type: ResourceType;
  onLinkChange: (value: string) => void;
}

export function ResourceLinkField({ link, type, onLinkChange }: ResourceLinkFieldProps) {
  const getPlaceholder = () => {
    switch (type) {
      case "tool":
        return "https://tool-website.com";
      case "read":
        return "https://book-link.com";
      case "subscription":
        return "https://subscription-url.com";
      default:
        return "https://example.com";
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="link">Link</Label>
      <div className="relative">
        <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          id="link"
          value={link}
          onChange={(e) => onLinkChange(e.target.value)}
          placeholder={getPlaceholder()}
          className="pl-9"
        />
      </div>
    </div>
  );
}
