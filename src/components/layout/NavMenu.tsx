
import { Home, BrainCircuit, CheckSquare, BarChart3, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

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

export function NavMenu({ collapsed }: { collapsed: boolean }) {
  return (
    <nav className={cn(
      collapsed ? "md:hidden" : "hidden md:flex",
      "items-center space-x-2"
    )}>
      {menuItems.map(item => (
        <a
          key={item.label}
          href={item.href}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 active:bg-slate-200/50 transition-colors relative group"
        >
          <item.icon className="h-4 w-4" />
          <span>{item.label}</span>
          <div className="absolute inset-0 border-b-2 border-transparent group-hover:border-slate-400 group-active:border-slate-600 transition-colors" />
        </a>
      ))}
    </nav>
  );
}

