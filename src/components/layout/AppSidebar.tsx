
import { Menu, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { NavMenu } from "./NavMenu";
import { UserMenu } from "./UserMenu";
import { useToast } from "@/components/ui/use-toast";
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
    <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md border-b border-slate-200/20 bg-white/[0.01] my-[10px] px-[20px] mx-[20px]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center space-x-6">
            <span className="text-xl font-bold text-slate-800">Folio</span>
            <NavMenu collapsed={collapsed} />
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <>
                <UserMenu userProfile={userProfile} isAuthenticated={isAuthenticated} />
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setCollapsed(!collapsed)}>
                  <Menu className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>
        
        {collapsed && (
          <nav className="md:hidden border-t border-slate-200/20 py-2 px-4">
            {menuItems.map(item => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 active:bg-slate-200/50 transition-colors"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </a>
            ))}
            {isAuthenticated && (
              <>
                <button
                  onClick={() => {
                    const button = document.querySelector('[aria-label="Sign Out"]') as HTMLButtonElement;
                    if (button) button.click();
                  }}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 active:bg-slate-200/50 transition-colors w-full"
                >
                  <Menu className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
