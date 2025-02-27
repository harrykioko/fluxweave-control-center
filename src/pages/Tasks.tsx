
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Plus, Share2, Calendar } from "lucide-react";

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface Task {
  id: string;
  title: string;
  assignee: User;
  status: "pending" | "in_progress" | "completed";
  dueDate?: string;
}

const teamMembers: User[] = [
  { id: "1", name: "John Doe", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" },
  { id: "2", name: "Jane Smith", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80" },
  { id: "3", name: "Mike Johnson", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e" },
];

const tasks: Task[] = [
  {
    id: "1",
    title: "Allocate Case to User",
    assignee: teamMembers[0],
    status: "pending",
    dueDate: "2024-03-20"
  },
  {
    id: "2",
    title: "Identify Issue Category",
    assignee: teamMembers[1],
    status: "in_progress",
    dueDate: "2024-03-21"
  },
  {
    id: "3",
    title: "Estimate Resolution Time",
    assignee: teamMembers[2],
    status: "completed",
    dueDate: "2024-03-22"
  },
];

export default function Tasks() {
  return (
    <main className="min-h-screen pt-20 px-4 md:px-8 bg-gradient-to-br from-slate-800/90 via-slate-700/80 to-slate-800/90">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg">
          <div>
            <h1 className="text-3xl font-bold text-white text-gradient">Customer Journeys</h1>
            <p className="text-slate-300 mt-2">Manage and track customer support workflows</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white/5 backdrop-blur-md border-white/10 text-white hover:bg-white/10">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" className="bg-white/5 backdrop-blur-md border-white/10 text-white hover:bg-white/10">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
            <Button className="bg-purple-600/90 hover:bg-purple-700/90 text-white border border-purple-500/30">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Team Members</h3>
          <div className="flex -space-x-2 overflow-hidden">
            {teamMembers.map((member) => (
              <Avatar key={member.id} className="inline-block ring-2 ring-purple-500/30 border border-white/20">
                <AvatarImage src={member.avatar} alt={member.name} />
              </Avatar>
            ))}
            <button className="inline-flex items-center justify-center w-8 h-8 text-xs font-medium text-white bg-purple-600/80 rounded-full ring-2 ring-purple-500/30 border border-white/20 hover:bg-purple-700/80">
              +3
            </button>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Case Allocation Column */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Case Allocation</h3>
            <div className="space-y-4">
              {tasks.filter(task => task.status === "pending").map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>

          {/* Issue Identification Column */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Issue Identification</h3>
            <div className="space-y-4">
              {tasks.filter(task => task.status === "in_progress").map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>

          {/* Technical Resolution Column */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Technical Resolution</h3>
            <div className="space-y-4">
              {tasks.filter(task => task.status === "completed").map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>

          {/* New Tasks Column */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">New Tasks</h3>
            <button className="w-full h-32 rounded-lg border-2 border-dashed border-white/20 hover:border-white/30 bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <Plus className="h-6 w-6 mr-2" />
              Add Task
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
