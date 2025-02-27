
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProjectCard } from "./ProjectCard";
import { ProjectDetailDialog } from "./ProjectDetailDialog";
import { NewProjectDialog } from "./NewProjectDialog";
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { transformProject } from "@/utils/projectTransforms";
import type { Project } from "@/types/portfolio";

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);

  const { data: projects, isLoading: isLoadingProjects, refetch: refetchProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(transformProject);
    },
  });

  return (
    <section className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-slate-600" />
          <h2 className="text-2xl font-semibold text-slate-800">Projects</h2>
        </div>
        <Button
          onClick={() => setNewProjectDialogOpen(true)}
          size="sm"
          className="bg-slate-800 hover:bg-slate-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>
      <div className="overflow-x-auto pb-4 -mx-2 px-2">
        <div className="flex gap-6">
          {isLoadingProjects ? (
            <div className="text-center text-slate-500">Loading projects...</div>
          ) : projects && projects.length > 0 ? (
            projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelectedProject(project)}
                className="flex-shrink-0 w-[calc(40%-1rem)]"
              />
            ))
          ) : (
            <div className="text-center text-slate-500">No projects found</div>
          )}
        </div>
      </div>

      <ProjectDetailDialog
        open={!!selectedProject}
        onOpenChange={(open) => !open && setSelectedProject(null)}
        project={selectedProject}
      />
      <NewProjectDialog
        open={newProjectDialogOpen}
        onOpenChange={setNewProjectDialogOpen}
        onProjectAdded={() => refetchProjects()}
      />
    </section>
  );
}

