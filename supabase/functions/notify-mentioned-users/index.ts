
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.23.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const supabaseServiceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { mentionedUserIds, messageContent, mentionerName, mentionerId } = await req.json()

    // Fetch the mentioned users to get their emails
    const { data: mentionedUsers, error: usersError } = await supabaseServiceClient
      .from('profiles')
      .select('id, first_name, last_name')
      .in('id', mentionedUserIds)

    if (usersError) {
      throw usersError
    }

    // Fetch auth users to get emails
    const { data: authUsers, error: authError } = await supabaseServiceClient
      .auth.admin.listUsers()

    if (authError) {
      throw authError
    }

    // Map profile IDs to emails
    const userEmails = new Map()
    for (const authUser of authUsers.users) {
      userEmails.set(authUser.id, authUser.email)
    }

    // Send notification to each mentioned user
    for (const mentionedUser of mentionedUsers) {
      const userEmail = userEmails.get(mentionedUser.id)
      if (!userEmail) continue

      // In a real implementation, you would call an email service here
      // For now, we'll just log the notification
      console.log(`
        Sending notification to: ${userEmail}
        Subject: You were mentioned in a message
        Body: ${mentionerName} mentioned you in a message:
        "${messageContent}"
      `)

      // Example of how you might send this with an email service:
      /*
      await fetch('https://your-email-service-api.com/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: userEmail,
          subject: 'You were mentioned in a message',
          body: `${mentionerName} mentioned you in a message: "${messageContent}"`
        })
      })
      */
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
