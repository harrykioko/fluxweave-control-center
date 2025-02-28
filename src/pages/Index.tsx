
import { IncomeTracker } from "@/components/dashboard/IncomeTracker";
import { RecentProjects } from "@/components/dashboard/RecentProjects";
import { ConnectSection } from "@/components/dashboard/ConnectSection";
import { PremiumFeatures } from "@/components/dashboard/PremiumFeatures";
import { ProposalProgress } from "@/components/dashboard/ProposalProgress";

export default function Index() {
  return (
    <div className="min-h-screen">
      <main className="pt-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Income Tracker - Takes 7 columns */}
            <div className="lg:col-span-7">
              <IncomeTracker />
            </div>
            
            {/* Recent Projects - Takes 5 columns */}
            <div className="lg:col-span-5">
              <RecentProjects />
            </div>
            
            {/* Connect Section - Takes 4 columns */}
            <div className="lg:col-span-4">
              <ConnectSection />
            </div>
            
            {/* Premium Features - Takes 3 columns */}
            <div className="lg:col-span-3">
              <PremiumFeatures />
            </div>
            
            {/* Proposal Progress - Takes 5 columns */}
            <div className="lg:col-span-5">
              <ProposalProgress />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
