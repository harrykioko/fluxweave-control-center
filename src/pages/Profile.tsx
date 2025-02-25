
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTeam } from "@/contexts/TeamContext";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { TeamsList } from "@/components/team/TeamsList";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  username: string | null;
  avatar_url: string | null;
}

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { teams } = useTeam();
  const { toast } = useToast();

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
    } catch (error: any) {
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/90 to-slate-100/80">
      <AppSidebar />
      <main className="pt-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
          <div className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg">
            <h1 className="text-3xl font-bold text-slate-800">Profile</h1>
            <p className="text-slate-500 mt-2">Manage your personal information and teams.</p>
          </div>

          <ProfileForm profile={profile} onProfileUpdate={loadProfile} />
          <TeamsList teams={teams} />
        </div>
      </main>
    </div>
  );
}
