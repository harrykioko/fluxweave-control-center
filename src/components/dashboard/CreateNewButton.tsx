import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Lightbulb, CheckSquare, FileText, Layers } from "lucide-react";
import { NewIdeaDialog } from "@/components/ideation/NewIdeaDialog";
import { NewTaskDialog } from "@/components/tasks/NewTaskDialog";
import { AddResourceDialog } from "@/components/resources/AddResourceDialog";
import { NewProjectDialog } from "@/components/portfolio/NewProjectDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function CreateNewButton() {
  const [expandButtons, setExpandButtons] = useState(false);
  
  // Dialog open states
  const [ideaDialogOpen, setIdeaDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [resourceDialogOpen, setResourceDialogOpen] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  
  // Fetch profiles for use in the task dialog
  const { data: profiles = [] } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, avatar_url");

      if (error) throw error;
      return data;
    },
    staleTime: 300000,
  });
  
  // Handle idea evaluation (required by NewIdeaDialog)
  const handleIdeaEvaluation = (idea: string) => {
    // Just close the dialog for now
    setIdeaDialogOpen(false);
  };
  
  // Handle refreshes after creation (can be expanded later)
  const handleCreationSuccess = () => {
    // Could trigger refreshes or notifications
  };
  
  return (
    <div className="my-8">
      {expandButtons ? (
        <div className="animate-fade-in">
          {/* Grid layout for expanded buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <Button 
              onClick={() => {
                setIdeaDialogOpen(true);
                setExpandButtons(false);
              }}
              className="w-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white shadow-lg shadow-purple-500/20 border-purple-500/30"
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              Idea
            </Button>
            
            <Button 
              onClick={() => {
                setTaskDialogOpen(true);
                setExpandButtons(false);
              }}
              className="w-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white shadow-lg shadow-purple-500/20 border-purple-500/30"
            >
              <CheckSquare className="h-4 w-4 mr-2" />
              Task
            </Button>

            <Button 
              onClick={() => {
                setResourceDialogOpen(true);
                setExpandButtons(false);
              }}
              className="w-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white shadow-lg shadow-purple-500/20 border-purple-500/30"
            >
              <FileText className="h-4 w-4 mr-2" />
              Resource
            </Button>
            
            <Button 
              onClick={() => {
                setProjectDialogOpen(true);
                setExpandButtons(false);
              }}
              className="w-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white shadow-lg shadow-purple-500/20 border-purple-500/30"
            >
              <Layers className="h-4 w-4 mr-2" />
              Portfolio
            </Button>
          </div>

          {/* Main Create New Button - Close configuration */}
          <div className="flex justify-center">
            <Button 
              onClick={() => setExpandButtons(false)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2 rotate-45" />
              Close
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          {/* Main Create New Button - Expand configuration */}
          <Button 
            onClick={() => setExpandButtons(true)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New
          </Button>
        </div>
      )}

      {/* Idea Dialog */}
      <NewIdeaDialog 
        open={ideaDialogOpen} 
        onOpenChange={setIdeaDialogOpen} 
        onEvaluate={handleIdeaEvaluation} 
      />

      {/* Task Dialog - now passing the profiles prop */}
      <NewTaskDialog 
        open={taskDialogOpen} 
        onOpenChange={setTaskDialogOpen} 
        profiles={profiles}
      />

      {/* Resource Dialog */}
      <AddResourceDialog 
        open={resourceDialogOpen} 
        onOpenChange={setResourceDialogOpen} 
        onResourceAdded={handleCreationSuccess} 
      />

      {/* Project Dialog */}
      <NewProjectDialog 
        open={projectDialogOpen} 
        onOpenChange={setProjectDialogOpen} 
        onProjectAdded={handleCreationSuccess} 
      />
    </div>
  );
}
