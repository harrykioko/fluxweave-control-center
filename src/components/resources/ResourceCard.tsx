
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { ResourceType } from "./types";

interface ResourceCardProps {
  id: string;
  title: string;
  description: string;
  link?: string;
  type: ResourceType;
  tags?: string[];
  onClick?: () => void;
  className?: string;
}

export function ResourceCard({ 
  title, 
  description, 
  link, 
  type, 
  tags,
  onClick, 
  className 
}: ResourceCardProps) {
  const getLinkText = () => {
    switch (type) {
      case "tool": return "Visit website";
      case "read": return "Read more";
      case "influencer": return "View profile";
      default: return "Learn more";
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-slate-100",
        "transition-all duration-200 hover:shadow-md",
        "cursor-pointer",
        className
      )}
    >
      <h3 className="font-medium text-slate-800">{title}</h3>
      <p className="text-sm text-slate-600 mt-1 line-clamp-2">{description}</p>
      
      {link && (
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-purple-600 hover:text-purple-800 mt-2 inline-flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          {getLinkText()}
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
      
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tags.map((tag) => (
            <span 
              key={tag} 
              className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
