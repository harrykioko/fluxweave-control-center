
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles, MessageSquare, Save, PieChart, Lightbulb, CheckSquare, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface IdeaEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialIdea?: string;
}

type AnalysisTab = "market" | "feasibility" | "considerations" | "next-steps";

export function IdeaEvaluationDialog({ open, onOpenChange, initialIdea = "" }: IdeaEvaluationDialogProps) {
  const [currentTab, setCurrentTab] = useState<AnalysisTab>("market");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Record<AnalysisTab, string | null>>({
    market: null,
    feasibility: null,
    considerations: null,
    "next-steps": null
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmitMessage = async () => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('evaluate-idea', {
        body: { idea: message, context: initialIdea },
      });

      if (error) throw error;
      
      setAnalysis(prev => ({
        ...prev,
        [currentTab]: data.analysis
      }));
      
      setMessage("");
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

  const handleSaveIdea = async () => {
    try {
      // First, get the current user's ID
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("You must be logged in to save an idea");
      }

      const { data, error } = await supabase.from('ideas').insert({
        title: initialIdea.split('\n')[0] || "New Idea",
        description: initialIdea,
        tags: ["draft"],
        status: "draft",
        created_by: user.id,
        metadata: {
          analysis: analysis
        }
      }).select().single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your idea has been saved!",
        variant: "default",
      });

      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getTabIcon = (tab: AnalysisTab) => {
    switch (tab) {
      case "market":
        return <PieChart className="h-4 w-4" />;
      case "feasibility":
        return <CheckSquare className="h-4 w-4" />;
      case "considerations":
        return <Lightbulb className="h-4 w-4" />;
      case "next-steps":
        return <ArrowRight className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 bg-white/60 backdrop-blur-xl">
        <div className="grid grid-cols-2 h-full divide-x divide-white/20">
          {/* Left side - Workspace */}
          <div className="p-6 space-y-4 flex flex-col h-full">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/50 backdrop-blur-md rounded-lg">
                <Brain className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Workspace</h2>
            </div>

            <div className="flex-1 overflow-auto space-y-4">
              <div className="p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-white/20">
                <h3 className="font-medium text-slate-700 mb-2">Initial Idea</h3>
                <p className="text-slate-600">{initialIdea}</p>
              </div>

              <div className="space-y-4 flex-1">
                {Object.entries(analysis).map(([key, value]) => 
                  value && (
                    <div key={key} className="p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-white/20">
                      <h3 className="font-medium text-slate-700 mb-2 capitalize">{key.replace("-", " ")}</h3>
                      <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: value }} />
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask a question or provide more details..."
                  className="w-full h-32 p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-slate-700"
                />
                <MessageSquare className="absolute top-4 right-4 text-slate-400 h-5 w-5 pointer-events-none" />
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleSubmitMessage}
                  disabled={!message.trim() || isLoading}
                  className="flex-1 bg-purple-600 text-white hover:bg-purple-700"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isLoading ? "Processing..." : "Submit"}
                </Button>

                <Button 
                  onClick={handleSaveIdea}
                  variant="outline"
                  className="bg-white/50"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Idea
                </Button>
              </div>
            </div>
          </div>

          {/* Right side - Analysis */}
          <div className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-800">Analysis</h2>
              <div className="flex gap-2">
                {(["market", "feasibility", "considerations", "next-steps"] as AnalysisTab[]).map((tab) => (
                  <Button
                    key={tab}
                    variant="ghost"
                    className={`${currentTab === tab ? "bg-white/50" : ""} gap-2`}
                    onClick={() => setCurrentTab(tab)}
                  >
                    {getTabIcon(tab)}
                    <span className="capitalize">{tab.replace("-", " ")}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Brain className="h-8 w-8 text-purple-600 animate-pulse" />
                </div>
              ) : analysis[currentTab] ? (
                <div className="prose prose-slate max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: analysis[currentTab] || "" }} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                  <Brain className="h-8 w-8 mb-4" />
                  <p>Analysis will appear here as you interact with the AI</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

