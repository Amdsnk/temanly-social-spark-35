
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, code } = await req.json();

    if (!phone || !code) {
      throw new Error("Phone number and code are required");
    }

    // Format phone number (remove leading 0 and add +62 for Indonesia)
    let formattedPhone = phone;
    if (phone.startsWith('0')) {
      formattedPhone = '62' + phone.slice(1);
    } else if (phone.startsWith('+62')) {
      formattedPhone = phone.slice(1);
    } else if (!phone.startsWith('62')) {
      formattedPhone = '62' + phone;
    }

    const message = `Kode verifikasi Temanly Anda: ${code}\n\nJangan bagikan kode ini kepada siapa pun.\n\nKode berlaku selama 10 menit.`;

    // Get TextMeBot API key from environment variables
    const textmebotApiKey = Deno.env.get("TEXTMEBOT_API_KEY");

    console.log('WhatsApp verification request:', { 
      phone: formattedPhone, 
      code,
      hasTextMeBotApiKey: !!textmebotApiKey
    });

    if (!textmebotApiKey) {
      console.error('TEXTMEBOT_API_KEY not found in environment variables');
      throw new Error("TextMeBot API key tidak dikonfigurasi");
    }

    // TextMeBot API endpoint
    const encodedMessage = encodeURIComponent(message);
    const textmebotUrl = `https://api.textmebot.com/send.php?recipient=${formattedPhone}&apikey=${textmebotApiKey}&text=${encodedMessage}`;

    console.log('Sending to TextMeBot:', { recipient: formattedPhone, hasApiKey: !!textmebotApiKey });

    const response = await fetch(textmebotUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    const responseText = await response.text();
    console.log('TextMeBot API response:', { 
      status: response.status, 
      body: responseText 
    });

    if (!response.ok) {
      console.error('TextMeBot API error:', responseText);
      throw new Error(`WhatsApp service error: ${response.status} - ${responseText}`);
    }

    // Parse response to check if it's successful
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      // If response is not JSON, treat as success if status is OK
      responseData = { status: 'sent', message: responseText };
    }

    console.log('WhatsApp message sent successfully via TextMeBot');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Kode verifikasi telah dikirim via WhatsApp ke ${phone}`,
        code: code,
        provider: "textmebot",
        response: responseData
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error sending WhatsApp verification:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        message: "Gagal mengirim kode WhatsApp"
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
