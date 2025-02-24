
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

interface SocialAccount {
  id: string;
  platform: string;
  handle: string;
  followers: number;
  engagement: string;
}

interface SocialMediaCardProps {
  account: SocialAccount;
  onClick?: () => void;
  className?: string;
}

export function SocialMediaCard({ account, onClick, className }: SocialMediaCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white/40 backdrop-blur-xl border border-white/20 rounded-xl p-4",
        "transition-all duration-200 hover:shadow-lg hover:bg-white/50 cursor-pointer",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-slate-800">{account.platform}</h3>
          <span className="text-xs text-slate-500">{account.handle}</span>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-sm font-medium text-slate-700">
            <Users className="h-3 w-3" />
            {account.followers.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {account.engagement} engagement
          </div>
        </div>
      </div>
    </div>
  );
}
