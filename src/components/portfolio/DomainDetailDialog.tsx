
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Globe, Link as LinkIcon, Edit2 } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Domain = Database["public"]["Tables"]["domains"]["Row"];

interface DomainDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  domain: Domain | null;
}

export function DomainDetailDialog({ open, onOpenChange, domain }: DomainDetailDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editedDomain, setEditedDomain] = useState<Domain | null>(domain);
  const { toast } = useToast();

  if (!domain) return null;

  const handleSave = async () => {
    if (!editedDomain) return;

    setIsLoading(true);
    const { error } = await supabase
      .from('domains')
      .update({
        name: editedDomain.name,
        url: editedDomain.url,
        hosted_on: editedDomain.hosted_on,
        owner: editedDomain.owner,
        login_username: editedDomain.login_username,
        login_password: editedDomain.login_password
      })
      .eq('id', domain.id);

    setIsLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update domain. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Domain updated successfully",
    });
    setIsEditing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white/60 backdrop-blur-xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-slate-600" />
              {isEditing ? (
                <Input
                  value={editedDomain?.name}
                  onChange={(e) => setEditedDomain(prev => prev ? {...prev, name: e.target.value} : prev)}
                  className="font-semibold text-slate-800"
                />
              ) : (
                <h2 className="text-xl font-semibold text-slate-800">{domain.name}</h2>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setEditedDomain(domain);
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
              <Label>URL</Label>
              {isEditing ? (
                <Input
                  value={editedDomain?.url}
                  onChange={(e) => setEditedDomain(prev => prev ? {...prev, url: e.target.value} : prev)}
                />
              ) : (
                <a
                  href={domain.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
                >
                  <LinkIcon className="h-4 w-4" />
                  {domain.url.replace('https://', '')}
                </a>
              )}
            </div>

            <div>
              <Label>Hosted On</Label>
              {isEditing ? (
                <Input
                  value={editedDomain?.hosted_on || ''}
                  onChange={(e) => setEditedDomain(prev => prev ? {...prev, hosted_on: e.target.value} : prev)}
                  placeholder="e.g., DigitalOcean, AWS"
                />
              ) : (
                <p className="text-sm text-slate-600">{domain.hosted_on || 'Not specified'}</p>
              )}
            </div>

            <div>
              <Label>Owner</Label>
              {isEditing ? (
                <Input
                  value={editedDomain?.owner || ''}
                  onChange={(e) => setEditedDomain(prev => prev ? {...prev, owner: e.target.value} : prev)}
                  placeholder="Domain owner name"
                />
              ) : (
                <p className="text-sm text-slate-600">{domain.owner || 'Not specified'}</p>
              )}
            </div>

            <div>
              <Label>Login Username</Label>
              {isEditing ? (
                <Input
                  value={editedDomain?.login_username || ''}
                  onChange={(e) => setEditedDomain(prev => prev ? {...prev, login_username: e.target.value} : prev)}
                  placeholder="Admin username"
                />
              ) : (
                <p className="text-sm text-slate-600">{domain.login_username || 'Not specified'}</p>
              )}
            </div>

            <div>
              <Label>Login Password</Label>
              {isEditing ? (
                <Input
                  type="password"
                  value={editedDomain?.login_password || ''}
                  onChange={(e) => setEditedDomain(prev => prev ? {...prev, login_password: e.target.value} : prev)}
                  placeholder="Admin password"
                />
              ) : (
                <p className="text-sm text-slate-600">
                  {domain.login_password ? '••••••••' : 'Not specified'}
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
