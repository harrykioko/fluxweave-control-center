import * as React from 'react';
import { FC } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { ActivityFeed } from "@/components/profile/ActivityFeed";

export const DashboardActivityFeed: FC = () => {
  return (
    <div className="bg-surface backdrop-blur-xl border-subtle rounded-xl p-4 sm:p-6 shadow-lg">
      <h2 className="text-xl font-bold text-primary mb-4">Activity Feed</h2>
      <ScrollArea className="h-[calc(100vh-460px)] md:h-[600px] lg:h-[400px]">
        <ActivityFeed />
      </ScrollArea>
    </div>
  );
};
