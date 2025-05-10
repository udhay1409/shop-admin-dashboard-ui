
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export async function handler(req: Request) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Get the service role key from environment variable
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing environment variables SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }

    // Initialize Supabase client with the service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { email, password } = await req.json();
    
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // Check if user exists
    const { data: existingUsers, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .limit(1);
      
    if (checkError) {
      console.error('Error checking existing user:', checkError);
      throw new Error(`Failed to check existing user: ${checkError.message}`);
    }
      
    // If user doesn't exist, create it
    if (!existingUsers?.length) {
      // Create user with email confirmation already done
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          first_name: 'Admin',
          last_name: 'User'
        }
      });
      
      if (userError) {
        console.error('Error creating admin user:', userError);
        throw new Error(`Failed to create admin user: ${userError.message}`);
      }
      
      // Add admin role
      if (userData?.user) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userData.user.id,
            role: 'admin'
          });
          
        if (roleError) {
          console.error('Error setting admin role:', roleError);
          throw new Error(`Failed to set admin role: ${roleError.message}`);
        }
        
        console.log(`Admin user ${email} created successfully`);
        
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Admin user created successfully',
          user: userData.user.id 
        }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
    } else {
      // User exists, check if they already have admin role
      const userId = existingUsers[0].id;
      const { data: existingRole, error: roleCheckError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .limit(1);
        
      if (roleCheckError) {
        console.error('Error checking admin role:', roleCheckError);
        throw new Error(`Failed to check admin role: ${roleCheckError.message}`);
      }
      
      // If user doesn't have admin role, add it
      if (!existingRole?.length) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: 'admin'
          });
          
        if (roleError) {
          console.error('Error setting admin role:', roleError);
          throw new Error(`Failed to set admin role: ${roleError.message}`);
        }
        
        console.log(`User ${email} granted admin role successfully`);
        
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'User granted admin role successfully',
          user: userId
        }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
      
      console.log(`User ${email} is already an admin`);
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'User is already an admin',
        user: userId
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    
    // This should never happen but just in case
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Unknown error occurred' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    console.error('Error in create-admin function:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}

Deno.serve(handler);
