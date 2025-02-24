
import { cn } from "@/lib/utils";
import { Clock, Globe } from "lucide-react";

interface Domain {
  id: string;
  name: string;
  url: string;
  pageViews: number;
  avgTime: string;
}

interface DomainCardProps {
  domain: Domain;
  onClick?: () => void;
  className?: string;
}

export function DomainCard({ domain, onClick, className }: DomainCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white/40 backdrop-blur-xl border border-white/20 rounded-xl p-4",
        "transition-all duration-200 hover:shadow-lg hover:bg-white/50 cursor-pointer",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-slate-800">{domain.name}</h3>
          <a
            href={domain.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1 mt-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Globe className="h-3 w-3" />
            {domain.url.replace('https://', '')}
          </a>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-slate-700">{domain.pageViews.toLocaleString()} views</div>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
            <Clock className="h-3 w-3" />
            Avg. {domain.avgTime}
          </div>
        </div>
      </div>
    </div>
  );
}
