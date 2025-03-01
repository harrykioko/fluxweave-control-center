
import { CheckSquare } from "lucide-react";

export function UpcomingTasks() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white px-1 flex items-center">
        <CheckSquare className="h-5 w-5 mr-2" />
        Upcoming Tasks
      </h2>
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
  );
}
