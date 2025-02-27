
import { cn } from "@/lib/utils";
import { AtSign } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type SocialAccount = Database["public"]["Tables"]["social_accounts"]["Row"];

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
        "bg-white border border-slate-200 rounded-xl p-4",
        "transition-all duration-200 hover:shadow-lg hover:border-purple-300",
        "cursor-pointer shadow-sm",
        className
      )}
    >
      <div className="space-y-1">
        <h3 className="font-medium text-slate-800 text-base flex items-center gap-2">
          {account.platform}
          <span className="text-sm font-normal text-slate-500">({account.account_name})</span>
        </h3>
        <div className="flex items-center gap-1.5 text-slate-600">
          <AtSign className="h-4 w-4" />
          <span className="text-sm">{account.handle}</span>
        </div>
      </div>
    </div>
  );
}
