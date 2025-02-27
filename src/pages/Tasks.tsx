
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Plus, Share2, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { NewTaskDialog } from "@/components/tasks/NewTaskDialog";

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed";
  priority: string;
  due_date?: string;
  assigned_to?: string;
  project_id?: string;
  created_by: string;
  project_name?: string;
  assignee_first_name?: string;
  assignee_last_name?: string;
  assignee_avatar_url?: string;
}

// Updated status mapping with new display labels but same database values
const TASK_STATUSES = [
  { id: "pending", label: "To-Do" },
  { id: "in_progress", label: "In Progress" },
  { id: "completed", label: "Done" }
];

export default function Tasks() {
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recent_tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Task[];
    },
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, avatar_url");

      if (error) throw error;
      return data;
    },
  });

  return (
    <main className="min-h-screen pt-20 px-4 md:px-8 bg-gradient-to-br from-slate-800/90 via-slate-700/80 to-slate-800/90">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg">
          <div>
            <h1 className="text-3xl font-bold text-white text-gradient">Customer Journeys</h1>
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
            <Button 
              className="bg-purple-600/90 hover:bg-purple-700/90 text-white border border-purple-500/30"
              onClick={() => setIsNewTaskOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        </div>

        {/* Tasks Grid */}
        {isLoading ? (
          <div className="text-center text-white">Loading tasks...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Task Status Columns */}
            {TASK_STATUSES.map((statusCol) => (
              <div key={statusCol.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-4">{statusCol.label}</h3>
                <div className="space-y-4">
                  {tasks
                    .filter(task => task.status === statusCol.id)
                    .map(task => (
                      <TaskCard 
                        key={task.id} 
                        task={{
                          ...task,
                          assignee: task.assignee_first_name ? {
                            id: task.assigned_to || "",
                            name: `${task.assignee_first_name} ${task.assignee_last_name}`,
                            avatar: task.assignee_avatar_url || `https://avatar.vercel.sh/${task.assigned_to}`
                          } : undefined
                        }} 
                      />
                    ))
                  }
                </div>
              </div>
            ))}

            {/* New Tasks Column */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4">New Tasks</h3>
              <button 
                onClick={() => setIsNewTaskOpen(true)}
                className="w-full h-32 rounded-lg border-2 border-dashed border-white/20 hover:border-white/30 bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              >
                <Plus className="h-6 w-6 mr-2" />
                Add Task
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New Task Dialog */}
      <NewTaskDialog 
        open={isNewTaskOpen} 
        onOpenChange={setIsNewTaskOpen} 
        profiles={profiles} 
      />
    </main>
  );
}
