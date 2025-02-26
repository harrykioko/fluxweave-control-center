
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
    <nav className="space-y-1 px-2">
      {menuItems.map(item => {
        const isActive = location.pathname === item.href;
        return (
          <a
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative group",
              isActive 
                ? "text-slate-900 bg-slate-100/80" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50",
              collapsed && "justify-center"
            )}
          >
            <item.icon className={cn("h-5 w-5", collapsed && "h-6 w-6")} />
            {!collapsed && <span>{item.label}</span>}
          </a>
        );
      })}
    </nav>
  );
}
