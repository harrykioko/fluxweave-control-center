
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Instagram, MessageCircle, Twitter } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface NewSocialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSocialAdded?: () => void;
}

type SocialPlatform = "instagram" | "tiktok" | "twitter";

interface PlatformOption {
  id: SocialPlatform;
  name: string;
  icon: React.ReactNode;
}

const platforms: PlatformOption[] = [
  { id: "instagram", name: "Instagram", icon: <Instagram className="h-5 w-5" /> },
  { id: "tiktok", name: "TikTok", icon: <MessageCircle className="h-5 w-5" /> },
  { id: "twitter", name: "X (Twitter)", icon: <Twitter className="h-5 w-5" /> },
];

export function NewSocialDialog({ open, onOpenChange, onSocialAdded }: NewSocialDialogProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null);
  const [accountName, setAccountName] = useState("");
  const [handle, setHandle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlatform) return;

    setIsSubmitting(true);
    try {
      // First get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("You must be logged in to add a social media account");
      }

      const { error } = await supabase
        .from('social_accounts')
        .insert({
          platform: selectedPlatform,
          account_name: accountName,
          handle: handle.startsWith('@') ? handle : `@${handle}`,
          user_id: user.id, // Add the user_id to the insert
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Social media account added successfully",
      });

      // Reset form
      setSelectedPlatform(null);
      setAccountName("");
      setHandle("");
      onSocialAdded?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding social account:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add social media account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white/60 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>Add Social Media Account</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Select Platform</Label>
            <div className="grid grid-cols-3 gap-4">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-lg border transition-all duration-200",
                    "hover:bg-slate-50",
                    selectedPlatform === platform.id
                      ? "border-slate-800 bg-slate-50"
                      : "border-slate-200"
                  )}
                >
                  {platform.icon}
                  <span className="text-sm font-medium">{platform.name}</span>
                </button>
              ))}
            </div>
          </div>

          {selectedPlatform && (
            <>
              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name</Label>
                <Input
                  id="accountName"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Enter account name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="handle">Handle</Label>
                <Input
                  id="handle"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder={`@username`}
                  required
                />
              </div>
            </>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!selectedPlatform || !accountName || !handle || isSubmitting}
              className="bg-slate-800 hover:bg-slate-700"
            >
              {isSubmitting ? "Adding..." : "Add Account"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
