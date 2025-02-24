
import { Avatar } from "@/components/ui/avatar";
import { Calendar, CheckCircle2 } from "lucide-react";

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    assignee: User;
    status: "pending" | "in_progress" | "completed";
    dueDate?: string;
  };
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-lg p-4 hover:bg-white/50 transition-all hover-scale">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <h4 className="font-medium text-slate-800">{task.title}</h4>
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <Calendar className="h-4 w-4" />
            <span>{task.dueDate}</span>
          </div>
        </div>
        <Avatar
          className="ring-2 ring-white"
          src={task.assignee.avatar}
          alt={task.assignee.name}
        />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className={`flex items-center space-x-1.5 text-sm ${
          task.status === "completed" ? "text-green-600" : "text-slate-500"
        }`}>
          <CheckCircle2 className="h-4 w-4" />
          <span className="capitalize">{task.status.replace("_", " ")}</span>
        </div>
      </div>
    </div>
  );
}
