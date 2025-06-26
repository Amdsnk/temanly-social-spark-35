
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
    const formattedPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone.replace('+', '');

    const message = `Kode verifikasi Temanly Anda: ${code}\n\nJangan bagikan kode ini kepada siapa pun.\n\nKode berlaku selama 10 menit.`;

    // Get TextMeBot API credentials dari environment variables
    const textmebotApiKey = Deno.env.get("TEXTMEBOT_API_KEY");

    console.log('WhatsApp verification request:', { 
      phone: formattedPhone, 
      code,
      hasTextMeBotApiKey: !!textmebotApiKey
    });

    if (textmebotApiKey) {
      try {
        // TextMeBot menggunakan GET request dengan parameter di URL
        const encodedMessage = encodeURIComponent(message);
        const textmebotUrl = `http://api.textmebot.com/send.php?recipient=${formattedPhone}&apikey=${textmebotApiKey}&text=${encodedMessage}`;

        console.log('Sending to TextMeBot URL:', textmebotUrl);

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

        console.log('WhatsApp message sent successfully via TextMeBot:', responseText);

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `Kode verifikasi telah dikirim via WhatsApp ke ${phone}`,
            provider: "textmebot",
            details: responseText
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (whatsappError) {
        console.error('TextMeBot WhatsApp sending failed:', whatsappError);
        
        // For development, return the code in the message
        return new Response(
          JSON.stringify({
            success: true,
            message: `Development fallback: Kode verifikasi WhatsApp: ${code}`,
            code: code,
            provider: "development",
            error: whatsappError.message
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else {
      console.log('Missing TextMeBot API key, using development mode');
      console.log('Required environment variable: TEXTMEBOT_API_KEY');
      
      // Development mode - log the WhatsApp message
      console.log('DEVELOPMENT MODE - WhatsApp message would be sent:', {
        to: `+${formattedPhone}`,
        message: message
      });

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Development mode: Kode WhatsApp untuk testing: ${code}`,
          code: code,
          provider: "development",
          note: "Tambahkan TEXTMEBOT_API_KEY ke Supabase Environment Variables"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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
