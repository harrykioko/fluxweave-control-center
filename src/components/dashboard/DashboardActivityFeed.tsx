
import { ScrollArea } from "@/components/ui/scroll-area";
import { ActivityFeed } from "@/components/profile/ActivityFeed";

export function DashboardActivityFeed() {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 sm:p-6 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Activity Feed</h2>
      <ScrollArea className="h-[calc(100vh-460px)] md:h-[600px] lg:h-[400px]">
        <ActivityFeed />
      </ScrollArea>
    </div>
  );
}
