
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get the authorization header from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { 
          status: 401, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Get the user from the auth header
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "User not authenticated" }),
        { 
          status: 401, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Get the user's subscription status
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("plan_type, is_active")
      .eq("user_id", user.id)
      .single();

    // If user has a paid subscription, they have unlimited uploads
    if (subscription && subscription.is_active && ['monthly', 'annual'].includes(subscription.plan_type)) {
      return new Response(
        JSON.stringify({ 
          canUpload: true, 
          uploadsRemaining: null, // Unlimited
          isPaidUser: true
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Count the user's uploads for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count, error: countError } = await supabase
      .from("food_uploads")
      .select('*', { count: 'exact', head: true })
      .eq("user_id", user.id)
      .gte("created_at", today.toISOString());

    if (countError) {
      return new Response(
        JSON.stringify({ error: "Failed to check upload count" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Free users can upload 2 images per day
    const dailyLimit = 2;
    const uploadsRemaining = Math.max(0, dailyLimit - (count || 0));

    return new Response(
      JSON.stringify({ 
        canUpload: uploadsRemaining > 0,
        uploadsRemaining,
        isPaidUser: false
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error checking upload limit:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
