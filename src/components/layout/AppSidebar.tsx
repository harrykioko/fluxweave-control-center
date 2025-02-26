
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { NavMenu } from "./NavMenu";
import { UserMenu } from "./UserMenu";
import { menuItems } from "./NavMenu";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<{ first_name?: string; last_name?: string; avatar_url?: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, avatar_url")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  return (
    <aside 
      className={cn(
        "fixed top-4 left-4 z-40 h-[calc(100vh-2rem)] rounded-2xl transition-all duration-300",
        "bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10",
        "shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <span className={cn(
            "text-xl font-bold text-gradient",
            collapsed ? "hidden" : "block"
          )}>
            Folio
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCollapsed(!collapsed)}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-4 overflow-y-auto scrollbar-none">
          <NavMenu collapsed={collapsed} />
        </div>

        {/* User Profile */}
        {isAuthenticated && (
          <div className="p-4 mx-3 mb-3 border-t border-white/10">
            <UserMenu userProfile={userProfile} isAuthenticated={isAuthenticated} />
          </div>
        )}
      </div>
    </aside>
  );
}
