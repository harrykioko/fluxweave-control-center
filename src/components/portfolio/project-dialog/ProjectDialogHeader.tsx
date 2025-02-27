
import type { Project } from "@/types/portfolio";
import { cn } from "@/lib/utils";
import { Link as LinkIcon } from "lucide-react";

interface ProjectDialogHeaderProps {
  project: Project;
}

export function ProjectDialogHeader({ project }: ProjectDialogHeaderProps) {
  return (
    <div className="flex items-start gap-4">
      <img
        src={project.logo}
        alt={`${project.name} logo`}
        className="w-20 h-20 rounded-xl object-cover"
      />
      <div>
        <h2 className="text-2xl font-semibold text-slate-800">{project.name}</h2>
        <p className="text-slate-500 mt-1">{project.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-medium",
            project.status === "live" && "bg-emerald-100/50 text-emerald-700",
            project.status === "build" && "bg-amber-100/50 text-amber-700",
            project.status === "paused" && "bg-slate-100/50 text-slate-700",
          )}>
            {project.status}
          </span>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
          >
            <LinkIcon className="h-3 w-3" />
            {project.url.replace('https://', '')}
          </a>
        </div>
      </div>
    </div>
  );
}
