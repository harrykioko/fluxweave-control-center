
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LogoUploaderProps {
  projectId: string;
  currentLogo: string;
  projectName: string;
}

export function LogoUploader({ projectId, currentLogo, projectName }: LogoUploaderProps) {
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
      const filePath = `${projectId}/${crypto.randomUUID()}.${fileExt}`;

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
        .eq('id', projectId);

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
    <div className="relative group">
      <img
        src={currentLogo}
        alt={`${projectName} logo`}
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
  );
}
