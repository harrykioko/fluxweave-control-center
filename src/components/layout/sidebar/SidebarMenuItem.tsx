
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface SidebarMenuItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  hasChildren: boolean;
  collapsed: boolean;
}

export function SidebarMenuItem({ 
  icon: Icon, 
  label, 
  href, 
  hasChildren, 
  collapsed 
}: SidebarMenuItemProps) {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 transition-all relative group my-1",
        isActive 
          ? "bg-white/15 text-white" 
          : "text-white/80 hover:bg-white/10 hover:text-white",
        collapsed 
          ? "justify-center w-10 h-10 mx-auto rounded-full" 
          : "justify-between px-4 py-3 rounded-xl text-sm font-medium"
      )}
      title={collapsed ? label : ""}
    >
      <div className="flex items-center gap-3">
        <Icon className={cn(
          "h-5 w-5 transition-transform",
          isActive ? "text-white" : "text-white/80"
        )} />
        {!collapsed && <span>{label}</span>}
      </div>
      
      {!collapsed && hasChildren && (
        <ChevronRight className="h-4 w-4 text-white/60" />
      )}
    </Link>
  );
}
