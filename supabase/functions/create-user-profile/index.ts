
// Supabase Edge Function to create a user profile when a new user signs up
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Create Supabase client with the service role key
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Get the user data from the request
  const userData = await req.json();

  console.log("Received webhook:", JSON.stringify(userData));

  // Create a profile entry
  try {
    // Check if this is a user creation event
    if (userData.type === "INSERT" && userData.table === "auth.users") {
      console.log("Processing new user creation");
      const user = userData.record;

      // Create a profile entry
      const { data, error } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          first_name: user.raw_user_meta_data?.first_name || "",
          last_name: user.raw_user_meta_data?.last_name || "",
          email: user.email,
        });

      if (error) {
        console.error("Error creating user profile:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log("Profile created successfully");

      // Also create a default role for the user
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({
          user_id: user.id,
          role: "customer",
        });

      if (roleError) {
        console.error("Error creating user role:", roleError);
        return new Response(JSON.stringify({ error: roleError.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log("User role created successfully");

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Not a user creation event, no action taken");
  } catch (err) {
    console.error("Error processing webhook:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ message: "No action taken" }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
