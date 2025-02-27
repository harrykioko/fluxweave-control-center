
import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Project } from "@/types/portfolio";
import { useQuery } from "@tanstack/react-query";
import { LogoUploader } from "./project-header/LogoUploader";
import { EditableProjectDetails } from "./project-header/EditableProjectDetails";
import { ProjectStatus } from "./project-header/ProjectStatus";

interface ProjectDialogHeaderProps {
  project: Project;
}

export function ProjectDialogHeader({ project }: ProjectDialogHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDomainIds, setSelectedDomainIds] = useState<string[]>([]);
  const [selectedSocialIds, setSelectedSocialIds] = useState<string[]>([]);
  const { toast } = useToast();

  // Fetch existing associations
  const { data: existingDomains } = useQuery({
    queryKey: ['project-domains', project.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_domains')
        .select('domain_id')
        .eq('project_id', project.id);
      if (error) throw error;
      return data.map(d => d.domain_id);
    },
  });

  const { data: existingSocials } = useQuery({
    queryKey: ['project-socials', project.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_socials')
        .select('social_id')
        .eq('project_id', project.id);
      if (error) throw error;
      return data.map(s => s.social_id);
    },
  });

  useEffect(() => {
    if (existingDomains) setSelectedDomainIds(existingDomains);
    if (existingSocials) setSelectedSocialIds(existingSocials);
  }, [existingDomains, existingSocials]);

  const handleSave = async (details: { name: string; description: string; url: string }) => {
    try {
      // Update project details
      const { error: projectError } = await supabase
        .from('projects')
        .update({
          name: details.name,
          description: details.description || null,
          url: details.url || null,
        })
        .eq('id', project.id);

      if (projectError) throw projectError;

      // Update domain associations
      if (existingDomains) {
        const toRemove = existingDomains.filter(id => !selectedDomainIds.includes(id));
        const toAdd = selectedDomainIds.filter(id => !existingDomains.includes(id));

        if (toRemove.length > 0) {
          const { error } = await supabase
            .from('project_domains')
            .delete()
            .eq('project_id', project.id)
            .in('domain_id', toRemove);
          if (error) throw error;
        }

        if (toAdd.length > 0) {
          const { error } = await supabase
            .from('project_domains')
            .insert(toAdd.map(domainId => ({
              project_id: project.id,
              domain_id: domainId,
            })));
          if (error) throw error;
        }
      }

      // Update social account associations
      if (existingSocials) {
        const toRemove = existingSocials.filter(id => !selectedSocialIds.includes(id));
        const toAdd = selectedSocialIds.filter(id => !existingSocials.includes(id));

        if (toRemove.length > 0) {
          const { error } = await supabase
            .from('project_socials')
            .delete()
            .eq('project_id', project.id)
            .in('social_id', toRemove);
          if (error) throw error;
        }

        if (toAdd.length > 0) {
          const { error } = await supabase
            .from('project_socials')
            .insert(toAdd.map(socialId => ({
              project_id: project.id,
              social_id: socialId,
            })));
          if (error) throw error;
        }
      }

      toast({
        title: "Project updated",
        description: "Project details have been successfully updated",
      });
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error updating project",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <LogoUploader
          projectId={project.id}
          currentLogo={project.logo}
          projectName={project.name}
        />
        <div className="flex-1">
          {isEditing ? (
            <EditableProjectDetails
              name={project.name}
              description={project.description || ""}
              url={project.url || ""}
              selectedDomainIds={selectedDomainIds}
              selectedSocialIds={selectedSocialIds}
              onDomainSelect={(domainId) => {
                setSelectedDomainIds(prev => 
                  prev.includes(domainId)
                    ? prev.filter(id => id !== domainId)
                    : [...prev, domainId]
                );
              }}
              onSocialSelect={(socialId) => {
                setSelectedSocialIds(prev =>
                  prev.includes(socialId)
                    ? prev.filter(id => id !== socialId)
                    : [...prev, socialId]
                );
              }}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold text-slate-800">{project.name}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-slate-500 mt-1">{project.description}</p>
              <ProjectStatus status={project.status} url={project.url} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
