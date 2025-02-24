
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function QuickActionCard({ title, description, icon, onClick, className }: QuickActionCardProps) {
  return (
    <div className={cn("glass-card rounded-xl p-6 hover-scale group cursor-pointer", className)} onClick={onClick}>
      <div className="flex items-start space-x-4">
        <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
