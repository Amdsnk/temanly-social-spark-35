
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
    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { userId, email, name, phone, userType, comprehensiveData } = await req.json()

    console.log('Creating comprehensive talent profile for user:', userId)
    console.log('Comprehensive data received:', comprehensiveData)

    // Insert the comprehensive profile with admin privileges (bypasses RLS)
    const profileData = {
      id: userId,
      email: email,
      name: name,
      full_name: name,
      phone: phone,
      user_type: userType,
      verification_status: 'pending',
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // Add comprehensive talent data
      age: comprehensiveData?.age,
      location: comprehensiveData?.location,
      bio: comprehensiveData?.bio,
      hourly_rate: comprehensiveData?.hourlyRate,
      // Store services data for admin review
      profile_data: JSON.stringify({
        services: comprehensiveData?.services || [],
        experienceYears: comprehensiveData?.experienceYears || 0,
        availability: comprehensiveData?.availability || [],
        languages: comprehensiveData?.languages || [],
        specialties: comprehensiveData?.specialties || [],
        transportationMode: comprehensiveData?.transportationMode || '',
        emergencyContact: comprehensiveData?.emergencyContact || '',
        emergencyPhone: comprehensiveData?.emergencyPhone || '',
        hasIdCard: comprehensiveData?.hasIdCard || false,
        hasProfilePhoto: comprehensiveData?.hasProfilePhoto || false,
        registrationTimestamp: new Date().toISOString()
      })
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .insert(profileData)
      .select()
      .single()

    if (error) {
      console.error('Error creating comprehensive talent profile:', error)
      throw error
    }

    console.log('Comprehensive talent profile created successfully:', data)

    // If services are provided, also create entries in talent_services table
    if (comprehensiveData?.services && comprehensiveData.services.length > 0) {
      console.log('Creating talent services entries...')
      
      const talentServices = comprehensiveData.services.map((service: string) => ({
        talent_id: userId,
        service_type: service.toLowerCase().replace(/\s+/g, '_'),
        description: `${service} service by ${name}`,
        custom_rate: comprehensiveData.hourlyRate,
        is_available: true,
        created_at: new Date().toISOString()
      }))

      const { error: servicesError } = await supabaseAdmin
        .from('talent_services')
        .insert(talentServices)

      if (servicesError) {
        console.error('Error creating talent services:', servicesError)
        // Don't throw error here, profile was created successfully
      } else {
        console.log('Talent services created successfully')
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        profile: data,
        message: 'Comprehensive talent profile created successfully'
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
