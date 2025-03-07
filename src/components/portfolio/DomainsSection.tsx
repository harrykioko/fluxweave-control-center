
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DomainCard } from "./DomainCard";
import { DomainDetailDialog } from "./DomainDetailDialog";
import { NewDomainDialog } from "./NewDomainDialog";
import { Button } from "@/components/ui/button";
import { Globe, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { ScrollArea } from "@/components/ui/scroll-area";

type Domain = Database["public"]["Tables"]["domains"]["Row"];

export function DomainsSection() {
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [newDomainDialogOpen, setNewDomainDialogOpen] = useState(false);

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
      <ScrollArea className="h-[400px] pr-2">
        <div className="space-y-4 pr-4">
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
      </ScrollArea>

      <DomainDetailDialog
        open={!!selectedDomain}
        onOpenChange={(open) => !open && setSelectedDomain(null)}
        domain={selectedDomain}
      />
      <NewDomainDialog
        open={newDomainDialogOpen}
        onOpenChange={setNewDomainDialogOpen}
        onDomainAdded={() => refetchDomains()}
      />
    </section>
  );
}
