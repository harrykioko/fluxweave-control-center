
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { DomainsSection } from "@/components/portfolio/DomainsSection";
import { SocialSection } from "@/components/portfolio/SocialSection";

export default function Portfolio() {
  return (
    <div className="min-h-screen pt-20 px-4 md:px-8 bg-gradient-to-br from-slate-800/90 via-slate-700/80 to-slate-800/90">
      <div className="container mx-auto space-y-8">
        <ProjectsSection />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <DomainsSection />
          <SocialSection />
        </div>
      </div>
    </div>
  );
}
