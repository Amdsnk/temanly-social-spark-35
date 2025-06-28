
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Adding KTP and additional user data columns to profiles table...')

    // Add missing columns to profiles table
    const { error: alterError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        -- Add KTP and additional user data columns if they don't exist
        DO $$ 
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'ktp_number') THEN
            ALTER TABLE profiles ADD COLUMN ktp_number VARCHAR(255);
          END IF;
          
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'ktp_image') THEN
            ALTER TABLE profiles ADD COLUMN ktp_image TEXT;
          END IF;
          
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'rejection_reason') THEN
            ALTER TABLE profiles ADD COLUMN rejection_reason TEXT;
          END IF;
        END $$;
      `
    })

    if (alterError) {
      console.error('Error adding columns:', alterError)
      throw alterError
    }

    console.log('Schema updated successfully')

    return new Response(
      JSON.stringify({ success: true, message: 'Schema updated successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
