
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log('Create payment function called');
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    console.log('Request body received:', requestBody);
    
    const { booking_data, amount } = requestBody;
    
    if (!booking_data || !amount) {
      throw new Error("Missing required fields: booking_data or amount");
    }
    
    // Get Midtrans Server Key from Supabase secrets
    const serverKey = Deno.env.get("MIDTRANS_SERVER_KEY");
    console.log('Midtrans server key status:', serverKey ? 'Present' : 'Missing');
    
    if (!serverKey) {
      throw new Error("Midtrans Server Key not configured in Supabase secrets");
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    console.log('Supabase URL status:', supabaseUrl ? 'Present' : 'Missing');
    console.log('Supabase Service Key status:', supabaseServiceKey ? 'Present' : 'Missing');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase configuration missing");
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Generate unique order ID
    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log('Generated order ID:', orderId);

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
          id: booking_data.service || 'service',
          price: amount,
          quantity: 1,
          name: `${booking_data.service || 'Service'} with ${booking_data.talent || 'Talent'}`,
        },
      ],
      customer_details: {
        first_name: "Customer",
        email: "customer@example.com",
      },
    };

    console.log('Midtrans parameter:', JSON.stringify(parameter, null, 2));

    // Create transaction to Midtrans
    console.log('Calling Midtrans API...');
    const midtransResponse = await fetch('https://app.midtrans.com/snap/v1/transactions', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(serverKey + ':')}`,
      },
      body: JSON.stringify(parameter),
    });

    console.log('Midtrans response status:', midtransResponse.status);

    if (!midtransResponse.ok) {
      const errorText = await midtransResponse.text();
      console.error('Midtrans API Error Response:', errorText);
      throw new Error(`Midtrans API Error (${midtransResponse.status}): ${errorText}`);
    }

    const midtransData = await midtransResponse.json();
    console.log('Midtrans success response:', midtransData);

    // Save pending transaction to database
    console.log('Saving transaction to database...');
    const { error: dbError } = await supabaseAdmin
      .from('transactions')
      .insert({
        id: orderId,
        amount: amount,
        service: booking_data.service || 'Unknown Service',
        payment_method: 'midtrans',
        status: 'pending',
        booking_data: booking_data,
        midtrans_token: midtransData.token,
        created_at: new Date().toISOString(),
      });

    if (dbError) {
      console.error('Database error:', dbError);
      // Don't throw here, as the Midtrans token is already created
      console.log('Continuing despite database error...');
    } else {
      console.log('Transaction saved to database successfully');
    }

    const responseData = { 
      token: midtransData.token,
      redirect_url: midtransData.redirect_url,
      order_id: orderId
    };
    
    console.log('Returning response:', responseData);

    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error in create-payment function:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error message:', errorMessage);
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: 'Check function logs for more information'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
