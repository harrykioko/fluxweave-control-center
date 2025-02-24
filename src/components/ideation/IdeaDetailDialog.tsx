
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Brain, MessageSquare, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface IdeaDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idea: {
    id: string;
    title: string;
    description: string;
    tags: string[];
    status: "draft" | "active" | "completed";
    createdAt: string;
  } | null;
}

export function IdeaDetailDialog({ open, onOpenChange, idea }: IdeaDetailDialogProps) {
  if (!idea) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 bg-white/60 backdrop-blur-xl">
        <div className="grid grid-cols-2 h-full">
          {/* Left Panel - Chat Interface */}
          <div className="p-6 border-r border-white/20">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-white/50 backdrop-blur-md rounded-lg">
                <Brain className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">{idea.title}</h2>
            </div>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {idea.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-white/50 rounded-md text-xs font-medium text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-slate-600">{idea.description}</p>
              <div className="h-[calc(100vh-300px)] bg-white/50 backdrop-blur-md rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <MessageSquare className="h-4 w-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">Discussion</span>
                </div>
                {/* Chat messages will go here */}
              </div>
            </div>
          </div>

          {/* Right Panel - Analysis */}
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-white/50 backdrop-blur-md rounded-lg">
                <Target className="h-5 w-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Analysis</h2>
            </div>
            <div className="space-y-4">
              {/* Analysis sections will go here */}
              {["Market Research", "Competition", "Implementation", "Resources"].map((section) => (
                <div
                  key={section}
                  className="bg-white/50 backdrop-blur-md rounded-xl p-6 transition-all duration-200 hover:bg-white/60"
                >
                  <h3 className="font-medium text-slate-800 mb-2">{section}</h3>
                  <p className="text-sm text-slate-600">Analysis for {section.toLowerCase()} will be displayed here...</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
