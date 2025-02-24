
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
}

interface Project {
  id: string;
  name: string;
  logo: string;
  description: string;
  status: "live" | "build" | "paused";
  url: string;
  teamMembers: TeamMember[];
}

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
      {/* Logo and Status */}
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

      {/* Content */}
      <div className="space-y-2 mb-6">
        <h3 className="font-semibold text-slate-800">{project.name}</h3>
        <p className="text-sm text-slate-500 line-clamp-2">{project.description}</p>
      </div>

      {/* Footer */}
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
    </div>
  );
}
