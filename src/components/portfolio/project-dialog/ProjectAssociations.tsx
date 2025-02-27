
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

  // Fetch domains associated with the project
  const { data: domains, isLoading: isLoadingDomains } = useQuery({
    queryKey: ['project-domains', project.id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('project_domains')
          .select('domain:domains!project_domains_domain_id_fkey(*)')
          .eq('project_id', project.id);

        if (error) {
          throw error;
        }

        // Extract and filter valid domain objects
        return (data || [])
          .map(item => item.domain)
          .filter((domain): domain is Domain => domain !== null);
      } catch (error) {
        console.error('Error fetching domains:', error);
        toast({
          title: "Error loading domains",
          description: "Could not load associated domains. Please try again later.",
          variant: "destructive"
        });
        return [];
      }
    },
  });

  // Fetch social accounts associated with the project
  const { data: socials, isLoading: isLoadingSocials } = useQuery({
    queryKey: ['project-socials', project.id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('project_socials')
          .select('social:social_accounts!project_socials_social_id_fkey(*)')
          .eq('project_id', project.id);

        if (error) {
          throw error;
        }

        // Extract and filter valid social account objects
        return (data || [])
          .map(item => item.social)
          .filter((social): social is SocialAccount => social !== null);
      } catch (error) {
        console.error('Error fetching social accounts:', error);
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
