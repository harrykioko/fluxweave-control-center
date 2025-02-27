
import { useState } from "react";
import type { Project } from "@/types/portfolio";
import { cn } from "@/lib/utils";
import { Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProjectDialogHeaderProps {
  project: Project;
}

export function ProjectDialogHeader({ project }: ProjectDialogHeaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

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

  return (
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
  );
}
