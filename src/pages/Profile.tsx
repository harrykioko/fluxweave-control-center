
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuditLogsDialog } from "@/components/profile/AuditLogsDialog";
import { ActivityFeed } from "@/components/profile/ActivityFeed";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  username: string | null;
  avatar_url: string | null;
  role: string;
  settings: any;
  permissions: any;
}

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { toast } = useToast();
  const [auditLogsOpen, setAuditLogsOpen] = useState(false);

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
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
          <div className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Profile</h1>
                <p className="text-slate-500 mt-2">Manage your personal information and settings.</p>
              </div>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setAuditLogsOpen(true)}
              >
                <Activity className="h-4 w-4" />
                Activity Log
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ProfileForm profile={profile} onProfileUpdate={loadProfile} />
            </div>
            <div>
              <ActivityFeed />
            </div>
          </div>
          
          <AuditLogsDialog open={auditLogsOpen} onOpenChange={setAuditLogsOpen} />
        </div>
      </main>
    </div>
  );
}
