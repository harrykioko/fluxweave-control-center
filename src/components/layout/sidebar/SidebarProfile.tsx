
import { UserMenu } from "../UserMenu";

interface SidebarProfileProps {
  collapsed: boolean;
  isAuthenticated: boolean;
  userProfile: { first_name?: string; last_name?: string; avatar_url?: string } | null;
}

export function SidebarProfile({ collapsed, isAuthenticated, userProfile }: SidebarProfileProps) {
  if (isAuthenticated && !collapsed) {
    return (
      <div className="p-4 mx-3 mb-3 border-t border-white/10">
        <UserMenu userProfile={userProfile} isAuthenticated={isAuthenticated} />
      </div>
    );
  }
  
  return null;
}
