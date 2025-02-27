
import { cn } from "@/lib/utils";
import type { Project } from "@/types/portfolio";
import { ProjectHeader } from "./ProjectHeader";
import { ProjectContent } from "./ProjectContent";
import { ProjectFooter } from "./ProjectFooter";

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  className?: string;
}

export function ProjectCard({ project, onClick, className }: ProjectCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white/40 backdrop-blur-xl border border-white/20 rounded-xl p-6",
        "min-w-[400px] max-w-[400px] transition-all duration-200",
        "hover:shadow-xl hover:translate-y-[-2px] hover:bg-white/50 cursor-pointer",
        "snap-start",
        className
      )}
    >
      <ProjectHeader project={project} />
      <ProjectContent project={project} />
      <ProjectFooter project={project} />
    </div>
  );
}
