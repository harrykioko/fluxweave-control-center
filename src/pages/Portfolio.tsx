
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { DomainsSection } from "@/components/portfolio/DomainsSection";
import { SocialSection } from "@/components/portfolio/SocialSection";

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/90 to-slate-100/80">
      <div className="container mx-auto p-8 space-y-8">
        <ProjectsSection />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <DomainsSection />
          <SocialSection />
        </div>
      </div>
    </div>
  );
}

