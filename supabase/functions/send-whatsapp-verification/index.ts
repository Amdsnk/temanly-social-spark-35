
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
    const textmebotApiUrl = Deno.env.get("TEXTMEBOT_API_URL");
    const textmebotApiKey = Deno.env.get("TEXTMEBOT_API_KEY");

    console.log('WhatsApp verification request:', { 
      phone: formattedPhone, 
      code,
      hasTextMeBotCredentials: !!(textmebotApiUrl && textmebotApiKey),
      textmebotUrl: textmebotApiUrl ? 'configured' : 'missing',
      textmebotKey: textmebotApiKey ? 'configured' : 'missing'
    });

    if (textmebotApiUrl && textmebotApiKey) {
      try {
        // Send WhatsApp message using TextMeBot
        const textmebotPayload = {
          phone: `+${formattedPhone}`,
          message: message,
          type: "text" // Tambahan parameter yang mungkin diperlukan
        };

        console.log('Sending to TextMeBot:', { 
          url: textmebotApiUrl,
          payload: textmebotPayload 
        });

        const response = await fetch(`${textmebotApiUrl}/send-message`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${textmebotApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(textmebotPayload),
        });

        const responseData = await response.json();
        console.log('TextMeBot API response:', { 
          status: response.status, 
          data: responseData 
        });

        if (!response.ok) {
          console.error('TextMeBot API error:', responseData);
          throw new Error(`WhatsApp service error: ${response.status} - ${JSON.stringify(responseData)}`);
        }

        console.log('WhatsApp message sent successfully via TextMeBot:', responseData);

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `Kode verifikasi telah dikirim via WhatsApp ke ${phone}`,
            provider: "textmebot",
            details: responseData
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
      console.log('Missing TextMeBot credentials, using development mode');
      console.log('Required environment variables:');
      console.log('- TEXTMEBOT_API_URL:', textmebotApiUrl ? 'SET' : 'MISSING');
      console.log('- TEXTMEBOT_API_KEY:', textmebotApiKey ? 'SET' : 'MISSING');
      
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
          note: "Tambahkan TEXTMEBOT_API_URL dan TEXTMEBOT_API_KEY ke Supabase Environment Variables"
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
