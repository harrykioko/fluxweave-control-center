
import { cn } from "@/lib/utils";
import type { Project } from "@/types/portfolio";

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <img
        src={project.logo}
        alt={`${project.name} logo`}
        className="w-16 h-16 rounded-lg object-cover"
      />
      <span className={cn(
        "px-3 py-1 rounded-full text-xs font-medium",
        project.status === "live" && "bg-emerald-100/50 text-emerald-700",
        project.status === "build" && "bg-amber-100/50 text-amber-700",
        project.status === "paused" && "bg-slate-100/50 text-slate-700",
      )}>
        {project.status}
      </span>
    </div>
  );
}
