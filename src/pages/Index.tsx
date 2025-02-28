
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { DashboardMetricCard } from "@/components/dashboard/DashboardMetricCard";
import { ActivityFeed } from "@/components/profile/ActivityFeed";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus, MessageSquare, CalendarIcon, Briefcase, CheckSquare, Lightbulb, FileText, Layers } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Index() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState<string>("focus");
  const [expandButtons, setExpandButtons] = useState(false);
  
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
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg">
                <h1 className="text-2xl font-bold text-white">Hello, Henry</h1>
                <p className="text-slate-300 mt-2">
                  You have 3 resources and 5 tasks due this week.
                </p>
              </div>
              
              {/* Top 3 Resources */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white px-1">Top 3 Resources</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((item) => (
                    <div 
                      key={item} 
                      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-5 shadow-lg hover:bg-white/15 transition-all duration-200"
                    >
                      <h3 className="font-medium text-white">Resource {item}</h3>
                      <p className="text-sm text-slate-300 mt-1">Brief description here</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Upcoming Tasks */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white px-1">Upcoming Tasks</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((task) => (
                    <div 
                      key={task} 
                      className="flex items-start p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg"
                    >
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium text-white">Complete project proposal</p>
                        <p className="text-xs text-slate-300">Due in 2 days</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Expandable Create New Buttons - Redesigned Approach */}
              <div className="my-8">
                {expandButtons ? (
                  <div className="animate-fade-in">
                    {/* Grid layout for expanded buttons - more reliable across screen sizes */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            className="w-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white shadow-lg shadow-purple-500/20 border-purple-500/30"
                          >
                            <Lightbulb className="h-4 w-4 mr-2" />
                            Idea
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            className="w-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white shadow-lg shadow-purple-500/20 border-purple-500/30"
                          >
                            <CheckSquare className="h-4 w-4 mr-2" />
                            Task
                          </Button>
                        </DialogTrigger>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            className="w-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white shadow-lg shadow-purple-500/20 border-purple-500/30"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Resource
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            className="w-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white shadow-lg shadow-purple-500/20 border-purple-500/30"
                          >
                            <Layers className="h-4 w-4 mr-2" />
                            Portfolio
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                    </div>

                    {/* Main Create New Button - Close configuration */}
                    <div className="flex justify-center">
                      <Button 
                        onClick={() => setExpandButtons(false)}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                        size="lg"
                      >
                        <Plus className="h-5 w-5 mr-2 rotate-45" />
                        Close
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    {/* Main Create New Button - Expand configuration */}
                    <Button 
                      onClick={() => setExpandButtons(true)}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                      size="lg"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Create New
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Message Board with Tabs */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg overflow-hidden">
                {/* Tabs */}
                <div className="flex overflow-x-auto scrollbar-none border-b border-white/20">
                  {["focus", "note", "resource", "project"].map((tab) => (
                    <button
                      key={tab}
                      className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                        activeTab === tab
                          ? "border-b-2 border-purple-500 text-white"
                          : "text-slate-300 hover:text-white"
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
                
                {/* Message Content */}
                <div className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {[1, 2].map((message) => (
                      <div key={message} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                          <span className="text-xs font-medium text-white">JD</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-baseline">
                            <p className="font-medium text-white">John Doe</p>
                            <span className="text-xs text-slate-400 sm:ml-2">2 hours ago</span>
                          </div>
                          <p className="text-sm text-slate-300 mt-1">
                            Just finished the wireframes for the new dashboard layout. Let me know what you think!
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-4 bg-white/20" />
                  
                  <div className="mt-2">
                    <Textarea 
                      className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder:text-slate-400 focus:ring-1 focus:ring-purple-500"
                      placeholder="Type..."
                      rows={2}
                    />
                    <div className="flex justify-end mt-2">
                      <Button className="bg-purple-600/90 hover:bg-purple-700/90 text-white border border-purple-500/30">Send</Button>
                    </div>
                  </div>
                </div>
              </div>
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
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 sm:p-6 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4">Calendar</h2>
                <div className="max-w-full overflow-x-auto">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="bg-white/5 rounded-md border border-white/20 text-white"
                  />
                </div>
                
                <div className="mt-4">
                  <h3 className="font-medium text-white mb-2">Upcoming Events</h3>
                  <div className="space-y-2">
                    {[1, 2].map((event) => (
                      <div key={event} className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded">
                        <div className="w-1 h-full min-h-[24px] bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-sm text-white">Team Meeting</p>
                          <p className="text-xs text-slate-300">3:00 PM - 4:00 PM</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
