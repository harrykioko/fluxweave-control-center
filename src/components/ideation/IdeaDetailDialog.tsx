
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Brain, MessageSquare, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

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
    first_name?: string;
    last_name?: string;
  } | null;
}

export function IdeaDetailDialog({ open, onOpenChange, idea }: IdeaDetailDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  if (!idea) return null;

  const updateStatus = async (newStatus: "draft" | "active" | "completed") => {
    try {
      const { error } = await supabase
        .from("ideas")
        .update({ status: newStatus })
        .eq("id", idea.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["ideas"] });
      
      toast({
        title: "Status updated",
        description: `Idea status changed to ${newStatus}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 bg-white/60 backdrop-blur-xl">
        <div className="grid grid-cols-2 h-full">
          {/* Left Panel - Details */}
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
              
              <div className="pt-4 border-t border-white/20">
                <h3 className="text-sm font-medium text-slate-700 mb-3">Status</h3>
                <div className="flex gap-2">
                  {(["draft", "active", "completed"] as const).map((status) => (
                    <Button
                      key={status}
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus(status)}
                      className={cn(
                        "capitalize",
                        idea.status === status && "bg-white/50"
                      )}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                {idea.first_name && (
                  <p className="text-sm text-slate-500">
                    Created by {idea.first_name} {idea.last_name}
                  </p>
                )}
                <p className="text-sm text-slate-500">
                  on {new Date(idea.createdAt).toLocaleDateString()}
                </p>
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
