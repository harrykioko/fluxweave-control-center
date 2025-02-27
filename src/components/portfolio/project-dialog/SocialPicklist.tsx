
import { useQuery } from "@tanstack/react-query";
import { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { List } from "lucide-react";
import { cn } from "@/lib/utils";

type SocialAccount = Database['public']['Tables']['social_accounts']['Row'];

interface SocialPicklistProps {
  selectedAccountIds: string[];
  onSelect: (accountId: string) => void;
  className?: string;
}

export function SocialPicklist({ selectedAccountIds, onSelect, className }: SocialPicklistProps) {
  const { data: accounts, isLoading } = useQuery({
    queryKey: ['social_accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_accounts')
        .select('*')
        .order('account_name');
      if (error) throw error;
      return data as SocialAccount[];
    },
  });

  return (
    <div className={className}>
      <Label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
        <List className="h-4 w-4" />
        Social Accounts
      </Label>
      {isLoading ? (
        <div className="text-sm text-slate-500">Loading social accounts...</div>
      ) : accounts && accounts.length > 0 ? (
        <div className="space-y-2">
          {accounts.map((account) => (
            <div
              key={account.id}
              onClick={() => onSelect(account.id)}
              className={cn(
                "p-2 rounded-lg cursor-pointer transition-colors",
                "hover:bg-slate-100",
                selectedAccountIds.includes(account.id) && "bg-slate-100"
              )}
            >
              <div className="font-medium text-slate-800">{account.account_name}</div>
              <div className="text-xs text-slate-500">@{account.handle}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-slate-500">No social accounts found</div>
      )}
    </div>
  );
}
