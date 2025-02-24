
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BarChart, Users } from "lucide-react";

interface SocialAccount {
  id: string;
  platform: string;
  handle: string;
  followers: number;
  engagement: string;
}

interface SocialDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: SocialAccount | null;
}

export function SocialDetailDialog({ open, onOpenChange, account }: SocialDetailDialogProps) {
  if (!account) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white/60 backdrop-blur-xl">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">{account.platform}</h2>
            <p className="text-slate-500 mt-1">{account.handle}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/50 backdrop-blur-md rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">Followers</span>
              </div>
              <p className="text-2xl font-semibold text-slate-800">{account.followers.toLocaleString()}</p>
            </div>

            <div className="bg-white/50 backdrop-blur-md rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">Engagement</span>
              </div>
              <p className="text-2xl font-semibold text-slate-800">{account.engagement}</p>
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
              <p className="text-sm text-slate-600">Projects using this social account will be listed here...</p>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
