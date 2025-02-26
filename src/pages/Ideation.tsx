
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

interface Idea {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: "draft" | "active" | "completed";
  created_at: string;
  created_by: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  createdAt: string;
}

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

  // Distribute ideas across three columns
  const columnCount = 3;
  const columns = Array.from({ length: columnCount }, (_, i) =>
    ideas.filter((_, index) => index % columnCount === i)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/90 to-slate-100/80">
      <AppSidebar />
      <main className="pt-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-800">Ideas</h1>
            <p className="text-slate-500 mt-2 mb-6">What are we building next?</p>
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
            <div className="flex gap-6 relative">
              {columns.map((columnIdeas, columnIndex) => (
                <div key={columnIndex} className="flex-1 space-y-6 relative">
                  {columnIdeas.map((idea) => (
                    <IdeaCard key={idea.id} idea={idea} onClick={() => setSelectedIdea(idea)} />
                  ))}
                  {/* Divider line for columns 1 and 2 */}
                  {columnIndex < 2 && (
                    <div className="absolute top-0 right-[-12px] bottom-0 w-px bg-slate-200/50" />
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
