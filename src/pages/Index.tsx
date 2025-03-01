
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { WelcomeMessage } from "@/components/dashboard/WelcomeMessage";
import { RecentProjects } from "@/components/dashboard/RecentProjects";
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks";
import { CreateNewButton } from "@/components/dashboard/CreateNewButton";
import { MessageBoard } from "@/components/dashboard/MessageBoard";
import { DashboardCalendar } from "@/components/dashboard/DashboardCalendar";
import { DashboardActivityFeed } from "@/components/dashboard/DashboardActivityFeed";

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
              <DashboardActivityFeed />
              
              {/* Calendar */}
              <DashboardCalendar />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
