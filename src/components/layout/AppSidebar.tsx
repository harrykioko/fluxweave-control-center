
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { NavMenu } from "./NavMenu";
import { UserMenu } from "./UserMenu";
import { menuItems } from "./NavMenu";

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
    <aside className={`fixed top-0 left-0 z-40 h-screen bg-white/80 backdrop-blur-xl border-r border-slate-200/20 transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200/20">
          <span className={`text-xl font-bold text-slate-800 ${collapsed ? "hidden" : "block"}`}>Folio</span>
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-4">
          <NavMenu collapsed={collapsed} />
        </div>

        {/* User Profile */}
        {isAuthenticated && (
          <div className="p-4 border-t border-slate-200/20">
            <UserMenu userProfile={userProfile} isAuthenticated={isAuthenticated} />
          </div>
        )}
      </div>
    </aside>
  );
}
