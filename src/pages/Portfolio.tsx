
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { ProjectDetailDialog } from "@/components/portfolio/ProjectDetailDialog";
import { DomainCard } from "@/components/portfolio/DomainCard";
import { SocialMediaCard } from "@/components/portfolio/SocialMediaCard";
import { DomainDetailDialog } from "@/components/portfolio/DomainDetailDialog";
import { SocialDetailDialog } from "@/components/portfolio/SocialDetailDialog";
import { Globe, Plus, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { NewDomainDialog } from "@/components/portfolio/NewDomainDialog";
import { NewSocialDialog } from "@/components/portfolio/NewSocialDialog";
import { Button } from "@/components/ui/button";

type Domain = Database["public"]["Tables"]["domains"]["Row"];

interface Project {
  id: string;
  name: string;
  logo: string;
  description: string;
  status: "live" | "build" | "paused";
  url: string;
  teamMembers: {
    id: string;
    name: string;
    avatar: string;
  }[];
}

interface SocialAccount {
  id: string;
  platform: string;
  handle: string;
  followers: number;
  engagement: string;
}

const projects: Project[] = [{
  id: "1",
  name: "Project Alpha",
  logo: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
  description: "A revolutionary SaaS platform for enterprise productivity",
  status: "live",
  url: "https://alpha-project.com",
  teamMembers: [
    { id: "1", name: "John Doe", avatar: "https://images.unsplash.com/photo-1535268647778-1ec881214838" },
    { id: "2", name: "Jane Smith", avatar: "https://images.unsplash.com/photo-1501286353178-1ec871214838" }
  ]
}];

const socialAccounts: SocialAccount[] = [{
  id: "1",
  platform: "Twitter",
  handle: "@alphaproject",
  followers: 5200,
  engagement: "4.8%"
}];

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [selectedSocial, setSelectedSocial] = useState<SocialAccount | null>(null);
  const [newDomainDialogOpen, setNewDomainDialogOpen] = useState(false);
  const [newSocialDialogOpen, setNewSocialDialogOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/90 to-slate-100/80">
      <div className="container mx-auto p-8 space-y-8">
        {/* Projects Section */}
        <section className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">Projects</h2>
          <div className="overflow-x-auto pb-4 -mx-2 px-2">
            <div className="flex gap-6">
              {projects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                  className="flex-shrink-0 w-[calc(40%-1rem)]"
                />
              ))}
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
              {socialAccounts.map(account => (
                <SocialMediaCard
                  key={account.id}
                  account={account}
                  onClick={() => setSelectedSocial(account)}
                />
              ))}
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
        <NewDomainDialog
          open={newDomainDialogOpen}
          onOpenChange={setNewDomainDialogOpen}
          onDomainAdded={() => refetchDomains()}
        />
        <NewSocialDialog
          open={newSocialDialogOpen}
          onOpenChange={setNewSocialDialogOpen}
        />
      </div>
    </div>
  );
}
