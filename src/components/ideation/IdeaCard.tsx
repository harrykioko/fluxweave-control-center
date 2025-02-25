
import { cn } from "@/lib/utils";
import { Brain, Calendar } from "lucide-react";
import { format } from "date-fns";

interface IdeaCardProps {
  idea: {
    id: string;
    title: string;
    description: string;
    tags: string[];
    status: "draft" | "active" | "completed";
    created_at: string;
    createdAt?: string; // Add optional createdAt to support both formats
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    metadata?: {
      analysis?: Record<string, string>;
    };
  };
  onClick?: () => void;
  className?: string;
}

export function IdeaCard({ idea, onClick, className }: IdeaCardProps) {
  // Get the first 2-3 sentences for the preview
  const previewText = idea.description
    .split(/[.!?]+/)
    .slice(0, 2)
    .join(". ")
    .trim() + "...";

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white/40 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg",
        "transition-all duration-200 hover:shadow-xl hover:translate-y-[-2px] hover:bg-white/50",
        "cursor-pointer group",
        className
      )}
    >
      <div className="space-y-4">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-white/50 backdrop-blur-md rounded-xl group-hover:bg-white/60 transition-colors">
            <Brain className="h-5 w-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-800">{idea.title}</h3>
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{previewText}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {idea.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-white/60 rounded-lg text-xs font-medium text-slate-600 hover:bg-white/80 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{format(new Date(idea.created_at), "MMM d, yyyy")}</span>
          </div>
          <span className={cn(
            "px-2 py-1 rounded-full",
            idea.status === "draft" && "bg-amber-100/50 text-amber-700",
            idea.status === "active" && "bg-emerald-100/50 text-emerald-700",
            idea.status === "completed" && "bg-blue-100/50 text-blue-700",
          )}>
            {idea.status}
          </span>
        </div>

        {idea.first_name && (
          <div className="pt-3 border-t border-slate-200/50">
            <p className="text-xs text-slate-400">
              By {idea.first_name} {idea.last_name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
