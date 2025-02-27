
import { cn } from "@/lib/utils";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { MenuItem, menuItems } from "./SidebarMenuData";

interface SidebarNavigationProps {
  collapsed: boolean;
}

export function SidebarNavigation({ collapsed }: SidebarNavigationProps) {
  return (
    <nav className={cn(
      "flex-1 overflow-y-auto scrollbar-none",
      collapsed ? "w-full px-1 py-4" : "px-3 py-4"
    )}>
      {menuItems.map(item => (
        <SidebarMenuItem
          key={item.label}
          icon={item.icon}
          label={item.label}
          href={item.href}
          hasChildren={item.hasChildren}
          collapsed={collapsed}
        />
      ))}
    </nav>
  );
}
