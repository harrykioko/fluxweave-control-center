
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DashboardMetricCard } from "@/components/dashboard/DashboardMetricCard";
import { ActivityFeed } from "@/components/profile/ActivityFeed";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus, MessageSquare, CalendarIcon, Briefcase, CheckSquare } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Index() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - 7 columns wide */}
            <div className="lg:col-span-7 space-y-6">
              {/* Welcome Message */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-slate-800">Welcome back, Alex</h1>
                <p className="text-slate-600 mt-2">
                  You have 3 active projects and 5 tasks due this week.
                </p>
              </div>
              
              {/* Summary Projects */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-800">Project Summary</h2>
                  <Button variant="outline" size="sm" className="text-blue-600">
                    View All
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DashboardMetricCard
                    title="Active Projects"
                    value="3"
                    icon={<Briefcase className="h-5 w-5 text-blue-600" />}
                  />
                  <DashboardMetricCard
                    title="Completed Tasks"
                    value="12"
                    icon={<CheckSquare className="h-5 w-5 text-green-600" />}
                  />
                </div>
              </div>
              
              {/* Upcoming Tasks */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-800">Upcoming Tasks</h2>
                  <Button variant="outline" size="sm" className="text-blue-600">
                    View All
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {[1, 2, 3].map((task) => (
                    <div key={task} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mr-3"></div>
                      <div>
                        <p className="font-medium text-slate-800">Complete project proposal</p>
                        <p className="text-xs text-slate-500">Due in 2 days</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Create New Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    <Plus className="h-5 w-5 mr-2" />
                    Create New
                  </Button>
                </DialogTrigger>
                {/* We'll implement the actual dialog content later */}
              </Dialog>
              
              {/* Message Board */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-800">Message Board</h2>
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    New Message
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {[1, 2].map((message) => (
                    <div key={message} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">JD</span>
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
                  <textarea 
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                    placeholder="Write a message..."
                    rows={2}
                  ></textarea>
                  <div className="flex justify-end mt-2">
                    <Button size="sm">Send</Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - 5 columns wide */}
            <div className="lg:col-span-5 space-y-6">
              {/* Activity Feed */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <ActivityFeed />
              </div>
              
              {/* Calendar */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-800">Calendar</h2>
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    Add Event
                  </Button>
                </div>
                
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
