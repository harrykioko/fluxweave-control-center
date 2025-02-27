
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { SidebarFooter } from "./sidebar/SidebarFooter";
import { SidebarProfile } from "./sidebar/SidebarProfile";

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(true);
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

  const toggleCollapsed = () => setCollapsed(!collapsed);

  return (
    <aside 
      className={cn(
        "fixed z-40 transition-all duration-300 h-full top-0",
        collapsed 
          ? "w-16" 
          : "w-64 left-4 top-4 rounded-2xl h-[calc(100vh-2rem)]",
        "bg-black/20 backdrop-blur-xl border border-white/10",
        "shadow-[0_8px_32px_0_rgba(0,0,0,0.15)]",
        collapsed ? "" : "rounded-2xl",
        "before:absolute before:inset-0 before:rounded-inherit before:bg-gradient-to-b before:from-rose-500/20 before:via-purple-600/20 before:to-indigo-600/20 before:-z-10"
      )}
    >
      <div className={cn(
        "flex flex-col h-full",
        collapsed ? "items-center py-4" : ""
      )}>
        {/* Header */}
        <SidebarHeader collapsed={collapsed} toggleCollapsed={toggleCollapsed} />

        {/* Navigation */}
        <SidebarNavigation collapsed={collapsed} />

        {/* Bottom Actions */}
        <SidebarFooter collapsed={collapsed} userProfile={userProfile} isAuthenticated={isAuthenticated} />

        {/* User Profile */}
        <SidebarProfile 
          collapsed={collapsed} 
          isAuthenticated={isAuthenticated} 
          userProfile={userProfile} 
        />
      </div>
    </aside>
  );
}
