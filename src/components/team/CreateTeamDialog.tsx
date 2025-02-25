
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTeam } from "@/contexts/TeamContext";
import { useToast } from "@/components/ui/use-toast";
import { Users } from "lucide-react";

interface CreateTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTeamDialog({ open, onOpenChange }: CreateTeamDialogProps) {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const { createTeam } = useTeam();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!teamName.trim()) return;
    try {
      await createTeam(teamName, description);
      setTeamName("");
      setDescription("");
      onOpenChange(false);
      
      toast({
        title: "Team created",
        description: "Your new team has been created successfully. You've been automatically added as the team owner.",
      });
    } catch (error: any) {
      toast({
        title: "Error creating team",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white/60 backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/50 backdrop-blur-md rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <DialogTitle className="text-xl font-semibold text-slate-800">Create New Team</DialogTitle>
          </div>
          <DialogDescription className="text-slate-500">
            Create a new team. You'll be automatically added as the team owner.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <Label htmlFor="teamName">Team Name</Label>
            <Input
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="bg-white/50"
              placeholder="Enter team name"
            />
          </div>
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white/50"
              placeholder="Describe your team's purpose"
            />
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={!teamName.trim()}
            className="w-full bg-purple-600 text-white hover:bg-purple-700"
          >
            Create Team
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

