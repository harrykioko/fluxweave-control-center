
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function WelcomeMessage() {
  const [firstName, setFirstName] = useState("User");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const { data, error } = await supabase
          .from("profiles")
          .select("first_name")
          .eq("id", user.id)
          .single();
        
        if (error) throw error;
        
        if (data?.first_name) {
          setFirstName(data.first_name);
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUserProfile();
  }, []);

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg">
      <h1 className="text-2xl font-bold text-white">
        {loading ? "Hello" : `Hello, ${firstName}`}
      </h1>
    </div>
  );
}
