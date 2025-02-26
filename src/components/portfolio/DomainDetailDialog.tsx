import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Globe, Link as LinkIcon } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Domain = Database["public"]["Tables"]["domains"]["Row"];

interface DomainDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  domain: Domain | null;
}

export function DomainDetailDialog({ open, onOpenChange, domain }: DomainDetailDialogProps) {
  if (!domain) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white/60 backdrop-blur-xl">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">{domain.name}</h2>
            <a
              href={domain.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mt-1"
            >
              <LinkIcon className="h-4 w-4" />
              {domain.url.replace('https://', '')}
            </a>
          </div>

          <div className="bg-white/50 backdrop-blur-md rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Status</span>
            </div>
            <p className="text-lg font-medium text-slate-800">{domain.status || 'active'}</p>
          </div>

          <section className="bg-white/50 backdrop-blur-md rounded-xl p-4">
            <h3 className="font-medium text-slate-800 mb-3">Associated Projects</h3>
            <div className="space-y-2">
              <p className="text-sm text-slate-600">Projects using this domain will be listed here...</p>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
