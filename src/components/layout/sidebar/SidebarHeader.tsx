
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

export function SidebarHeader({ collapsed, toggleCollapsed }: SidebarHeaderProps) {
  return (
    <div className={cn(
      "flex items-center justify-between",
      collapsed ? "px-2 py-4" : "p-4"
    )}>
      <span className={cn(
        "text-xl font-bold text-white/90",
        collapsed ? "hidden" : "block"
      )}>
        {collapsed ? "IC" : "Folio"}
      </span>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleCollapsed}
        className="text-white/90 hover:text-white hover:bg-white/10"
      >
        <Menu className="h-5 w-5" />
      </Button>
    </div>
  );
}
