
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface SidebarFooterProps {
  collapsed: boolean;
}

export function SidebarFooter({ collapsed }: SidebarFooterProps) {
  return (
    <div className={cn(
      "mt-auto",
      collapsed ? "w-full px-1 pb-4" : "px-3 pb-2"
    )}>
      <div className={cn(
        "border-t border-white/10 pt-4",
        collapsed ? "mx-2" : "mx-3"
      )}>
        <Link
          to="/settings"
          className={cn(
            "flex items-center gap-3 text-white/80 hover:bg-white/10 hover:text-white my-1",
            collapsed 
              ? "justify-center w-10 h-10 mx-auto rounded-full" 
              : "px-4 py-3 rounded-xl text-sm font-medium"
          )}
          title={collapsed ? "Settings" : ""}
        >
          <Settings className="h-5 w-5" />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>
    </div>
  );
}
