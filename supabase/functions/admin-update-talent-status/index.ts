
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { talentId, approved } = await req.json();

    if (!talentId || typeof approved !== 'boolean') {
      throw new Error('Missing required parameters: talentId and approved');
    }

    // Create Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const verificationStatus = approved ? 'verified' : 'rejected';
    const profileStatus = approved ? 'active' : 'suspended';

    console.log(`[AdminUpdateTalentStatus] Processing ${approved ? 'approval' : 'rejection'} for talent:`, talentId);

    // Update the profile with admin privileges
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ 
        verification_status: verificationStatus,
        status: profileStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', talentId)
      .select();

    if (error) {
      console.error('[AdminUpdateTalentStatus] Error updating talent status:', error);
      throw error;
    }

    console.log('[AdminUpdateTalentStatus] Successfully updated talent:', data);

    // Send notification (optional)
    try {
      const notificationResult = await supabaseAdmin.functions.invoke('send-approval-notification', {
        body: { userId: talentId, approved }
      });
      
      if (notificationResult.error) {
        console.warn('[AdminUpdateTalentStatus] Notification failed:', notificationResult.error);
      }
    } catch (notificationError) {
      console.warn('[AdminUpdateTalentStatus] Notification error:', notificationError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Talent ${approved ? 'approved' : 'rejected'} successfully`,
        data: data
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error('[AdminUpdateTalentStatus] Function error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
