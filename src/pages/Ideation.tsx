import { useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { IdeaCard } from "@/components/ideation/IdeaCard";
import { IdeaDetailDialog } from "@/components/ideation/IdeaDetailDialog";
import { NewIdeaDialog } from "@/components/ideation/NewIdeaDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
interface Idea {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: "draft" | "active" | "completed";
  createdAt: string;
}
const mockIdeas: Idea[] = [{
  id: "1",
  title: "Local Bookstore Discovery Platform",
  description: "Connect readers with independent bookstores through a digital platform that enhances discovery and community engagement.",
  tags: ["retail", "digital", "community"],
  status: "active",
  createdAt: "2024-02-20"
}, {
  id: "2",
  title: "Sustainable Package Delivery",
  description: "Eco-friendly last-mile delivery service using electric vehicles and reusable packaging.",
  tags: ["sustainability", "logistics", "innovation"],
  status: "draft",
  createdAt: "2024-02-19"
}];
export default function Ideation() {
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [isNewIdeaOpen, setIsNewIdeaOpen] = useState(false);
  const [ideas, setIdeas] = useState<Idea[]>(mockIdeas);
  return <div className="min-h-screen bg-gradient-to-br from-slate-50/90 to-slate-100/80">
      <AppSidebar />
      <main className="pt-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-800"></h1>
              <p className="text-slate-500 mt-2 text-center">Explore and develop your innovative ideas</p>
            </div>
            <Button className="bg-white/50 hover:bg-white/60" onClick={() => setIsNewIdeaOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Idea
            </Button>
          </div>

          {/* Ideas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map(idea => <IdeaCard key={idea.id} idea={idea} onClick={() => setSelectedIdea(idea)} />)}
          </div>
        </div>
      </main>

      {/* Modals */}
      <NewIdeaDialog open={isNewIdeaOpen} onOpenChange={setIsNewIdeaOpen} onIdeaCreate={newIdea => {
      setIdeas([...ideas, newIdea]);
      setIsNewIdeaOpen(false);
    }} />
      <IdeaDetailDialog open={!!selectedIdea} onOpenChange={open => !open && setSelectedIdea(null)} idea={selectedIdea} />
    </div>;
}