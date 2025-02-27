
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Project } from "@/types/portfolio";
import { ProjectDialogHeader } from "./project-dialog/ProjectDialogHeader";
import { ProjectAIWorkspace } from "./project-dialog/ProjectAIWorkspace";
import { ProjectOperations } from "./project-dialog/ProjectOperations";
import { ProjectTeam } from "./project-dialog/ProjectTeam";
import { ProjectTasks } from "./project-dialog/ProjectTasks";

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
            <ProjectDialogHeader project={project} />
            <ProjectAIWorkspace />
            <ProjectOperations />
          </div>

          {/* Right Panel - Team & Tasks */}
          <div className="p-6 space-y-6">
            <ProjectTeam teamMembers={project.teamMembers} />
            <ProjectTasks />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
