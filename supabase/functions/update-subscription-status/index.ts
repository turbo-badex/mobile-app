
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

interface RequestBody {
  userId: string;
  status: 'trial' | 'active' | 'cancelled' | 'expired' | 'free';
  isPremium: boolean;
  planId?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key (full admin rights)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Parse request body
    const { 
      userId, 
      status, 
      isPremium, 
      planId = null,
      currentPeriodStart = null,
      currentPeriodEnd = null
    } = await req.json() as RequestBody;
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    console.log(`Updating subscription for user ${userId} to status: ${status}`);

    // Update the subscription in the database
    const { data, error } = await supabase
      .from("subscriptions")
      .update({
        status,
        is_premium: isPremium,
        plan_id: planId,
        current_period_start: currentPeriodStart,
        current_period_end: currentPeriodEnd,
        updated_at: new Date().toISOString()
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating subscription:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, subscription: data }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Server error:", error.message);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
