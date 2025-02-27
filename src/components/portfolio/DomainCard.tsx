
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
  // Early return with error state if domain data is invalid
  if (!domain || typeof domain !== 'object' || !('name' in domain) || !domain.name) {
    console.error('Invalid domain data:', domain);
    return (
      <div className={cn(
        "bg-red-50 border border-red-200 rounded-xl p-4",
        "cursor-not-allowed shadow-sm",
        className
      )}>
        <p className="text-sm text-red-600">Invalid domain data</p>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white border border-slate-200 rounded-xl p-4",
        "transition-all duration-200 hover:shadow-lg hover:border-purple-300",
        "cursor-pointer shadow-sm",
        className
      )}
    >
      <div>
        <h3 className="font-medium text-slate-800 text-base">{domain.name}</h3>
        {domain.url && (
          <a
            href={domain.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-600 hover:text-purple-600 transition-colors flex items-center gap-1.5 mt-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Globe className="h-4 w-4" />
            {domain.url.replace(/^https?:\/\//, '')}
          </a>
        )}
      </div>
    </div>
  );
}
