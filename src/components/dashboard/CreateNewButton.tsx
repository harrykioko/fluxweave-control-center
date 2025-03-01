
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Lightbulb, CheckSquare, FileText, Layers } from "lucide-react";

export function CreateNewButton() {
  const [expandButtons, setExpandButtons] = useState(false);
  
  return (
    <div className="my-8">
      {expandButtons ? (
        <div className="animate-fade-in">
          {/* Grid layout for expanded buttons - more reliable across screen sizes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white shadow-lg shadow-purple-500/20 border-purple-500/30"
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Idea
                </Button>
              </DialogTrigger>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white shadow-lg shadow-purple-500/20 border-purple-500/30"
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Task
                </Button>
              </DialogTrigger>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white shadow-lg shadow-purple-500/20 border-purple-500/30"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Resource
                </Button>
              </DialogTrigger>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white shadow-lg shadow-purple-500/20 border-purple-500/30"
                >
                  <Layers className="h-4 w-4 mr-2" />
                  Portfolio
                </Button>
              </DialogTrigger>
            </Dialog>
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
    </div>
  );
}
