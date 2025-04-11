
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response(
      JSON.stringify({ error: "Missing stripe-signature header" }),
      { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2023-10-16",
  });

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    // Get the raw request body
    const rawBody = await req.text();
    
    // Verify the event using the webhook secret
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );

    console.log(`Received Stripe webhook event: ${event.type}`);

    // Handle the event based on its type
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const { user_id, plan_type } = session.metadata;

        // Update user's subscription in the database
        await supabase
          .from("subscriptions")
          .update({
            stripe_subscription_id: session.subscription,
            plan_type,
            is_active: true,
            start_date: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq("user_id", user_id);

        console.log(`Updated subscription for user ${user_id} to ${plan_type}`);
        break;
      }
      
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        // Get the user_id from the customer
        const { data: userData } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .single();
          
        if (userData) {
          // Update subscription status
          await supabase
            .from("subscriptions")
            .update({
              is_active: subscription.status === "active",
              updated_at: new Date().toISOString()
            })
            .eq("user_id", userData.user_id);
            
          console.log(`Updated subscription status for user ${userData.user_id} to ${subscription.status}`);
        }
        break;
      }
      
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        // Get the user_id from the customer
        const { data: userData } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .single();
          
        if (userData) {
          // Update subscription to free plan
          await supabase
            .from("subscriptions")
            .update({
              plan_type: "free",
              is_active: true,
              stripe_subscription_id: null,
              updated_at: new Date().toISOString()
            })
            .eq("user_id", userData.user_id);
            
          console.log(`Reset subscription to free plan for user ${userData.user_id}`);
        }
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`Error handling webhook: ${error.message}`);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
