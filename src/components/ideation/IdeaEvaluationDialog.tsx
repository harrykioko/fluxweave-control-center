
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles, AlertTriangle, LightbulbIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface IdeaEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function IdeaEvaluationDialog({ open, onOpenChange }: IdeaEvaluationDialogProps) {
  const [idea, setIdea] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEvaluate = async () => {
    if (!idea.trim()) {
      toast({
        title: "Error",
        description: "Please enter an idea to evaluate",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('evaluate-idea', {
        body: { idea },
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
      <DialogContent className="sm:max-w-2xl h-[80vh] bg-white/60 backdrop-blur-xl">
        <div className="space-y-4 h-full flex flex-col">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/50 backdrop-blur-md rounded-lg">
              <Brain className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">AI Idea Evaluation</h2>
          </div>

          <div className="flex-1 bg-white/50 backdrop-blur-md rounded-xl p-6 space-y-4">
            <div>
              <label htmlFor="idea" className="block text-sm font-medium text-slate-700 mb-2">
                Describe your idea
              </label>
              <textarea
                id="idea"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Enter your business idea here..."
                className="w-full h-32 p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
              <Button 
                onClick={handleEvaluate}
                disabled={isLoading || !idea.trim()}
                className="mt-4 bg-purple-600 text-white hover:bg-purple-700"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <Brain className="animate-pulse mr-2" />
                    Evaluating...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Sparkles className="mr-2" />
                    Evaluate Idea
                  </span>
                )}
              </Button>
            </div>

            {evaluation && (
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold text-slate-800">Evaluation Results</h3>
                <div className="space-y-4 bg-white/70 rounded-lg p-4">
                  {evaluation.split('\n\n').map((section, index) => {
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
                      <div key={index} className="flex space-x-3">
                        <div className="mt-1">{icon}</div>
                        <div>
                          <h4 className="font-medium text-slate-800">{title.trim()}</h4>
                          <p className="text-slate-600 mt-1">{content.trim()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
