
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotifyMentionedUsersBody {
  mentionedUserIds: string[];
  messageContent: string;
  mentionerName: string;
  mentionerId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the admin role (uses service_role key)
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the request body
    const { mentionedUserIds, messageContent, mentionerName, mentionerId } = await req.json() as NotifyMentionedUsersBody;

    if (!mentionedUserIds || mentionedUserIds.length === 0) {
      return new Response(
        JSON.stringify({ error: "No mentioned users provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get user profiles for the mentioned users
    const { data: mentionedProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .in('id', mentionedUserIds);

    if (profilesError) {
      throw profilesError;
    }

    console.log(`Found ${mentionedProfiles?.length || 0} mentioned profiles`);

    // Get email addresses for the mentioned users
    const promises = mentionedProfiles?.map(async (profile) => {
      // Get user email from auth.users using admin privileges
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(profile.id);

      if (userError || !userData.user) {
        console.error(`Failed to get user data for profile ${profile.id}:`, userError);
        return null;
      }

      return {
        userId: profile.id,
        email: userData.user.email,
        name: `${profile.first_name} ${profile.last_name}`.trim()
      };
    }) || [];

    const mentionedUsers = (await Promise.all(promises)).filter(user => user !== null);
    console.log(`Found ${mentionedUsers.length} mentioned users with emails`);

    // Send email notifications
    // In a real implementation, you would use an email service like SendGrid, Postmark, or Resend
    // For this example, we'll just log the emails we would send
    for (const user of mentionedUsers) {
      if (!user) continue;
      
      console.log(`Sending email notification to ${user.email} (${user.name})`);
      console.log(`Subject: You were mentioned in a message`);
      console.log(`Body: ${mentionerName} mentioned you in a message: "${messageContent}"`);
      
      // In a production environment, you would send an actual email here
      // await sendEmail(user.email, subject, body);
    }

    // Return success response
    return new Response(
      JSON.stringify({ success: true, notified: mentionedUsers.length }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error in notify-mentioned-users function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
