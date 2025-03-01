
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ActivityFeed } from "@/components/profile/ActivityFeed";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WelcomeMessage } from "@/components/dashboard/WelcomeMessage";
import { RecentProjects } from "@/components/dashboard/RecentProjects";
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks";
import { CreateNewButton } from "@/components/dashboard/CreateNewButton";
import { MessageBoard } from "@/components/dashboard/MessageBoard";
import { DashboardCalendar } from "@/components/dashboard/DashboardCalendar";

export default function Index() {
  // Use custom hook to check screen size
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <main className="pt-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - 8 columns wide */}
            <div className="lg:col-span-8 space-y-6">
              {/* Welcome Message */}
              <WelcomeMessage />
              
              {/* Recent Projects */}
              <RecentProjects />
              
              {/* Upcoming Tasks */}
              <UpcomingTasks />
              
              {/* Expandable Create New Buttons */}
              <CreateNewButton />
              
              {/* Message Board */}
              <MessageBoard />
            </div>
            
            {/* Right Column - 4 columns wide */}
            <div className="lg:col-span-4 space-y-6">
              {/* Activity Feed */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 sm:p-6 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4">Activity Feed</h2>
                <ScrollArea className="h-[calc(100vh-460px)] md:h-[600px] lg:h-[400px]">
                  <ActivityFeed />
                </ScrollArea>
              </div>
              
              {/* Calendar */}
              <DashboardCalendar />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
