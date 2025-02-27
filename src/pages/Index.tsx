
import { DashboardMetricCard } from "@/components/dashboard/DashboardMetricCard";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { Brain, LineChart, Inbox, Target, Rocket, Users, Film, Globe } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen">
      <main className="pt-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
          {/* Header */}
          <div className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg">
            <h1 className="text-3xl font-bold text-slate-800">Mission Control</h1>
            <p className="text-slate-500 mt-2">Welcome back! Here's what's happening today.</p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardMetricCard
              title="Active Projects"
              value="12"
              change="+2 this week"
              icon={<Target className="h-5 w-5 text-indigo-600" />}
            />
            <DashboardMetricCard
              title="Total Traffic"
              value="24.5K"
              change="+12% MoM"
              icon={<LineChart className="h-5 w-5 text-emerald-600" />}
            />
            <DashboardMetricCard
              title="New Ideas"
              value="7"
              change="+3 today"
              icon={<Brain className="h-5 w-5 text-purple-600" />}
            />
            <DashboardMetricCard
              title="Tasks Due"
              value="5"
              change="Due today"
              icon={<Inbox className="h-5 w-5 text-amber-600" />}
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-white/30 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <QuickActionCard
                title="Launch New Project"
                description="Start a new venture from your idea backlog"
                icon={<Rocket className="h-5 w-5 text-indigo-600" />}
              />
              <QuickActionCard
                title="Team Collaboration"
                description="Invite team members and assign tasks"
                icon={<Users className="h-5 w-5 text-emerald-600" />}
              />
              <QuickActionCard
                title="Content Calendar"
                description="Schedule and plan your content strategy"
                icon={<Film className="h-5 w-5 text-purple-600" />}
              />
              <QuickActionCard
                title="Domain Portfolio"
                description="Manage your domain names and renewals"
                icon={<Globe className="h-5 w-5 text-amber-600" />}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
