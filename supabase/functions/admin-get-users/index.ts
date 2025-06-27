
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

serve(async (req) => {
  console.log('Admin get users function called:', req.method)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Validate environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing environment variables:', { supabaseUrl: !!supabaseUrl, serviceRoleKey: !!serviceRoleKey })
      throw new Error('Missing required environment variables')
    }

    // Create a Supabase client with the service role key (bypasses RLS)
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

    // Get the request body to check for filters
    let body = {}
    try {
      body = await req.json()
    } catch (e) {
      console.log('No JSON body provided, using empty object')
    }
    
    const { userType, verificationStatus } = body

    console.log('Admin fetching users with filters:', { userType, verificationStatus })

    // Build query with admin privileges (bypasses RLS)
    let query = supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters if provided
    if (userType && userType !== 'all') {
      query = query.eq('user_type', userType)
    }

    if (verificationStatus && verificationStatus !== 'all') {
      query = query.eq('verification_status', verificationStatus)
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    console.log(`Successfully fetched ${data?.length || 0} users`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        users: data || [],
        count: data?.length || 0,
        message: 'Users fetched successfully'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Unknown error occurred',
        users: [],
        count: 0
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
