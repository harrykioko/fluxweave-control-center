
import { useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { IdeaCard } from "@/components/ideation/IdeaCard";
import { IdeaDetailDialog } from "@/components/ideation/IdeaDetailDialog";
import { NewIdeaDialog } from "@/components/ideation/NewIdeaDialog";
import { FilterDialog } from "@/components/ideation/FilterDialog";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";

interface Idea {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: "draft" | "active" | "completed";
  createdAt: string;
}

const mockIdeas: Idea[] = [
  {
    id: "1",
    title: "Local Bookstore Discovery Platform",
    description: "Connect readers with independent bookstores through a digital platform that enhances discovery and community engagement.",
    tags: ["retail", "digital", "community"],
    status: "active",
    createdAt: "2024-02-20",
  },
  {
    id: "2",
    title: "Sustainable Package Delivery",
    description: "Eco-friendly last-mile delivery service using electric vehicles and reusable packaging.",
    tags: ["sustainability", "logistics", "innovation"],
    status: "draft",
    createdAt: "2024-02-19",
  },
];

export default function Ideation() {
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [isNewIdeaOpen, setIsNewIdeaOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [ideas, setIdeas] = useState<Idea[]>(mockIdeas);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const filteredIdeas = activeFilters.length > 0
    ? ideas.filter(idea => idea.tags.some(tag => activeFilters.includes(tag)))
    : ideas;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/90 to-slate-100/80">
      <AppSidebar />
      <div className="flex">
        {/* Left Sidebar with Filters */}
        <div className="w-64 min-h-screen pt-20 px-4 border-r border-slate-200/50 bg-white/40 backdrop-blur-xl">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">Filters</h2>
              <Button 
                variant="ghost" 
                className="w-full bg-white/50 hover:bg-white/60 justify-start"
                onClick={() => setIsFilterOpen(true)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter Ideas
              </Button>
            </div>
            {activeFilters.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-600">Active Filters:</p>
                <div className="flex flex-wrap gap-2">
                  {activeFilters.map((filter) => (
                    <span key={filter} className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                      {filter}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 pt-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-slate-800">Ideation Hub</h1>
                  <p className="text-slate-500 mt-2">Explore and develop your innovative ideas</p>
                </div>
                <Button 
                  className="bg-white/50 hover:bg-white/60"
                  onClick={() => setIsNewIdeaOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Idea
                </Button>
              </div>
            </div>

            {/* Ideas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIdeas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  onClick={() => setSelectedIdea(idea)}
                />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <FilterDialog
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
      />
      <NewIdeaDialog
        open={isNewIdeaOpen}
        onOpenChange={setIsNewIdeaOpen}
        onIdeaCreate={(newIdea) => {
          setIdeas([...ideas, newIdea]);
          setIsNewIdeaOpen(false);
        }}
      />
      <IdeaDetailDialog
        open={!!selectedIdea}
        onOpenChange={(open) => !open && setSelectedIdea(null)}
        idea={selectedIdea}
      />
    </div>
  );
}
