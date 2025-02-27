
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Globe, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Project } from "@/types/portfolio";
import { DomainCard } from "../DomainCard";
import { SocialMediaCard } from "../SocialMediaCard";
import { DomainDetailDialog } from "../DomainDetailDialog";
import { SocialDetailDialog } from "../SocialDetailDialog";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

type Domain = Database["public"]["Tables"]["domains"]["Row"];
type SocialAccount = Database["public"]["Tables"]["social_accounts"]["Row"];

interface ProjectAssociationsProps {
  project: Project;
}

export function ProjectAssociations({ project }: ProjectAssociationsProps) {
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [selectedSocial, setSelectedSocial] = useState<SocialAccount | null>(null);
  const { toast } = useToast();

  // Fetch domains with full data
  const { data: domains, isLoading: isLoadingDomains } = useQuery({
    queryKey: ['project-domains', project.id],
    queryFn: async () => {
      try {
        // First get the domain IDs
        const { data: projectDomains, error: projectDomainsError } = await supabase
          .from('project_domains')
          .select('domain_id')
          .eq('project_id', project.id);
        
        if (projectDomainsError) {
          console.error('Error fetching project domains:', projectDomainsError);
          throw projectDomainsError;
        }
        
        if (!projectDomains?.length) return [];
        
        // Then fetch the full domain data
        const { data: domains, error: domainsError } = await supabase
          .from('domains')
          .select('*')
          .in('id', projectDomains.map(pd => pd.domain_id));
        
        if (domainsError) {
          console.error('Error fetching domains:', domainsError);
          throw domainsError;
        }

        return domains || [];
      } catch (error) {
        toast({
          title: "Error loading domains",
          description: "Could not load associated domains. Please try again later.",
          variant: "destructive"
        });
        return [];
      }
    },
  });

  // Fetch social accounts with full data
  const { data: socials, isLoading: isLoadingSocials } = useQuery({
    queryKey: ['project-socials', project.id],
    queryFn: async () => {
      try {
        const { data: projectSocials, error: projectSocialsError } = await supabase
          .from('project_socials')
          .select('social_id')
          .eq('project_id', project.id);
        
        if (projectSocialsError) {
          console.error('Error fetching project socials:', projectSocialsError);
          throw projectSocialsError;
        }
        
        if (!projectSocials?.length) return [];
        
        const { data: socials, error: socialsError } = await supabase
          .from('social_accounts')
          .select('*')
          .in('id', projectSocials.map(ps => ps.social_id));
        
        if (socialsError) {
          console.error('Error fetching social accounts:', socialsError);
          throw socialsError;
        }

        return socials || [];
      } catch (error) {
        toast({
          title: "Error loading social accounts",
          description: "Could not load associated social accounts. Please try again later.",
          variant: "destructive"
        });
        return [];
      }
    },
  });

  return (
    <div className="space-y-8">
      {/* Associated Domains */}
      <div>
        <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Associated Domains
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {isLoadingDomains ? (
            <div className="text-sm text-slate-500 animate-pulse">Loading domains...</div>
          ) : domains && domains.length > 0 ? (
            domains.map((domain) => (
              <DomainCard
                key={domain.id}
                domain={domain}
                onClick={() => setSelectedDomain(domain)}
              />
            ))
          ) : (
            <p className="text-sm text-slate-500 bg-slate-50 rounded-lg p-4">
              No domains associated with this project
            </p>
          )}
        </div>
      </div>

      {/* Associated Social Accounts */}
      <div>
        <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Associated Social Accounts
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {isLoadingSocials ? (
            <div className="text-sm text-slate-500 animate-pulse">Loading social accounts...</div>
          ) : socials && socials.length > 0 ? (
            socials.map((social) => (
              <SocialMediaCard
                key={social.id}
                account={social}
                onClick={() => setSelectedSocial(social)}
              />
            ))
          ) : (
            <p className="text-sm text-slate-500 bg-slate-50 rounded-lg p-4">
              No social accounts associated with this project
            </p>
          )}
        </div>
      </div>

      {/* Detail Dialogs */}
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
