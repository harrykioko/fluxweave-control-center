
import { useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { IdeaCard } from "@/components/ideation/IdeaCard";
import { IdeaDetailDialog } from "@/components/ideation/IdeaDetailDialog";
import { NewIdeaDialog } from "@/components/ideation/NewIdeaDialog";
import { IdeaEvaluationDialog } from "@/components/ideation/IdeaEvaluationDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";

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
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, targetStage: Stage) => {
    e.preventDefault();
    const ideaId = e.dataTransfer.getData("idea_id");
    const { error } = await supabase
      .from("ideas")
      .update({ stage: targetStage })
      .eq("id", ideaId);

    if (error) {
      console.error("Failed to update idea stage:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/90 to-slate-100/80">
      <AppSidebar />
      <main className="pt-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
          <div className="flex justify-end mb-6">
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white" 
              onClick={() => setIsNewIdeaOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Idea
            </Button>
          </div>

          {/* Ideas Grid */}
          {isLoading ? (
            <div className="text-center text-slate-500">Loading ideas...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {STAGES.map((stage, index) => (
                <div 
                  key={stage.id}
                  className="space-y-4"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage.id)}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-slate-700">{stage.label}</h2>
                    <span className="text-sm text-slate-500">
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
                  {index < STAGES.length - 1 && (
                    <div className="hidden lg:block">
                      <Separator orientation="vertical" className="h-full absolute right-0 top-0" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

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
    </div>
  );
}
