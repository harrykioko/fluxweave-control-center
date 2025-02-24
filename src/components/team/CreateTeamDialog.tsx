
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTeam } from "@/contexts/TeamContext";
import { TeamRole } from "@/types/team";
import { useToast } from "@/components/ui/use-toast";
import { Users, UserPlus, Shield } from "lucide-react";

interface CreateTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface NewMember {
  email: string;
  role: TeamRole;
}

export function CreateTeamDialog({ open, onOpenChange }: CreateTeamDialogProps) {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<TeamRole>("member");
  const [members, setMembers] = useState<NewMember[]>([]);
  const { createTeam, addTeamMember } = useTeam();
  const { toast } = useToast();

  const handleAddMember = () => {
    if (!newMemberEmail.trim()) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setMembers([...members, { email: newMemberEmail, role: newMemberRole }]);
    setNewMemberEmail("");
    setNewMemberRole("member");
  };

  const handleRemoveMember = (email: string) => {
    setMembers(members.filter(member => member.email !== email));
  };

  const handleSubmit = async () => {
    if (!teamName.trim()) return;
    try {
      const newTeam = await createTeam(teamName, description);
      if (members.length > 0) {
        // Add each member to the team
        for (const member of members) {
          await addTeamMember(newTeam.id, member.email, member.role);
        }
      }
      setTeamName("");
      setDescription("");
      setMembers([]);
      onOpenChange(false);
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
            Create a new team and add members with their respective roles.
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
          
          <div className="space-y-4">
            <Label>Team Members</Label>
            <div className="flex gap-2">
              <Input
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                className="bg-white/50 flex-1"
                placeholder="Enter member's email"
              />
              <Select
                value={newMemberRole}
                onValueChange={(value: TeamRole) => setNewMemberRole(value)}
              >
                <SelectTrigger className="w-[120px] bg-white/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleAddMember}
                variant="secondary"
                className="bg-purple-100 hover:bg-purple-200"
              >
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>

            {members.length > 0 && (
              <div className="space-y-2">
                {members.map((member) => (
                  <div
                    key={member.email}
                    className="flex items-center justify-between p-2 bg-white/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">{member.email}</span>
                      <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded">
                        {member.role}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member.email)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
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

