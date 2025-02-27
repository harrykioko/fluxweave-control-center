
import { useState } from "react";
import { IdeaCard } from "@/components/ideation/IdeaCard";
import { IdeaDetailDialog } from "@/components/ideation/IdeaDetailDialog";
import { NewIdeaDialog } from "@/components/ideation/NewIdeaDialog";
import { IdeaEvaluationDialog } from "@/components/ideation/IdeaEvaluationDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Idea {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: "draft" | "active" | "completed";
  stage: "low_priority" | "exploration" | "on_deck";
  created_at: string;
  created_by: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  createdAt: string;
}

type Stage = "low_priority" | "exploration" | "on_deck";

const STAGES: { id: Stage; label: string }[] = [
  { id: "low_priority", label: "Low Priority" },
  { id: "exploration", label: "Exploration" },
  { id: "on_deck", label: "On Deck" },
];

export default function Ideation() {
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [isNewIdeaOpen, setIsNewIdeaOpen] = useState(false);
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false);
  const [currentIdea, setCurrentIdea] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: ideas = [], isLoading } = useQuery({
    queryKey: ["ideas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recent_ideas")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      return (data || []).map((idea) => ({
        ...idea,
        createdAt: idea.created_at,
      })) as Idea[];
    },
  });

  const handleEvaluate = (idea: string) => {
    setCurrentIdea(idea);
    setIsNewIdeaOpen(false);
    setIsEvaluationOpen(true);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, idea: Idea) => {
    e.dataTransfer.setData("idea_id", idea.id);
    e.dataTransfer.setData("idea_title", idea.title);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, targetStage: Stage) => {
    e.preventDefault();
    const ideaId = e.dataTransfer.getData("idea_id");
    const ideaTitle = e.dataTransfer.getData("idea_title");

    // Optimistically update the UI
    const previousIdeas = queryClient.getQueryData(["ideas"]) as Idea[];
    queryClient.setQueryData(["ideas"], (old: Idea[] | undefined) => {
      if (!old) return [];
      return old.map(idea => 
        idea.id === ideaId ? { ...idea, stage: targetStage } : idea
      );
    });

    const { error } = await supabase
      .from("ideas")
      .update({ stage: targetStage })
      .eq("id", ideaId);

    if (error) {
      console.error("Failed to update idea stage:", error);
      // Revert to previous state if update failed
      queryClient.setQueryData(["ideas"], previousIdeas);
      toast({
        title: "Error",
        description: "Failed to move idea. Please try again.",
        variant: "destructive",
        className: "bg-red-500/90 backdrop-blur-md border border-red-200/50 shadow-lg",
      });
    } else {
      toast({
        title: "Idea moved",
        description: `"${ideaTitle}" moved to ${targetStage.replace(/_/g, ' ').toLowerCase()}`,
        className: "glass-panel bg-white/20 text-white",
      });
    }
  };

  return (
    <main className="min-h-screen pt-20 px-4 md:px-8 bg-gradient-to-br from-slate-800/90 via-slate-700/80 to-slate-800/90">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        <div className="flex justify-between items-center glass-panel p-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white text-gradient">Innovation Hub</h1>
            <p className="text-slate-300 mt-2">Manage and track your ideas from concept to execution</p>
          </div>
          <Button 
            className="bg-purple-600/90 hover:bg-purple-700/90 text-white border border-purple-500/30"
            onClick={() => setIsNewIdeaOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Idea
          </Button>
        </div>

        {/* Ideas Grid */}
        {isLoading ? (
          <div className="text-center text-white">Loading ideas...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {STAGES.map((stage) => (
              <div 
                key={stage.id}
                className="glass-panel p-6 space-y-4"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-white">{stage.label}</h2>
                  <span className="text-sm text-slate-300 bg-white/10 px-2 py-1 rounded-full">
                    {ideas.filter(idea => idea.stage === stage.id).length} ideas
                  </span>
                </div>
                <div className="space-y-4">
                  {ideas
                    .filter(idea => idea.stage === stage.id)
                    .map(idea => (
                      <div
                        key={idea.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, idea)}
                      >
                        <IdeaCard
                          idea={idea}
                          onClick={() => setSelectedIdea(idea)}
                        />
                      </div>
                    ))
                  }
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <NewIdeaDialog
        open={isNewIdeaOpen}
        onOpenChange={setIsNewIdeaOpen}
        onEvaluate={handleEvaluate}
      />
      <IdeaDetailDialog
        open={!!selectedIdea}
        onOpenChange={(open) => !open && setSelectedIdea(null)}
        idea={selectedIdea}
      />
      <IdeaEvaluationDialog
        open={isEvaluationOpen}
        onOpenChange={setIsEvaluationOpen}
        initialIdea={currentIdea}
      />
    </main>
  );
}

