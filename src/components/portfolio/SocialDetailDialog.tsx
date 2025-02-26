
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface SocialAccount {
  id: string;
  platform: string;
  handle: string;
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

          <section className="bg-white/50 backdrop-blur-md rounded-xl p-4">
            <h3 className="font-medium text-slate-800 mb-3">Associated Projects</h3>
            <div className="space-y-2">
              <p className="text-sm text-slate-600">Projects using this social account will be listed here...</p>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
