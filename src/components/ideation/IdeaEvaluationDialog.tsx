
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { WorkspaceSection } from "./WorkspaceSection";
import { AnalysisSection } from "./AnalysisSection";
import { AnalysisTab, Analysis } from "./types";

interface IdeaEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialIdea?: string;
}

export function IdeaEvaluationDialog({ open, onOpenChange, initialIdea = "" }: IdeaEvaluationDialogProps) {
  const [currentTab, setCurrentTab] = useState<AnalysisTab>("market");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis>({
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 bg-white/60 backdrop-blur-xl">
        <div className="grid grid-cols-2 h-full divide-x divide-white/20">
          <WorkspaceSection
            initialIdea={initialIdea}
            analysis={analysis}
            message={message}
            isLoading={isLoading}
            onMessageChange={setMessage}
            onSubmitMessage={handleSubmitMessage}
            onSaveIdea={handleSaveIdea}
          />
          <AnalysisSection
            currentTab={currentTab}
            onTabChange={setCurrentTab}
            analysis={analysis}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
