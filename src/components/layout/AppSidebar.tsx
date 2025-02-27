
import { Menu, Home, BrainCircuit, CheckSquare, BarChart3, BookOpen, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { UserMenu } from "./UserMenu";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";

const menuItems = [{
  icon: Home,
  label: "Dashboard",
  href: "/",
  hasChildren: false
}, {
  icon: BrainCircuit,
  label: "Ideation",
  href: "/ideation",
  hasChildren: true
}, {
  icon: CheckSquare,
  label: "Tasks",
  href: "/tasks",
  hasChildren: false
}, {
  icon: BarChart3,
  label: "Portfolio",
  href: "/portfolio",
  hasChildren: true
}, {
  icon: BookOpen,
  label: "Resources",
  href: "/resources",
  hasChildren: false
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
        "fixed z-40 transition-all duration-300",
        collapsed 
          ? "w-16 rounded-full p-0 top-1/2 -translate-y-1/2 left-2" 
          : "w-64 left-4 rounded-2xl h-[calc(100vh-2rem)] top-4",
        "bg-gradient-to-b from-rose-500/90 via-purple-600/90 to-indigo-600/90 backdrop-blur-lg border border-white/20",
        "shadow-[0_8px_32px_0_rgba(0,0,0,0.25)]"
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
            "text-xl font-bold text-pink-100",
            collapsed ? "hidden" : "block"
          )}>
            {collapsed ? "IC" : "Folio"}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCollapsed(!collapsed)}
            className="text-pink-100 hover:text-white hover:bg-white/10"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className={cn(
          "py-2 px-1 space-y-1 overflow-y-auto scrollbar-none",
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
                  "flex items-center gap-3 transition-all relative group",
                  isActive 
                    ? "bg-white/20 text-white" 
                    : "text-pink-100 hover:bg-white/10 hover:text-white",
                  collapsed 
                    ? "justify-center w-10 h-10 mx-auto rounded-full" 
                    : "justify-between px-4 py-3 rounded-xl text-sm font-medium"
                )}
                title={collapsed ? item.label : ""}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn(
                    "h-5 w-5 transition-transform",
                    isActive ? "text-white" : "text-pink-100"
                  )} />
                  {!collapsed && <span>{item.label}</span>}
                </div>
                
                {/* Add plus icon for items with children */}
                {!collapsed && item.hasChildren && (
                  <ChevronRight className="h-4 w-4 text-pink-100" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className={cn(
          "mt-auto pt-4",
          collapsed ? "hidden" : "block"
        )}>
          <div className="border-t border-white/10 mx-3 pt-4 pb-2">
            <Link
              to="/settings"
              className="flex items-center gap-3 text-pink-100 hover:bg-white/10 hover:text-white px-4 py-3 rounded-xl text-sm font-medium"
            >
              <Menu className="h-5 w-5" />
              <span>Settings</span>
            </Link>
            <Link
              to="/auth"
              className="flex items-center gap-3 text-pink-100 hover:bg-white/10 hover:text-white px-4 py-3 rounded-xl text-sm font-medium"
            >
              <Menu className="h-5 w-5" />
              <span>Logout</span>
            </Link>
          </div>
        </div>

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
