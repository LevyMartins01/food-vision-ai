
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

  console.log("Webhook processing started");

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
        const { user_id, plan_type } = session.metadata || {};
        
        console.log(`Checkout session completed. User ID: ${user_id}, Plan: ${plan_type}`);
        
        if (user_id) {
          // Validate plan_type is one of the expected values
          const validPlanType = plan_type === "monthly" || plan_type === "annual" ? plan_type : "monthly";
          
          console.log(`Updating subscription for user ${user_id} to ${validPlanType} plan`);
          
          // Update user's subscription in the database
          await supabase
            .from("subscriptions")
            .update({
              stripe_subscription_id: session.subscription,
              plan_type: validPlanType,
              is_active: true,
              start_date: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq("user_id", user_id);

          console.log(`Updated subscription for user ${user_id} to ${validPlanType}`);
        } else {
          console.log("No user_id found in session metadata");
        }
        break;
      }
      
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        console.log(`Subscription updated for customer ${customerId}`);
        
        // Get the user_id from the customer
        const { data: userData } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .single();
          
        if (userData) {
          // Update subscription status
          console.log(`Found user ${userData.user_id} for customer ${customerId}`);
          
          await supabase
            .from("subscriptions")
            .update({
              is_active: subscription.status === "active",
              updated_at: new Date().toISOString()
            })
            .eq("user_id", userData.user_id);
            
          console.log(`Updated subscription status for user ${userData.user_id} to ${subscription.status}`);
        } else {
          console.log(`No user found for customer ${customerId}`);
        }
        break;
      }
      
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        console.log(`Subscription deleted for customer ${customerId}`);
        
        // Get the user_id from the customer
        const { data: userData } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .single();
          
        if (userData) {
          console.log(`Found user ${userData.user_id} for customer ${customerId}`);
          
          // Update subscription to free plan
          await supabase
            .from("subscriptions")
            .update({
              plan_type: "free",
              is_active: false,
              stripe_subscription_id: null,
              updated_at: new Date().toISOString()
            })
            .eq("user_id", userData.user_id);
            
          console.log(`Reset subscription to free plan for user ${userData.user_id}`);
        } else {
          console.log(`No user found for customer ${customerId}`);
        }
        break;
      }

      case "payment_intent.succeeded": {
        // In case of direct payment (non-subscription), update the user's status
        const paymentIntent = event.data.object;
        const customerId = paymentIntent.customer;
        
        if (customerId) {
          console.log(`Payment succeeded for customer ${customerId}`);
          
          // Find user associated with this customer
          const { data: userData } = await supabase
            .from("subscriptions")
            .select("user_id")
            .eq("stripe_customer_id", customerId)
            .single();
            
          if (userData) {
            console.log(`Found user ${userData.user_id} for customer ${customerId}`);
            
            // Activate the user's subscription
            await supabase
              .from("subscriptions")
              .update({
                is_active: true,
                updated_at: new Date().toISOString()
              })
              .eq("user_id", userData.user_id);
              
            console.log(`Payment succeeded for user ${userData.user_id}`);
          } else {
            console.log(`No user found for customer ${customerId}`);
          }
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
