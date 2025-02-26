
import { Home, BrainCircuit, CheckSquare, BarChart3, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

export const menuItems = [{
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

export function NavMenu({ collapsed }: { collapsed: boolean }) {
  const location = useLocation();

  return (
    <nav className="space-y-2 px-3">
      {menuItems.map(item => {
        const isActive = location.pathname === item.href;
        return (
          <a
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all relative group",
              isActive 
                ? "bg-white/20 text-white shadow-sm" 
                : "text-white/70 hover:bg-white/10 hover:text-white",
              collapsed ? "justify-center" : "backdrop-blur-sm"
            )}
          >
            <item.icon className={cn(
              "h-5 w-5 transition-transform",
              collapsed ? "h-6 w-6" : "",
              isActive ? "text-white" : "text-white/70"
            )} />
            {!collapsed && <span>{item.label}</span>}
          </a>
        );
      })}
    </nav>
  );
}
