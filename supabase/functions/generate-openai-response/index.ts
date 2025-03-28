import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const openaiApiKey = Deno.env.get('OPENAI_API_KEY') || '';

if (!openaiApiKey) {
  console.error('OPENAI_API_KEY is not set');
}

interface MessageContext {
  conversationType?: string;
  extractedFrom?: 'screenshot' | 'manual' | 'unknown';
  theirMessage?: string;
  myMessage?: string;
  focusWords?: string;
}

interface RequestBody {
  text: string;
  type?: 'genuine' | 'nsfw' | 'rizz';
  previousResponses?: string[];
  language?: 'english' | 'pidgin';
  messageContext?: MessageContext;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { 
      text, 
      type = 'genuine', 
      previousResponses = [],
      language = 'english',
      messageContext = { 
        conversationType: 'unknown', 
        extractedFrom: 'unknown',
        theirMessage: '',
        myMessage: '',
        focusWords: ''
      }
    } = await req.json() as RequestBody;

    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ 
          error: 'Text is required',
          aiResponse: language === 'english' 
            ? "I need some text to respond to. Could you provide a message?" 
            : "I need text to respond to. Abeg, provide some message." 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    if (!openaiApiKey) {
      console.error('OpenAI API key is not configured');
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key is not configured',
          aiResponse: language === 'english' 
            ? "The AI service is not properly configured. Please contact support." 
            : "The AI service never set up well. Abeg contact support."
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const contextStatement = messageContext.theirMessage 
      ? `Conversation: "${messageContext.theirMessage}"`
      : `Conversation: "${text}"`;
    
    const myMessageContext = messageContext.myMessage 
      ? `My previous message: "${messageContext.myMessage}"`
      : '';
    
    const systemPrompt = language === 'english' 
      ? `You are a flirty ${type} chat response generator. Be very brief (max 40 words).`
      : `You are a flirty ${type} Nigerian chat response generator. Use Nigerian slang. Be very brief (max 40 words).`;

    const userPrompt = `${contextStatement} ${myMessageContext}`;
    
    const focusPrompt = messageContext.focusWords 
      ? `Try to mention: ${messageContext.focusWords}` 
      : '';

    const avoidPrompt = previousResponses.length > 0 
      ? `Avoid these phrases: ${previousResponses.join(', ')}` 
      : '';

    console.log('Sending optimized request to OpenAI API');
    console.log(`Text: ${text.slice(0, 50)}${text.length > 50 ? '...' : ''}`);
    console.log(`Type: ${type}, Language: ${language}`);
    
    const startTime = Date.now();
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', // Fastest model for this use case
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
            ...(focusPrompt ? [{ role: "user", content: focusPrompt }] : []),
            ...(avoidPrompt ? [{ role: "user", content: avoidPrompt }] : [])
          ],
          temperature: 0.7,  
          max_tokens: 60,  // Keep responses short
          top_p: 0.9,
          frequency_penalty: 0.5,
          presence_penalty: 0.5
        }),
      });

      const processingTime = Date.now() - startTime;
      console.log(`OpenAI API response time: ${processingTime}ms`);

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`OpenAI API Error (${response.status}):`, errorData);
        
        let errorMessage = `OpenAI API Error: ${response.status}`;
        try {
          const parsedError = JSON.parse(errorData);
          if (parsedError.error && parsedError.error.message) {
            errorMessage = `OpenAI API Error: ${parsedError.error.message}`;
          }
        } catch (e) {
          console.error('Could not parse error response as JSON');
        }
        
        const fallbackResponse = language === 'english' 
          ? "Let's continue our chat! What's on your mind?"
          : "I dey enjoy our gist. Wetin dey your mind?";
        
        return new Response(
          JSON.stringify({ 
            aiResponse: fallbackResponse,
            modelUsed: "fallback",
            provider: "local",
            language: language,
            error: errorMessage,
            processingTime
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      const result = await response.json();
      console.log('OpenAI API response successful');
      
      let processedResponse = result.choices[0].message.content?.trim() || "Sorry, I couldn't generate a response";
      
      if (processedResponse.length > 120) {
        processedResponse = processedResponse.substring(0, 117) + '...';
      }
      
      return new Response(
        JSON.stringify({ 
          aiResponse: processedResponse,
          modelUsed: "gpt-3.5-turbo",
          provider: "openai",
          language: language,
          processingTime,
          promptTokens: result.usage?.prompt_tokens || 0,
          completionTokens: result.usage?.completion_tokens || 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    } catch (error) {
      console.error('OpenAI API fetch error:', error);
      
      const fallbackResponse = language === 'english' 
        ? "I'd love to respond but having trouble. Try again?"
        : "System dey act up. Try again?";
      
      return new Response(
        JSON.stringify({ 
          aiResponse: fallbackResponse,
          modelUsed: "fallback",
          provider: "local",
          language: language,
          error: `OpenAI API error: ${error.message}`,
          processingTime: Date.now() - startTime
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }
  } catch (error) {
    console.error('Edge function error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Edge function error',
        message: error.message,
        aiResponse: "I'm having trouble right now. Please try again."
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});
