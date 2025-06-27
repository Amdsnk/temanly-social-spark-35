
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

serve(async (req) => {
  console.log('Admin get users function called with method:', req.method)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    console.log('Environment check:', {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!serviceRoleKey,
      url: supabaseUrl
    })
    
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing environment variables')
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Missing environment variables',
          users: [],
          count: 0
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create admin client
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Parse request body
    let body = {}
    if (req.method === 'POST') {
      try {
        const text = await req.text()
        if (text) {
          body = JSON.parse(text)
        }
      } catch (e) {
        console.log('No valid JSON body, using defaults')
      }
    }
    
    const { userType, verificationStatus } = body as any

    console.log('Fetching users with filters:', { userType, verificationStatus })

    // Build query
    let query = supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters
    if (userType && userType !== 'all') {
      query = query.eq('user_type', userType)
    }

    if (verificationStatus && verificationStatus !== 'all') {
      query = query.eq('verification_status', verificationStatus)
    }

    console.log('Executing query...')
    const { data, error } = await query

    if (error) {
      console.error('Database query error:', error)
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `Database error: ${error.message}`,
          users: [],
          count: 0
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Successfully fetched ${data?.length || 0} users`)
    console.log('Sample data:', data?.slice(0, 2))

    return new Response(
      JSON.stringify({ 
        success: true, 
        users: data || [],
        count: data?.length || 0,
        message: `Successfully fetched ${data?.length || 0} users`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Function execution error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: `Function error: ${error.message}`,
        users: [],
        count: 0
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
