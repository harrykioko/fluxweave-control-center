
import { CheckSquare } from "lucide-react";

export function ProjectTasks() {
  return (
    <section className="bg-white/50 backdrop-blur-md rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <CheckSquare className="h-4 w-4 text-emerald-600" />
        <h3 className="font-medium text-slate-800">Tasks</h3>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-slate-600">
          Project tasks and to-dos will be displayed here...
        </p>
      </div>
    </section>
  );
}
