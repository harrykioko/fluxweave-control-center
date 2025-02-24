
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Clock, Globe, Link as LinkIcon } from "lucide-react";

interface Domain {
  id: string;
  name: string;
  url: string;
  pageViews: number;
  avgTime: string;
}

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

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/50 backdrop-blur-md rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">Page Views</span>
              </div>
              <p className="text-2xl font-semibold text-slate-800">{domain.pageViews.toLocaleString()}</p>
            </div>

            <div className="bg-white/50 backdrop-blur-md rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">Avg. Time</span>
              </div>
              <p className="text-2xl font-semibold text-slate-800">{domain.avgTime}</p>
            </div>
          </div>

          <section className="bg-white/50 backdrop-blur-md rounded-xl p-4">
            <h3 className="font-medium text-slate-800 mb-3">Analytics</h3>
            <div className="space-y-2">
              {/* Analytics data will go here */}
              <p className="text-sm text-slate-600">Detailed analytics will be displayed here...</p>
            </div>
          </section>

          <section className="bg-white/50 backdrop-blur-md rounded-xl p-4">
            <h3 className="font-medium text-slate-800 mb-3">Associated Projects</h3>
            <div className="space-y-2">
              {/* Associated projects will go here */}
              <p className="text-sm text-slate-600">Projects using this domain will be listed here...</p>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
