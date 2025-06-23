
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
    const { booking_data, amount, order_id } = await req.json();
    
    if (!booking_data || !amount) {
      throw new Error("Missing required fields: booking_data or amount");
    }
    
    // Get Midtrans Server Key from Supabase secrets
    const serverKey = Deno.env.get("MIDTRANS_SERVER_KEY");
    
    if (!serverKey) {
      throw new Error("Midtrans Server Key not configured in Supabase secrets");
    }

    // Generate order ID if not provided
    const finalOrderId = order_id || `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Prepare Midtrans transaction parameters
    const parameter = {
      transaction_details: {
        order_id: finalOrderId,
        gross_amount: amount,
      },
      credit_card: {
        secure: true,
      },
      item_details: [
        {
          id: booking_data.service?.toLowerCase().replace(' ', '_') || 'service',
          price: amount,
          quantity: 1,
          name: `${booking_data.service || 'Service'} with ${booking_data.talent || 'Talent'}`,
        },
      ],
      customer_details: {
        first_name: "Customer",
        email: "customer@example.com",
        phone: "+628123456789",
      },
      // Enable all payment methods
      enabled_payments: [
        "credit_card", "bca_va", "bni_va", "bri_va", "echannel", "permata_va",
        "other_va", "gopay", "shopeepay", "dana", "ovo", "linkaja", "jenius",
        "cstore", "alfamart", "qris"
      ],
    };

    console.log('Creating Midtrans transaction with parameter:', JSON.stringify(parameter, null, 2));

    // Create transaction to Midtrans Snap API
    const midtransResponse = await fetch('https://app.midtrans.com/snap/v1/transactions', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(serverKey + ':')}`,
      },
      body: JSON.stringify(parameter),
    });

    if (!midtransResponse.ok) {
      const errorText = await midtransResponse.text();
      console.error('Midtrans API Error:', errorText);
      throw new Error(`Midtrans API Error (${midtransResponse.status}): ${errorText}`);
    }

    const midtransData = await midtransResponse.json();
    console.log('Midtrans response:', midtransData);

    // Create Supabase client for saving transaction
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (supabaseUrl && supabaseServiceKey) {
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false }
      });

      // Save pending transaction to database
      await supabaseAdmin
        .from('transactions')
        .insert({
          id: finalOrderId,
          amount: amount,
          service: booking_data.service || 'Unknown Service',
          payment_method: 'midtrans',
          status: 'pending',
          booking_data: booking_data,
          midtrans_token: midtransData.token,
          created_at: new Date().toISOString(),
        });
    }

    return new Response(
      JSON.stringify({ 
        token: midtransData.token,
        redirect_url: midtransData.redirect_url,
        order_id: finalOrderId
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error in create-payment function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: 'Check function logs for more information'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
