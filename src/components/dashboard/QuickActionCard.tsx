
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
    <div 
      className={cn(
        "bg-white/40 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg transition-all duration-200 hover:shadow-xl hover:translate-y-[-2px] hover:bg-white/50 group cursor-pointer",
        className
      )} 
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-white/50 backdrop-blur-md rounded-xl group-hover:bg-white/60 transition-colors">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-500 mt-1">{description}</p>
        </div>
        <Button 
          size="icon" 
          variant="ghost" 
          className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/50"
        >
          <Plus className="h-4 w-4 text-slate-600" />
        </Button>
      </div>
    </div>
  );
}
