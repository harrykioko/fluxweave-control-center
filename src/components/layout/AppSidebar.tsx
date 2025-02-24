
import { Home, BrainCircuit, CheckSquare, BarChart3, BookOpen, Settings, Menu, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

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
}, {
  icon: Settings,
  label: "Settings",
  href: "/settings"
}];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  return <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md border-b border-slate-200/20 bg-white/[0.01] my-[10px] px-[20px] mx-[20px]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center space-x-6">
            <span className="text-xl font-bold text-slate-800">FluxWeave</span>
            <nav className="hidden md:flex items-center space-x-2">
              {menuItems.map(item => <a key={item.label} href={item.href} className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 active:bg-slate-200/50 transition-colors relative group">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  <div className="absolute inset-0 border-b-2 border-transparent group-hover:border-slate-400 group-active:border-slate-600 transition-colors" />
                </a>)}
            </nav>
          </div>
          
          <div className="flex items-center space-x-2">
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="hidden md:flex"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            )}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setCollapsed(!collapsed)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {collapsed && <nav className="md:hidden border-t border-slate-200/20 py-2 px-4">
            {menuItems.map(item => <a key={item.label} href={item.href} className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 active:bg-slate-200/50 transition-colors">
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </a>)}
            {isAuthenticated && (
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 active:bg-slate-200/50 transition-colors w-full"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            )}
          </nav>}
      </div>
    </header>;
}
