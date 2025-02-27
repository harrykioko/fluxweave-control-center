
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { ProjectDetailDialog } from "@/components/portfolio/ProjectDetailDialog";
import { DomainCard } from "@/components/portfolio/DomainCard";
import { SocialMediaCard } from "@/components/portfolio/SocialMediaCard";
import { DomainDetailDialog } from "@/components/portfolio/DomainDetailDialog";
import { SocialDetailDialog } from "@/components/portfolio/SocialDetailDialog";
import { Globe, Package, Plus, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { NewDomainDialog } from "@/components/portfolio/NewDomainDialog";
import { NewSocialDialog } from "@/components/portfolio/NewSocialDialog";
import { NewProjectDialog } from "@/components/portfolio/NewProjectDialog";
import { Button } from "@/components/ui/button";

type Domain = Database["public"]["Tables"]["domains"]["Row"];
type SocialAccount = Database["public"]["Tables"]["social_accounts"]["Row"];
type Project = Database["public"]["Tables"]["projects"]["Row"];

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [selectedSocial, setSelectedSocial] = useState<SocialAccount | null>(null);
  const [newDomainDialogOpen, setNewDomainDialogOpen] = useState(false);
  const [newSocialDialogOpen, setNewSocialDialogOpen] = useState(false);
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);

  const { data: projects, isLoading: isLoadingProjects, refetch: refetchProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: domains, isLoading: isLoadingDomains, refetch: refetchDomains } = useQuery({
    queryKey: ['domains'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: socialAccounts, isLoading: isLoadingSocial, refetch: refetchSocial } = useQuery({
    queryKey: ['social_accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/90 to-slate-100/80">
      <div className="container mx-auto p-8 space-y-8">
        {/* Projects Section */}
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
        </section>

        {/* Domains and Social Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-slate-600" />
                <h2 className="text-xl font-semibold text-slate-800">Domains</h2>
              </div>
              <Button
                onClick={() => setNewDomainDialogOpen(true)}
                size="sm"
                className="bg-slate-800 hover:bg-slate-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Domain
              </Button>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {isLoadingDomains ? (
                <div className="text-center text-slate-500">Loading domains...</div>
              ) : domains && domains.length > 0 ? (
                domains.map(domain => (
                  <DomainCard
                    key={domain.id}
                    domain={domain}
                    onClick={() => setSelectedDomain(domain)}
                  />
                ))
              ) : (
                <div className="text-center text-slate-500">No domains found</div>
              )}
            </div>
          </section>

          <section className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-slate-600" />
                <h2 className="text-xl font-semibold text-slate-800">Social Media</h2>
              </div>
              <Button
                onClick={() => setNewSocialDialogOpen(true)}
                size="sm"
                className="bg-slate-800 hover:bg-slate-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Social
              </Button>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {isLoadingSocial ? (
                <div className="text-center text-slate-500">Loading social accounts...</div>
              ) : socialAccounts && socialAccounts.length > 0 ? (
                socialAccounts.map(account => (
                  <SocialMediaCard
                    key={account.id}
                    account={account}
                    onClick={() => setSelectedSocial(account)}
                  />
                ))
              ) : (
                <div className="text-center text-slate-500">No social accounts found</div>
              )}
            </div>
          </section>
        </div>

        {/* Dialogs */}
        <ProjectDetailDialog
          open={!!selectedProject}
          onOpenChange={(open) => !open && setSelectedProject(null)}
          project={selectedProject}
        />
        <DomainDetailDialog
          open={!!selectedDomain}
          onOpenChange={(open) => !open && setSelectedDomain(null)}
          domain={selectedDomain}
        />
        <SocialDetailDialog
          open={!!selectedSocial}
          onOpenChange={(open) => !open && setSelectedSocial(null)}
          account={selectedSocial}
        />
        <NewProjectDialog
          open={newProjectDialogOpen}
          onOpenChange={setNewProjectDialogOpen}
          onProjectAdded={() => refetchProjects()}
        />
        <NewDomainDialog
          open={newDomainDialogOpen}
          onOpenChange={setNewDomainDialogOpen}
          onDomainAdded={() => refetchDomains()}
        />
        <NewSocialDialog
          open={newSocialDialogOpen}
          onOpenChange={setNewSocialDialogOpen}
          onSocialAdded={() => refetchSocial()}
        />
      </div>
    </div>
  );
}
