import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY') || '';

if (!deepseekApiKey) {
  console.error('DEEPSEEK_API_KEY is not set');
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

    if (!deepseekApiKey) {
      console.error('DeepSeek API key is not configured');
      return new Response(
        JSON.stringify({ 
          error: 'DeepSeek API key is not configured',
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
    
    const conversationTypeContext = messageContext.conversationType && messageContext.conversationType !== 'unknown'
      ? `Conversation type: ${messageContext.conversationType}`
      : '';
    
    const systemPrompt = language === 'english' 
      ? `Quick ${type} flirty response. ${contextStatement}. ${myMessageContext} ${conversationTypeContext}
      
      Be CONCISE (max 80 chars). NO EXPLANATIONS.`

      : `Quick ${type} flirty Nigerian response. ${contextStatement}. ${myMessageContext} ${conversationTypeContext}
      
      Be CONCISE (max 80 chars). NO EXPLANATIONS.`;

    const languageLabel = language === 'english' ? 'English' : 'Nigerian';
    let userPrompt = `${type} ${languageLabel} flirty response to: "${text}"`;
    if (previousResponses.length > 0) {
      userPrompt += `\nAvoid: ${previousResponses.join(', ')}`;
    }
    if (messageContext.focusWords) {
      userPrompt += `\nFocus on: ${messageContext.focusWords}`;
    }

    console.log('Sending optimized request to DeepSeek API');
    console.log(`Text: ${text.slice(0, 100)}${text.length > 100 ? '...' : ''}`);
    console.log(`Type: ${type}, Language: ${language}`);
    
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${deepseekApiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.45,  // Reduced from 0.5 for faster, more consistent responses
          max_tokens: 80,     // Reduced from 100 for faster responses
          top_p: 0.9,         // Added for more focused generation
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`DeepSeek API Error (${response.status}):`, errorData);
        
        let errorMessage = `DeepSeek API Error: ${response.status}`;
        try {
          const parsedError = JSON.parse(errorData);
          if (parsedError.error && parsedError.error.message) {
            errorMessage = `DeepSeek API Error: ${parsedError.error.message}`;
            console.error('Detailed error:', parsedError.error);
          }
        } catch (e) {
          console.error('Could not parse error response as JSON');
        }
        
        const fallbackResponses = {
          english: [
            "Let's continue our chat! Send me something else.",
            "Let's keep talking. What's on your mind?",
            "I'm enjoying our chat. What else would you like to discuss?",
            "Tell me more about yourself!",
            "What are you up to right now?"
          ],
          pidgin: [
            "I dey enjoy our gist. Wetin dey your mind?",
            "Make we continue to yarn. Wetin next?",
            "I like how we dey flow. Wetin you wan talk?",
            "This convo sweet me. Wetin else you get?",
            "Make we no stop this gist! Wassup?"
          ]
        };
        
        const randomIndex = Math.floor(Math.random() * 5);
        const fallbackMessage = language === 'english' 
          ? fallbackResponses.english[randomIndex]
          : fallbackResponses.pidgin[randomIndex];
        
        return new Response(
          JSON.stringify({ 
            aiResponse: fallbackMessage,
            modelUsed: "fallback",
            provider: "local",
            language: language,
            error: errorMessage
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      const result = await response.json();
      console.log('DeepSeek API response successful');
      console.log('Response tokens:', result.usage);
      
      let processedResponse = result.choices[0].message.content?.trim() || "Sorry, I couldn't generate a response";
      
      processedResponse = processedResponse
        .replace(/^(I think that|I would say|I believe|In my opinion|Well,|You know what,|Let me tell you,|To be honest,|I must say,|I'm|I am)\s+/i, '')
        .replace(/\s+(you know|right|I guess|I think|I suppose|if you know what I mean)\.?$/i, '.')
        .replace(/^(Hey|Hi|Hello|Hey there|Hi there)\s+/i, '');
      
      if (processedResponse.length > 80) {
        const lastSentenceBreak = processedResponse.substring(0, 80).lastIndexOf('.');
        if (lastSentenceBreak > 40) {
          processedResponse = processedResponse.substring(0, lastSentenceBreak + 1);
        } else {
          const lastWordBreak = processedResponse.substring(0, 80).lastIndexOf(' ');
          processedResponse = processedResponse.substring(0, lastWordBreak) + '...';
        }
      }
      
      return new Response(
        JSON.stringify({ 
          aiResponse: processedResponse,
          modelUsed: "deepseek-chat",
          provider: "deepseek",
          language: language,
          promptTokens: result.usage?.prompt_tokens || 0,
          completionTokens: result.usage?.completion_tokens || 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    } catch (error) {
      console.error('DeepSeek API fetch error:', error);
      console.error('Error details:', error.stack);
      
      const fallbackResponses = {
        english: [
          "I'd love to respond but having trouble. Try again?",
          "One moment, my thoughts are scrambled. Try again?",
          "I'm having a moment! Another message?",
          "Mind rephrasing that?",
          "Let's try again in a moment?"
        ],
        pidgin: [
          "System dey act up. Try again?",
          "My brain dey hang. Another message?",
          "Give me one second?",
          "Talk am another way?",
          "Make we try again?"
        ]
      };
      
      const randomIndex = Math.floor(Math.random() * 5);
      const fallbackMessage = language === 'english' 
        ? fallbackResponses.english[randomIndex]
        : fallbackResponses.pidgin[randomIndex];
      
      return new Response(
        JSON.stringify({ 
          aiResponse: fallbackMessage,
          modelUsed: "fallback",
          provider: "local",
          language: language,
          error: `DeepSeek API error: ${error.message}` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }
  } catch (error) {
    console.error('Edge function error:', error);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: 'Edge function error',
        message: error.message,
        aiResponse: "I'm having trouble right now. Please try again."
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  }
})
