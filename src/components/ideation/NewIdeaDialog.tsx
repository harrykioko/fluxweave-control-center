
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Brain, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

interface NewIdeaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewIdeaDialog({ open, onOpenChange }: NewIdeaDialogProps) {
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      const { data, error } = await supabase
        .from("ideas")
        .insert([{
          title: "New Idea",
          description: message,
          tags: ["innovation"],
        }])
        .select()
        .single();

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["ideas"] });
      setMessage("");
      onOpenChange(false);
      
      toast({
        title: "Success",
        description: "Your idea has been created!",
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
      <DialogContent className="sm:max-w-2xl h-[80vh] bg-white/60 backdrop-blur-xl">
        <div className="space-y-4 h-full flex flex-col">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/50 backdrop-blur-md rounded-lg">
              <Brain className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">New Idea</h2>
          </div>

          <div className="flex-1 bg-white/50 backdrop-blur-md rounded-xl p-6 space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <MessageSquare className="h-4 w-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">What should we launch next?</span>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your idea..."
              className="w-full h-32 p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-700">Suggested Ideas</h3>
              <div className="grid gap-3">
                {["Mobile App for Local Events", "Sustainable Fashion Marketplace", "AI-Powered Learning Platform"].map((suggestion) => (
                  <button
                    key={suggestion}
                    className="text-left p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-colors"
                    onClick={() => setMessage(suggestion)}
                  >
                    <p className="text-sm font-medium text-slate-700">{suggestion}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={!message}
              className="bg-purple-600 text-white hover:bg-purple-700"
            >
              Create Idea
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
