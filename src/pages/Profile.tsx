
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      
      setProfile(data);
      setFirstName(data.first_name || "");
      setLastName(data.last_name || "");
    } catch (error: any) {
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });

      await loadProfile();
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getInitials = () => {
    if (!profile) return "";
    return `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/90 to-slate-100/80">
      <AppSidebar />
      <main className="pt-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
          <div className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg">
            <h1 className="text-3xl font-bold text-slate-800">Profile</h1>
            <p className="text-slate-500 mt-2">Manage your personal information.</p>
          </div>

          <div className="bg-white/30 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-6 mb-8">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold text-slate-800">{profile?.first_name} {profile?.last_name}</h2>
                <p className="text-slate-500">Team Member</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Button onClick={handleUpdateProfile}>
                Update Profile
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
