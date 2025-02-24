
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Brain, Globe, Users, Link as LinkIcon, CheckSquare } from "lucide-react";

interface Project {
  id: string;
  name: string;
  logo: string;
  description: string;
  status: "live" | "build" | "paused";
  url: string;
  teamMembers: {
    id: string;
    name: string;
    avatar: string;
  }[];
}

interface ProjectDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
}

export function ProjectDetailDialog({ open, onOpenChange, project }: ProjectDetailDialogProps) {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[90vh] p-0 bg-white/60 backdrop-blur-xl">
        <div className="grid grid-cols-2 h-full divide-x divide-white/20">
          {/* Left Panel - Project Info */}
          <div className="p-6 space-y-6">
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

            <div className="space-y-4">
              <section className="bg-white/50 backdrop-blur-md rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="h-4 w-4 text-purple-600" />
                  <h3 className="font-medium text-slate-800">AI Workspace</h3>
                </div>
                <div className="bg-white/50 rounded-lg p-4">
                  {/* AI Workspace content will go here */}
                  <p className="text-sm text-slate-600">AI analysis and insights will be displayed here...</p>
                </div>
              </section>

              <section className="bg-white/50 backdrop-blur-md rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="h-4 w-4 text-indigo-600" />
                  <h3 className="font-medium text-slate-800">Operations</h3>
                </div>
                <div className="space-y-2">
                  {/* Ops data will go here */}
                  <p className="text-sm text-slate-600">Login credentials and domain information will be displayed here...</p>
                </div>
              </section>
            </div>
          </div>

          {/* Right Panel - Team & Tasks */}
          <div className="p-6 space-y-6">
            <section className="bg-white/50 backdrop-blur-md rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-4 w-4 text-blue-600" />
                <h3 className="font-medium text-slate-800">Team</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {project.teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-2 bg-white/50 rounded-lg px-3 py-2">
                    <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full" />
                    <span className="text-sm text-slate-700">{member.name}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white/50 backdrop-blur-md rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckSquare className="h-4 w-4 text-emerald-600" />
                <h3 className="font-medium text-slate-800">Tasks</h3>
              </div>
              <div className="space-y-2">
                {/* Task list will go here */}
                <p className="text-sm text-slate-600">Project tasks and to-dos will be displayed here...</p>
              </div>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(" ");
