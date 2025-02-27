
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Domain = Database["public"]["Tables"]["domains"]["Row"];

interface DomainCardProps {
  domain: Domain;
  onClick?: () => void;
  className?: string;
}

export function DomainCard({ domain, onClick, className }: DomainCardProps) {
  if (!domain || !domain.name) {
    console.error('Invalid domain data:', domain);
    return null;
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white/40 backdrop-blur-xl border border-white/20 rounded-xl p-4",
        "transition-all duration-200 hover:shadow-lg hover:bg-white/50 cursor-pointer",
        className
      )}
    >
      <div>
        <h3 className="font-medium text-slate-800">{domain.name}</h3>
        {domain.url && (
          <a
            href={domain.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1 mt-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Globe className="h-3 w-3" />
            {domain.url.replace(/^https?:\/\//, '')}
          </a>
        )}
      </div>
    </div>
  );
}
