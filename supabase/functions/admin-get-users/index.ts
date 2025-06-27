
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the service role key (bypasses RLS)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the request body to check for filters
    const body = await req.json().catch(() => ({}))
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
      console.error('Error fetching users:', error)
      throw error
    }

    console.log(`Successfully fetched ${data?.length || 0} users`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        users: data || [],
        count: data?.length || 0
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
        error: error.message,
        success: false 
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
