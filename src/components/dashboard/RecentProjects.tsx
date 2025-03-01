
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { transformProject } from "@/utils/projectTransforms";
import type { Project } from "@/types/portfolio";

export function RecentProjects() {
  // Fetch the recent projects
  const { data: recentProjects, isLoading } = useQuery({
    queryKey: ['recentProjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data.map(transformProject);
    },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white px-1 flex items-center">
        <Briefcase className="h-5 w-5 mr-2" />
        Recent Projects
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {isLoading ? (
          // Loading state
          Array(3).fill(0).map((_, i) => (
            <div 
              key={i} 
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-5 shadow-lg h-36 animate-pulse"
            />
          ))
        ) : recentProjects && recentProjects.length > 0 ? (
          // Projects found
          recentProjects.map((project) => (
            <div 
              key={project.id} 
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-5 shadow-lg hover:bg-white/15 transition-all duration-200"
            >
              <div className="flex items-start space-x-3">
                <div className="h-12 w-12 rounded-md bg-white/20 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  <img 
                    src={project.logo} 
                    alt={project.name} 
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-white">{project.name}</h3>
                  <p className="text-sm text-slate-300 mt-1 line-clamp-2">{project.description}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          // No projects found
          <div className="col-span-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 text-center">
            <p className="text-slate-300">No projects found. Create your first project to get started.</p>
            <Button 
              className="mt-4 bg-white/10 hover:bg-white/20 text-white"
              onClick={() => window.location.href = '/portfolio'}
            >
              Create Project
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
