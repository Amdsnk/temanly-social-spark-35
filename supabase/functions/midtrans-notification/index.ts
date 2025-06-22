
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
    const notification = await req.json();
    console.log('Midtrans notification received:', notification);

    // Get Midtrans Server Key from Supabase secrets
    const serverKey = Deno.env.get("MIDTRANS_SERVER_KEY");
    if (!serverKey) {
      throw new Error("Midtrans Server Key not configured");
    }

    // Verify notification signature
    const { order_id, status_code, gross_amount, signature_key } = notification;
    const expectedSignature = await crypto.subtle.digest(
      'SHA-512',
      new TextEncoder().encode(`${order_id}${status_code}${gross_amount}${serverKey}`)
    );
    const expectedSignatureHex = Array.from(new Uint8Array(expectedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (signature_key !== expectedSignatureHex) {
      throw new Error("Invalid signature");
    }

    // Create Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Update transaction status based on Midtrans notification
    let newStatus = 'pending';
    switch (notification.transaction_status) {
      case 'capture':
      case 'settlement':
        newStatus = 'paid';
        break;
      case 'pending':
        newStatus = 'pending';
        break;
      case 'deny':
      case 'cancel':
      case 'expire':
        newStatus = 'failed';
        break;
      case 'refund':
        newStatus = 'refunded';
        break;
    }

    // Update transaction in database
    const { error: updateError } = await supabaseAdmin
      .from('transactions')
      .update({ 
        status: newStatus,
        midtrans_response: notification,
        updated_at: new Date().toISOString()
      })
      .eq('id', order_id);

    if (updateError) {
      console.error('Error updating transaction:', updateError);
      throw updateError;
    }

    // If payment is successful, create booking record
    if (newStatus === 'paid') {
      const { data: transaction } = await supabaseAdmin
        .from('transactions')
        .select('*')
        .eq('id', order_id)
        .single();

      if (transaction?.booking_data) {
        await supabaseAdmin
          .from('bookings')
          .insert({
            user_id: 'temp-user-id', // Will be updated with actual user ID
            companion_id: 'temp-companion-id', // Will be updated with actual companion ID
            service: transaction.booking_data.service,
            booking_date: transaction.booking_data.date,
            booking_time: transaction.booking_data.time,
            message: transaction.booking_data.message,
            total_price: transaction.amount,
            payment_status: 'paid',
            status: 'confirmed',
            created_at: new Date().toISOString(),
          });
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error processing Midtrans notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
