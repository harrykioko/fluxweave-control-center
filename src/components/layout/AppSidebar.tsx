import { Home, BrainCircuit, CheckSquare, BarChart3, BookOpen, Settings, Menu, LogOut, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useTeam } from "@/contexts/TeamContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const menuItems = [{
  icon: Home,
  label: "Dashboard",
  href: "/"
}, {
  icon: BrainCircuit,
  label: "Ideation",
  href: "/ideation"
}, {
  icon: CheckSquare,
  label: "Tasks",
  href: "/tasks"
}, {
  icon: BarChart3,
  label: "Portfolio",
  href: "/portfolio"
}, {
  icon: BookOpen,
  label: "Resources",
  href: "/resources"
}, {
  icon: Settings,
  label: "Settings",
  href: "/settings"
}];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");
  const [isNewTeamDialogOpen, setIsNewTeamDialogOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<{ first_name?: string; last_name?: string } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentTeam, setCurrentTeam, teams, createTeam } = useTeam();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  const getInitials = () => {
    if (!userProfile) return "";
    return `${userProfile.first_name?.[0] || ""}${userProfile.last_name?.[0] || ""}`.toUpperCase();
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCreateTeam = async () => {
    try {
      await createTeam(newTeamName, newTeamDescription);
      setIsNewTeamDialogOpen(false);
      setNewTeamName("");
      setNewTeamDescription("");
      toast({
        title: "Team created",
        description: "Successfully created new team",
      });
    } catch (error: any) {
      toast({
        title: "Error creating team",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md border-b border-slate-200/20 bg-white/[0.01] my-[10px] px-[20px] mx-[20px]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center space-x-6">
            <span className="text-xl font-bold text-slate-800">FluxWeave</span>
            <nav className="hidden md:flex items-center space-x-2">
              {menuItems.map(item => <a key={item.label} href={item.href} className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 active:bg-slate-200/50 transition-colors relative group">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  <div className="absolute inset-0 border-b-2 border-transparent group-hover:border-slate-400 group-active:border-slate-600 transition-colors" />
                </a>)}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <>
                <div className="hidden md:flex items-center space-x-4">
                  <Select
                    value={currentTeam?.id}
                    onValueChange={(value) => {
                      const team = teams.find(t => t.id === value);
                      if (team) setCurrentTeam(team);
                    }}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select a team" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Your Teams</SelectLabel>
                        {teams.map(team => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  
                  <Dialog open={isNewTeamDialogOpen} onOpenChange={setIsNewTeamDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Users className="h-4 w-4 mr-2" />
                        New Team
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Team</DialogTitle>
                        <DialogDescription>
                          Create a new team to collaborate with others.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Team Name</Label>
                          <Input
                            id="name"
                            value={newTeamName}
                            onChange={(e) => setNewTeamName(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Input
                            id="description"
                            value={newTeamDescription}
                            onChange={(e) => setNewTeamDescription(e.target.value)}
                          />
                        </div>
                        <Button onClick={handleCreateTeam} disabled={!newTeamName}>
                          Create Team
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-transparent p-0"
                  onClick={() => navigate('/profile')}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="hidden md:flex"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setCollapsed(!collapsed)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {collapsed && <nav className="md:hidden border-t border-slate-200/20 py-2 px-4">
            {menuItems.map(item => <a key={item.label} href={item.href} className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 active:bg-slate-200/50 transition-colors">
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </a>)}
            {isAuthenticated && (
              <>
                <Select
                  value={currentTeam?.id}
                  onValueChange={(value) => {
                    const team = teams.find(t => t.id === value);
                    if (team) setCurrentTeam(team);
                  }}
                >
                  <SelectTrigger className="w-full my-2">
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Your Teams</SelectLabel>
                      {teams.map(team => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mb-2"
                  onClick={() => setIsNewTeamDialogOpen(true)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  New Team
                </Button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 active:bg-slate-200/50 transition-colors w-full"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </>
            )}
          </nav>}
      </div>
    </header>;
}
