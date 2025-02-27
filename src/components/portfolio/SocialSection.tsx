
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SocialMediaCard } from "./SocialMediaCard";
import { SocialDetailDialog } from "./SocialDetailDialog";
import { NewSocialDialog } from "./NewSocialDialog";
import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type SocialAccount = Database["public"]["Tables"]["social_accounts"]["Row"];

export function SocialSection() {
  const [selectedSocial, setSelectedSocial] = useState<SocialAccount | null>(null);
  const [newSocialDialogOpen, setNewSocialDialogOpen] = useState(false);

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

      <SocialDetailDialog
        open={!!selectedSocial}
        onOpenChange={(open) => !open && setSelectedSocial(null)}
        account={selectedSocial}
      />
      <NewSocialDialog
        open={newSocialDialogOpen}
        onOpenChange={setNewSocialDialogOpen}
        onSocialAdded={() => refetchSocial()}
      />
    </section>
  );
}

