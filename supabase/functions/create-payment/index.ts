
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
    const { booking_data, amount } = await req.json();
    
    // Get Midtrans Server Key from Supabase secrets
    const serverKey = Deno.env.get("MIDTRANS_SERVER_KEY");
    if (!serverKey) {
      throw new Error("Midtrans Server Key not configured");
    }

    // Create Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Generate unique order ID
    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Prepare Midtrans transaction parameters
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      credit_card: {
        secure: true,
      },
      item_details: [
        {
          id: booking_data.service,
          price: amount,
          quantity: 1,
          name: `${booking_data.service} with ${booking_data.talent}`,
        },
      ],
      customer_details: {
        first_name: "Customer", // Will be updated with actual user data
        email: "customer@example.com", // Will be updated with actual user data
      },
    };

    // Create transaction to Midtrans
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
      const errorData = await midtransResponse.text();
      throw new Error(`Midtrans API Error: ${errorData}`);
    }

    const midtransData = await midtransResponse.json();

    // Save pending transaction to database
    const { error: dbError } = await supabaseAdmin
      .from('transactions')
      .insert({
        id: orderId,
        amount: amount,
        service: booking_data.service,
        payment_method: 'midtrans',
        status: 'pending',
        booking_data: booking_data,
        midtrans_token: midtransData.token,
        created_at: new Date().toISOString(),
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    return new Response(
      JSON.stringify({ 
        token: midtransData.token,
        redirect_url: midtransData.redirect_url,
        order_id: orderId
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error creating payment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
