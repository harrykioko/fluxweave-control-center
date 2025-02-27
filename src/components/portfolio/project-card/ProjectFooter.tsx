
import { ExternalLink } from "lucide-react";
import type { Project } from "@/types/portfolio";

interface ProjectFooterProps {
  project: Project;
}

export function ProjectFooter({ project }: ProjectFooterProps) {
  return (
    <div className="flex justify-between items-center">
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <ExternalLink className="h-3 w-3" />
        {project.url.replace('https://', '')}
      </a>
      <div className="flex -space-x-2">
        {project.teamMembers.map((member) => (
          <img
            key={member.id}
            src={member.avatar}
            alt={member.name}
            className="w-6 h-6 rounded-full border-2 border-white"
            title={member.name}
          />
        ))}
      </div>
    </div>
  );
}
