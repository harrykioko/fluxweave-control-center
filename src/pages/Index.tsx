
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DashboardMetricCard } from "@/components/dashboard/DashboardMetricCard";
import { ActivityFeed } from "@/components/profile/ActivityFeed";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus, MessageSquare, CalendarIcon, Briefcase, CheckSquare } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export default function Index() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState<string>("focus");
  
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - 8 columns wide */}
            <div className="lg:col-span-8 space-y-6">
              {/* Welcome Message */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-slate-800">Hello, Henry</h1>
                <p className="text-slate-600 mt-2">
                  You have 3 resources and 5 tasks due this week.
                </p>
              </div>
              
              {/* Top 3 Resources */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-800 px-1">Top 3 Resources</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <h3 className="font-medium text-slate-800">Resource {item}</h3>
                      <p className="text-sm text-slate-500 mt-1">Brief description here</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Upcoming Tasks */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-800 px-1">Upcoming Tasks</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((task) => (
                    <div key={task} className="flex items-start p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium text-slate-800">Complete project proposal</p>
                        <p className="text-xs text-slate-500">Due in 2 days</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Create New Buttons */}
              <div className="flex flex-wrap gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-slate-800 hover:bg-slate-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Focus
                    </Button>
                  </DialogTrigger>
                </Dialog>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-slate-800 hover:bg-slate-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Note
                    </Button>
                  </DialogTrigger>
                </Dialog>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-slate-800 hover:bg-slate-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Resource
                    </Button>
                  </DialogTrigger>
                </Dialog>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-slate-800 hover:bg-slate-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Project
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
              
              {/* Message Board with Tabs */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                  {["focus", "note", "resource", "project"].map((tab) => (
                    <button
                      key={tab}
                      className={`px-4 py-3 text-sm font-medium ${
                        activeTab === tab
                          ? "border-b-2 border-slate-800 text-slate-800"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
                
                {/* Message Content */}
                <div className="p-6">
                  <div className="space-y-4">
                    {[1, 2].map((message) => (
                      <div key={message} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                          <span className="text-xs font-medium text-slate-600">JD</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline">
                            <p className="font-medium text-slate-800">John Doe</p>
                            <span className="ml-2 text-xs text-slate-500">2 hours ago</span>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">
                            Just finished the wireframes for the new dashboard layout. Let me know what you think!
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="mt-2">
                    <Textarea 
                      className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                      placeholder="Type..."
                      rows={2}
                    />
                    <div className="flex justify-end mt-2">
                      <Button size="sm">Send</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - 4 columns wide */}
            <div className="lg:col-span-4 space-y-6">
              {/* Activity Feed */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Activity Feed</h2>
                <ActivityFeed />
              </div>
              
              {/* Calendar */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Calendar</h2>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
                
                <div className="mt-4">
                  <h3 className="font-medium text-slate-800 mb-2">Upcoming Events</h3>
                  <div className="space-y-2">
                    {[1, 2].map((event) => (
                      <div key={event} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <div className="w-1 h-full min-h-[24px] bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-sm">Team Meeting</p>
                          <p className="text-xs text-slate-500">3:00 PM - 4:00 PM</p>
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
