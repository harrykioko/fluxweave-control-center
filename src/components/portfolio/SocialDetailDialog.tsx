
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Edit2, Users } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { encryptValue, decryptValue } from "@/utils/encryption";

type SocialAccount = Database["public"]["Tables"]["social_accounts"]["Row"];

interface SocialDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: SocialAccount | null;
}

export function SocialDetailDialog({ open, onOpenChange, account }: SocialDetailDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editedAccount, setEditedAccount] = useState<SocialAccount | null>(account);
  const { toast } = useToast();

  if (!account) return null;

  // Decrypt the credentials when displaying them
  const decryptedUsername = account.login_username ? decryptValue(account.login_username) : '';
  const decryptedPassword = account.login_password ? decryptValue(account.login_password) : '';

  const handleSave = async () => {
    if (!editedAccount) return;

    setIsLoading(true);
    const { error } = await supabase
      .from('social_accounts')
      .update({
        platform: editedAccount.platform,
        account_name: editedAccount.account_name,
        handle: editedAccount.handle,
        login_username: editedAccount.login_username !== account.login_username ? 
          encryptValue(editedAccount.login_username || '') : account.login_username,
        login_password: editedAccount.login_password !== account.login_password ? 
          encryptValue(editedAccount.login_password || '') : account.login_password
      })
      .eq('id', account.id);

    setIsLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update social account. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Social account updated successfully",
    });
    setIsEditing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white/60 backdrop-blur-xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-slate-600" />
              {isEditing ? (
                <Input
                  value={editedAccount?.platform}
                  onChange={(e) => setEditedAccount(prev => prev ? {...prev, platform: e.target.value} : prev)}
                  className="font-semibold text-slate-800"
                />
              ) : (
                <h2 className="text-xl font-semibold text-slate-800">{account.platform}</h2>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setEditedAccount(account);
                  setIsEditing(true);
                }
              }}
              disabled={isLoading}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              {isEditing ? "Save" : "Edit"}
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Account Name</Label>
              {isEditing ? (
                <Input
                  value={editedAccount?.account_name}
                  onChange={(e) => setEditedAccount(prev => prev ? {...prev, account_name: e.target.value} : prev)}
                />
              ) : (
                <p className="text-sm text-slate-600">{account.account_name}</p>
              )}
            </div>

            <div>
              <Label>Handle</Label>
              {isEditing ? (
                <Input
                  value={editedAccount?.handle}
                  onChange={(e) => setEditedAccount(prev => prev ? {...prev, handle: e.target.value} : prev)}
                />
              ) : (
                <p className="text-sm text-slate-600">{account.handle}</p>
              )}
            </div>

            <div>
              <Label>Login Username</Label>
              {isEditing ? (
                <Input
                  value={editedAccount?.login_username === account.login_username ? decryptedUsername : editedAccount?.login_username || ''}
                  onChange={(e) => setEditedAccount(prev => prev ? {...prev, login_username: e.target.value} : prev)}
                  placeholder="Account login username"
                />
              ) : (
                <p className="text-sm text-slate-600">{decryptedUsername || 'Not specified'}</p>
              )}
            </div>

            <div>
              <Label>Login Password</Label>
              {isEditing ? (
                <Input
                  type="password"
                  value={editedAccount?.login_password === account.login_password ? decryptedPassword : editedAccount?.login_password || ''}
                  onChange={(e) => setEditedAccount(prev => prev ? {...prev, login_password: e.target.value} : prev)}
                  placeholder="Account login password"
                />
              ) : (
                <p className="text-sm text-slate-600">
                  {account.login_password ? '••••••••' : 'Not specified'}
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
