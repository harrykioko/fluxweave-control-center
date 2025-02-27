
import { Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface SidebarFooterProps {
  collapsed: boolean;
  userProfile?: { first_name?: string; last_name?: string; avatar_url?: string } | null;
  isAuthenticated: boolean;
}

export function SidebarFooter({ collapsed, userProfile, isAuthenticated }: SidebarFooterProps) {
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

  return (
    <div className={cn(
      "mt-auto",
      collapsed ? "w-full px-1 pb-4" : "px-3 pb-2"
    )}>
      <div className={cn(
        "border-t border-white/10 pt-4",
        collapsed ? "mx-2" : "mx-3"
      )}>
        <Link
          to="/settings"
          className={cn(
            "flex items-center gap-3 text-white/80 hover:bg-white/10 hover:text-white my-1",
            collapsed 
              ? "justify-center w-10 h-10 mx-auto rounded-full" 
              : "px-4 py-3 rounded-xl text-sm font-medium"
          )}
          title={collapsed ? "Settings" : ""}
        >
          <Settings className="h-5 w-5" />
          {!collapsed && <span>Settings</span>}
        </Link>

        {isAuthenticated && collapsed && (
          <>
            <Link
              to="/profile"
              className="flex justify-center w-10 h-10 mx-auto rounded-full text-white/80 hover:bg-white/10 hover:text-white my-1"
              title="Profile"
            >
              <Avatar className="h-5 w-5">
                {userProfile?.avatar_url ? (
                  <AvatarImage src={userProfile.avatar_url} alt={getInitials()} />
                ) : (
                  <AvatarFallback className="text-xs">{getInitials()}</AvatarFallback>
                )}
              </Avatar>
            </Link>

            <button
              onClick={handleSignOut}
              className="flex justify-center w-10 h-10 mx-auto rounded-full text-white/80 hover:bg-white/10 hover:text-white my-1"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
