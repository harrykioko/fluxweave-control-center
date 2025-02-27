
import { useQuery } from "@tanstack/react-query";
import { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

type Domain = Database['public']['Tables']['domains']['Row'];

interface DomainPicklistProps {
  selectedDomainIds: string[];
  onSelect: (domainId: string) => void;
  className?: string;
}

export function DomainPicklist({ selectedDomainIds, onSelect, className }: DomainPicklistProps) {
  const { data: domains, isLoading } = useQuery({
    queryKey: ['domains'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as Domain[];
    },
  });

  return (
    <div className={className}>
      <Label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
        <Globe className="h-4 w-4" />
        Domains
      </Label>
      {isLoading ? (
        <div className="text-sm text-slate-500">Loading domains...</div>
      ) : domains && domains.length > 0 ? (
        <div className="space-y-2">
          {domains.map((domain) => (
            <div
              key={domain.id}
              onClick={() => onSelect(domain.id)}
              className={cn(
                "p-2 rounded-lg cursor-pointer transition-colors",
                "hover:bg-slate-100",
                selectedDomainIds.includes(domain.id) && "bg-slate-100"
              )}
            >
              <div className="font-medium text-slate-800">{domain.name}</div>
              <div className="text-xs text-slate-500">{domain.url}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-slate-500">No domains found</div>
      )}
    </div>
  );
}
