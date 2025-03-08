import * as React from 'react';
import { FC } from 'react';
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

export const QuickActionCard: FC<QuickActionCardProps> = ({ 
  title, 
  description, 
  icon, 
  onClick, 
  className 
}) => {
  return (
    <div 
      className={cn(
        "glass-card p-6 hover-scale hover:translate-y-[-2px] group cursor-pointer",
        className
      )} 
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <div className="p-3 glass-sm rounded-xl group-hover:bg-elevated-hover transition-colors">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-primary">{title}</h3>
          <p className="text-sm text-secondary mt-1">{description}</p>
        </div>
        <Button 
          size="icon" 
          variant="ghost" 
          className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-elevated"
        >
          <Plus className="h-4 w-4 text-tertiary" />
        </Button>
      </div>
    </div>
  );
};
