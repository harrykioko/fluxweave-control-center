
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const prompts = {
  market: `As a business strategist specializing in startups and digital innovation, analyze the market potential for this idea:
- Estimate the total addressable market (TAM), serviceable available market (SAM), and serviceable obtainable market (SOM)
- Discuss key demographics and user segments
- Analyze market trends and growth projections
- Identify market opportunities and challenges

Format your response in HTML with appropriate headers and bullet points.`,

  feasibility: `As a technical and business strategist, assess the feasibility of this idea:
- Evaluate technical feasibility and implementation challenges
- Assess business viability and potential revenue models
- Analyze product-market fit
- Consider operational requirements
- Identify potential risks and mitigation strategies

Format your response in HTML with appropriate headers and bullet points.`,

  considerations: `As a startup strategist, outline the key strategic considerations for this idea:
- Define the unique value proposition
- Identify competitive advantages and market positioning
- List critical partnerships and resources needed
- Analyze potential barriers to entry
- Consider regulatory and compliance requirements

Format your response in HTML with appropriate headers and bullet points.`,

  "next-steps": `As a business development expert, recommend the next steps for implementing this idea:
- Outline immediate actions for validation and testing
- Suggest a phased implementation roadmap
- Define key milestones and success metrics
- Recommend funding and resource allocation strategies
- Propose go-to-market approach

Format your response in HTML with appropriate headers and bullet points.`
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { idea, context = "", tab = "market" } = await req.json();
    
    const fullContext = `${context}\n\n${idea}`.trim();
    
    console.log(`Processing ${tab} analysis for idea:`, fullContext.substring(0, 100) + "...");

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: prompts[tab as keyof typeof prompts]
          },
          {
            role: 'user',
            content: fullContext
          }
        ],
      }),
    });

    const data = await response.json();
    console.log('OpenAI response received for', tab);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    return new Response(
      JSON.stringify({ 
        analysis: data.choices[0].message.content 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in evaluate-idea function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
