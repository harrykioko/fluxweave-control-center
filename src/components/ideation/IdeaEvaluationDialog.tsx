
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles, AlertTriangle, LightbulbIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface IdeaEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialIdea?: string;
}

export function IdeaEvaluationDialog({ open, onOpenChange, initialIdea = "" }: IdeaEvaluationDialogProps) {
  const [currentTab, setCurrentTab] = useState("analysis");
  const [evaluation, setEvaluation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEvaluate = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('evaluate-idea', {
        body: { idea: initialIdea },
      });

      if (error) throw error;
      setEvaluation(data.evaluation);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 bg-white/60 backdrop-blur-xl">
        <div className="grid grid-cols-2 h-full divide-x divide-white/20">
          {/* Left side - Workspace */}
          <div className="p-6 space-y-4">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-white/50 backdrop-blur-md rounded-lg">
                <Brain className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Workspace</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Your Idea</label>
                <div className="p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-white/20 min-h-[100px]">
                  {initialIdea}
                </div>
              </div>

              {evaluation && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">AI Response</label>
                  <div className="p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-white/20">
                    {evaluation}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Analysis */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-800">Analysis</h2>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  className={currentTab === "analysis" ? "bg-white/50" : ""}
                  onClick={() => setCurrentTab("analysis")}
                >
                  Analysis
                </Button>
                <Button
                  variant="ghost"
                  className={currentTab === "market" ? "bg-white/50" : ""}
                  onClick={() => setCurrentTab("market")}
                >
                  Market
                </Button>
                <Button
                  variant="ghost"
                  className={currentTab === "risks" ? "bg-white/50" : ""}
                  onClick={() => setCurrentTab("risks")}
                >
                  Risks
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Brain className="h-8 w-8 text-purple-600 animate-pulse" />
                </div>
              ) : (
                <div className="space-y-6">
                  {evaluation && evaluation.split('\n\n').map((section, index) => {
                    const [title, content] = section.split(':');
                    if (!content) return null;
                    
                    const icon = title.includes('Potential') ? (
                      <Sparkles className="h-5 w-5 text-emerald-500" />
                    ) : title.includes('Risks') ? (
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    ) : (
                      <LightbulbIcon className="h-5 w-5 text-blue-500" />
                    );

                    return (
                      <div key={index} className="p-4 bg-white/50 backdrop-blur-sm rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="mt-1">{icon}</div>
                          <div>
                            <h4 className="font-medium text-slate-800">{title.trim()}</h4>
                            <p className="text-slate-600 mt-1">{content.trim()}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
