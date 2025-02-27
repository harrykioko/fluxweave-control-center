
import { Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/portfolio";

interface ProjectStatusProps {
  status: Project["status"];
  url?: string | null;
}

export function ProjectStatus({ status, url }: ProjectStatusProps) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <span className={cn(
        "px-3 py-1 rounded-full text-xs font-medium",
        status === "live" && "bg-emerald-100/50 text-emerald-700",
        status === "build" && "bg-amber-100/50 text-amber-700",
        status === "paused" && "bg-slate-100/50 text-slate-700",
      )}>
        {status}
      </span>
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
        >
          <LinkIcon className="h-3 w-3" />
          {url.replace('https://', '')}
        </a>
      )}
    </div>
  );
}
