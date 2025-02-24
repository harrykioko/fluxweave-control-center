
import { cn } from "@/lib/utils";
import { Brain } from "lucide-react";

interface IdeaCardProps {
  idea: {
    id: string;
    title: string;
    description: string;
    tags: string[];
    status: "draft" | "active" | "completed";
    createdAt: string;
  };
  onClick?: () => void;
  className?: string;
}

export function IdeaCard({ idea, onClick, className }: IdeaCardProps) {
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
      <div className="flex gap-6">
        {/* Tags Column */}
        <div className="flex flex-col gap-2 min-w-[120px]">
          {idea.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 bg-white/60 rounded-lg text-xs font-medium text-slate-600 hover:bg-white/80 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-white/50 backdrop-blur-md rounded-xl group-hover:bg-white/60 transition-colors">
              <Brain className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800">{idea.title}</h3>
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">{idea.description}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
            <span className={cn(
              "px-2 py-1 rounded-full",
              idea.status === "draft" && "bg-amber-100/50 text-amber-700",
              idea.status === "active" && "bg-emerald-100/50 text-emerald-700",
              idea.status === "completed" && "bg-blue-100/50 text-blue-700",
            )}>
              {idea.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
