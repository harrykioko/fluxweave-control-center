
import { useState } from "react";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { ProjectDetailDialog } from "@/components/portfolio/ProjectDetailDialog";
import { DomainCard } from "@/components/portfolio/DomainCard";
import { SocialMediaCard } from "@/components/portfolio/SocialMediaCard";
import { DomainDetailDialog } from "@/components/portfolio/DomainDetailDialog";
import { SocialDetailDialog } from "@/components/portfolio/SocialDetailDialog";
import { Globe, Users } from "lucide-react";

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

interface Domain {
  id: string;
  name: string;
  url: string;
  pageViews: number;
  avgTime: string;
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
    { id: "2", name: "Jane Smith", avatar: "https://images.unsplash.com/photo-1501286353178-1ec881214838" }
  ]
}];

const domains: Domain[] = [{
  id: "1",
  name: "alpha-project.com",
  url: "https://alpha-project.com",
  pageViews: 12500,
  avgTime: "2:30"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/90 to-slate-100/80">
      <div className="container mx-auto p-8 space-y-8">
        {/* Projects Section with Horizontal Scroll */}
        <section className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-xl p-6 w-full">
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
            <div className="flex items-center gap-2 mb-6">
              <Globe className="h-5 w-5 text-slate-600" />
              <h2 className="text-xl font-semibold text-slate-800">Domains</h2>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {domains.map(domain => (
                <DomainCard
                  key={domain.id}
                  domain={domain}
                  onClick={() => setSelectedDomain(domain)}
                />
              ))}
            </div>
          </section>

          <section className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Users className="h-5 w-5 text-slate-600" />
              <h2 className="text-xl font-semibold text-slate-800">Social Media</h2>
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
      </div>
    </div>
  );
}
