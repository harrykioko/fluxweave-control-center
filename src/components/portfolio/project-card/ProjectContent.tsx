
import type { Project } from "@/types/portfolio";

interface ProjectContentProps {
  project: Project;
}

export function ProjectContent({ project }: ProjectContentProps) {
  return (
    <div className="space-y-2 mb-6">
      <h3 className="font-semibold text-slate-800">{project.name}</h3>
      <p className="text-sm text-slate-500 line-clamp-2">{project.description}</p>
    </div>
  );
}
