
import { useState } from "react";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { ProjectDetailDialog } from "@/components/portfolio/ProjectDetailDialog";
import { DomainCard } from "@/components/portfolio/DomainCard";
import { SocialMediaCard } from "@/components/portfolio/SocialMediaCard";
import { DomainDetailDialog } from "@/components/portfolio/DomainDetailDialog";
import { SocialDetailDialog } from "@/components/portfolio/SocialDetailDialog";
import { Globe, Users } from "lucide-react";

// Mock data - replace with real data later
const projects = [{
  id: "1",
  name: "Project Alpha",
  logo: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
  description: "A revolutionary SaaS platform for enterprise productivity",
  status: "live",
  url: "https://alpha-project.com",
  teamMembers: [
    { id: "1", name: "John Doe", avatar: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
    { id: "2", name: "Jane Smith", avatar: "https://images.unsplash.com/photo-1501286353178-1ec881214838" }
  ]
}];

const domains = [{
  id: "1",
  name: "alpha-project.com",
  url: "https://alpha-project.com",
  pageViews: 12500,
  avgTime: "2:30"
}];

const socialAccounts = [{
  id: "1",
  platform: "Twitter",
  handle: "@alphaproject",
  followers: 5200,
  engagement: "4.8%"
}];

interface Entity {
  id: string;
  [key: string]: any;
}

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<Entity | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<Entity | null>(null);
  const [selectedSocial, setSelectedSocial] = useState<Entity | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/90 to-slate-100/80 p-8">
      {/* Projects Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">Projects</h2>
        <div className="relative">
          <div className="flex overflow-x-auto pb-6 gap-6 snap-x">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <div className="grid grid-cols-2 gap-8">
        {/* Domains */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Globe className="h-5 w-5 text-slate-600" />
            <h2 className="text-xl font-semibold text-slate-800">Domains</h2>
          </div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4">
            {domains.map(domain => (
              <DomainCard
                key={domain.id}
                domain={domain}
                onClick={() => setSelectedDomain(domain)}
              />
            ))}
          </div>
        </section>

        {/* Social Media */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Users className="h-5 w-5 text-slate-600" />
            <h2 className="text-xl font-semibold text-slate-800">Social Media</h2>
          </div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4">
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

      {/* Modals */}
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
  );
}
