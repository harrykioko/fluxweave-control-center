
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Brain, MessageSquare, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface NewIdeaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEvaluate: (idea: string) => void;
}

export function NewIdeaDialog({ open, onOpenChange, onEvaluate }: NewIdeaDialogProps) {
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleEvaluate = () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter an idea to evaluate",
        variant: "destructive",
      });
      return;
    }
    onEvaluate(message);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-white/60 backdrop-blur-xl">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/50 backdrop-blur-md rounded-lg">
              <Brain className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">What are you thinking?</h2>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your idea..."
                className="w-full h-32 p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-slate-700"
              />
              <MessageSquare className="absolute top-4 right-4 text-slate-400 h-5 w-5 pointer-events-none" />
            </div>

            <Button
              onClick={handleEvaluate}
              disabled={!message.trim()}
              className="w-full bg-purple-600 text-white hover:bg-purple-700"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Evaluate Idea
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
