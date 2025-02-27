
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Globe, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { encryptValue } from "@/utils/encryption";

interface NewDomainDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDomainAdded?: () => void;
}

export function NewDomainDialog({ open, onOpenChange, onDomainAdded }: NewDomainDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [hostedOn, setHostedOn] = useState("");
  const [owner, setOwner] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !url.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to add a domain",
        variant: "destructive",
      });
      return;
    }

    // Ensure URL has https:// prefix
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;

    setIsLoading(true);
    const { error } = await supabase
      .from('domains')
      .insert({
        name: name.trim(),
        url: formattedUrl,
        status: 'active',
        user_id: user.id,
        hosted_on: hostedOn.trim() || null,
        owner: owner.trim() || null,
        login_username: loginUsername.trim() ? encryptValue(loginUsername.trim()) : null,
        login_password: loginPassword.trim() ? encryptValue(loginPassword.trim()) : null
      });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add domain. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Domain added successfully",
    });

    // Reset form and close dialog
    setName("");
    setUrl("");
    setHostedOn("");
    setOwner("");
    setLoginUsername("");
    setLoginPassword("");
    onOpenChange(false);
    onDomainAdded?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white/60 backdrop-blur-xl">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/50 backdrop-blur-md rounded-lg">
              <Globe className="h-5 w-5 text-slate-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">Add New Domain</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Domain Name*</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Business Domain"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL*</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hostedOn">Hosted On</Label>
              <Input
                id="hostedOn"
                value={hostedOn}
                onChange={(e) => setHostedOn(e.target.value)}
                placeholder="e.g., DigitalOcean, AWS"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="owner">Owner</Label>
              <Input
                id="owner"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="Domain owner name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loginUsername">Login Username</Label>
              <Input
                id="loginUsername"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="Admin username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loginPassword">Login Password</Label>
              <Input
                id="loginPassword"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Admin password"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-700"
              disabled={isLoading}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Domain
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
