
import { Globe } from "lucide-react";

export function ProjectOperations() {
  return (
    <section className="bg-white/50 backdrop-blur-md rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="h-4 w-4 text-indigo-600" />
        <h3 className="font-medium text-slate-800">Operations</h3>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-slate-600">
          Login credentials and domain information will be displayed here...
        </p>
      </div>
    </section>
  );
}
