
import { Brain } from "lucide-react";

export function ProjectAIWorkspace() {
  return (
    <section className="bg-white/50 backdrop-blur-md rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-4 w-4 text-purple-600" />
        <h3 className="font-medium text-slate-800">AI Workspace</h3>
      </div>
      <div className="bg-white/50 rounded-lg p-4">
        <p className="text-sm text-slate-600">
          AI analysis and insights will be displayed here...
        </p>
      </div>
    </section>
  );
}
