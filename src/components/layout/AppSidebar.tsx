
import { Menu, Home, BrainCircuit, CheckSquare, BarChart3, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { UserMenu } from "./UserMenu";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";

const menuItems = [{
  icon: Home,
  label: "Dashboard",
  href: "/"
}, {
  icon: BrainCircuit,
  label: "Ideation",
  href: "/ideation"
}, {
  icon: CheckSquare,
  label: "Tasks",
  href: "/tasks"
}, {
  icon: BarChart3,
  label: "Portfolio",
  href: "/portfolio"
}, {
  icon: BookOpen,
  label: "Resources",
  href: "/resources"
}];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(true); // Default to collapsed now
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<{ first_name?: string; last_name?: string; avatar_url?: string } | null>(null);
  const location = useLocation();

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
        "fixed left-2 z-40 transition-all duration-300",
        "bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10",
        "shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]",
        collapsed 
          ? "w-16 rounded-full p-0 top-1/2 -translate-y-1/2" 
          : "w-64 left-4 rounded-2xl h-[calc(100vh-2rem)] top-4"
      )}
    >
      <div className={cn(
        "flex flex-col",
        collapsed ? "items-center py-2" : "h-full"
      )}>
        {/* Header */}
        <div className={cn(
          "flex items-center justify-between",
          collapsed ? "p-2" : "p-4"
        )}>
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
        <nav className={cn(
          "py-2 px-1 space-y-2 overflow-y-auto scrollbar-none",
          collapsed ? "" : "flex-1 py-4 px-3"
        )}>
          {menuItems.map(item => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all relative group",
                  isActive 
                    ? "bg-white/20 text-white shadow-sm" 
                    : "text-white/70 hover:bg-white/10 hover:text-white",
                  collapsed 
                    ? "justify-center w-10 h-10 mx-auto rounded-full" 
                    : "backdrop-blur-sm px-4 py-3"
                )}
                title={collapsed ? item.label : ""}
              >
                <Icon className={cn(
                  "h-5 w-5 transition-transform",
                  collapsed ? "h-5 w-5" : "",
                  isActive ? "text-white" : "text-white/70"
                )} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Profile - Only show in expanded mode */}
        {isAuthenticated && !collapsed && (
          <div className="p-4 mx-3 mb-3 border-t border-white/10">
            <UserMenu userProfile={userProfile} isAuthenticated={isAuthenticated} />
          </div>
        )}
      </div>
    </aside>
  );
}
