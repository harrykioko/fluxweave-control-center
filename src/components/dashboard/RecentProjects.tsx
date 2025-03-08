import * as React from 'react';
import { FC } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { transformProject } from "@/utils/projectTransforms";
import type { Project } from "@/types/portfolio";

export const RecentProjects: FC = () => {
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
      <h2 className="text-xl font-bold text-primary px-1 flex items-center">
        <Briefcase className="h-5 w-5 mr-2" />
        Recent Projects
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {isLoading ? (
          // Loading state
          Array(3).fill(0).map((_, i) => (
            <div 
              key={i} 
              className="glass-md rounded-xl p-5 h-36 animate-pulse"
            />
          ))
        ) : recentProjects && recentProjects.length > 0 ? (
          // Projects found
          recentProjects.map((project) => (
            <div 
              key={project.id} 
              className="glass-card p-5 hover-scale"
            >
              <div className="flex items-start space-x-3">
                <div className="h-12 w-12 rounded-md glass-sm flex-shrink-0 flex items-center justify-center overflow-hidden">
                  <img 
                    src={project.logo} 
                    alt={project.name} 
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-primary">{project.name}</h3>
                  <p className="text-sm text-secondary mt-1 line-clamp-2">{project.description}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          // No projects found
          <div className="col-span-3 glass-panel p-8 text-center">
            <p className="text-secondary">No projects found. Create your first project to get started.</p>
            <Button 
              variant="glass"
              className="mt-4 glass-hover glass-active"
              onClick={() => window.location.href = '/portfolio'}
            >
              Create Project
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
