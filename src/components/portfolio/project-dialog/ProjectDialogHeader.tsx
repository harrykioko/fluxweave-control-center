
import { useState } from "react";
import type { Project } from "@/types/portfolio";
import { cn } from "@/lib/utils";
import { Link as LinkIcon, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DomainPicklist } from "./DomainPicklist";
import { SocialPicklist } from "./SocialPicklist";
import { useQuery } from "@tanstack/react-query";

interface ProjectDialogHeaderProps {
  project: Project;
}

export function ProjectDialogHeader({ project }: ProjectDialogHeaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || "");
  const [url, setUrl] = useState(project.url || "");
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

  // Set initial selections when data is loaded
  useState(() => {
    if (existingDomains) setSelectedDomainIds(existingDomains);
    if (existingSocials) setSelectedSocialIds(existingSocials);
  }, [existingDomains, existingSocials]);

  const handleLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Logo must be under 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const filePath = `${project.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('project-logos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-logos')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('projects')
        .update({ logo_url: publicUrl })
        .eq('id', project.id);

      if (updateError) throw updateError;

      toast({
        title: "Logo updated",
        description: "Project logo has been successfully updated",
      });

    } catch (error: any) {
      toast({
        title: "Error updating logo",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Update project details
      const { error: projectError } = await supabase
        .from('projects')
        .update({
          name: name.trim(),
          description: description.trim() || null,
          url: url.trim() || null,
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
        <div className="relative group">
          <img
            src={project.logo}
            alt={`${project.name} logo`}
            className={cn(
              "w-20 h-20 rounded-xl object-cover",
              isUploading && "opacity-50"
            )}
          />
          <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl text-white text-sm opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
            Change
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
              disabled={isUploading}
            />
          </label>
        </div>
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="url">Project URL</Label>
                <Input
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave}>Save</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
              <Separator className="my-4" />
              <DomainPicklist
                selectedDomainIds={selectedDomainIds}
                onSelect={(domainId) => {
                  setSelectedDomainIds(prev => 
                    prev.includes(domainId)
                      ? prev.filter(id => id !== domainId)
                      : [...prev, domainId]
                  );
                }}
                className="mb-4"
              />
              <SocialPicklist
                selectedAccountIds={selectedSocialIds}
                onSelect={(socialId) => {
                  setSelectedSocialIds(prev =>
                    prev.includes(socialId)
                      ? prev.filter(id => id !== socialId)
                      : [...prev, socialId]
                  );
                }}
              />
            </div>
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
              <div className="flex items-center gap-2 mt-2">
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  project.status === "live" && "bg-emerald-100/50 text-emerald-700",
                  project.status === "build" && "bg-amber-100/50 text-amber-700",
                  project.status === "paused" && "bg-slate-100/50 text-slate-700",
                )}>
                  {project.status}
                </span>
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
                  >
                    <LinkIcon className="h-3 w-3" />
                    {project.url.replace('https://', '')}
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
