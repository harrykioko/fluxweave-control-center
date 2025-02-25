
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface UserMenuProps {
  userProfile: { first_name?: string; last_name?: string; avatar_url?: string } | null;
  isAuthenticated: boolean;
}

export function UserMenu({ userProfile, isAuthenticated }: UserMenuProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const getInitials = () => {
    if (!userProfile) return "";
    return `${userProfile.first_name?.[0] || ""}${userProfile.last_name?.[0] || ""}`.toUpperCase();
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex items-center space-x-4">
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-transparent p-0"
        onClick={() => navigate('/profile')}
      >
        <Avatar className="h-8 w-8">
          {userProfile?.avatar_url ? (
            <AvatarImage src={userProfile.avatar_url} alt={getInitials()} />
          ) : (
            <AvatarFallback>{getInitials()}</AvatarFallback>
          )}
        </Avatar>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleSignOut}
        className="hidden md:flex"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
}

