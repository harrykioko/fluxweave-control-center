
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Project } from "@/types/portfolio";
import { ProjectDialogHeader } from "./project-dialog/ProjectDialogHeader";
import { ProjectAIWorkspace } from "./project-dialog/ProjectAIWorkspace";
import { ProjectAssociations } from "./project-dialog/ProjectAssociations";

interface ProjectDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
}

export function ProjectDetailDialog({ open, onOpenChange, project }: ProjectDetailDialogProps) {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[90vh] p-0 bg-white/90 backdrop-blur-xl border border-white/20">
        <DialogTitle className="sr-only">Project Details: {project.name}</DialogTitle>
        <DialogDescription className="sr-only">
          Detailed information and management options for {project.name}
        </DialogDescription>
        <div className="grid grid-cols-2 h-full">
          <div className="p-6 space-y-6 border-r border-slate-200 overflow-y-auto">
            <ProjectDialogHeader project={project} />
            <Separator />
            <ProjectAssociations project={project} />
          </div>
          <div className="p-6">
            <ProjectAIWorkspace />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
