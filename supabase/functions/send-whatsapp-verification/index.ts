
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
    const formattedPhone = phone.startsWith('0') ? '+62' + phone.slice(1) : phone;

    const message = `Kode verifikasi Temanly Anda: ${code}\n\nJangan bagikan kode ini kepada siapa pun.\n\nKode berlaku selama 10 menit.`;

    // Get environment variables for WhatsApp service
    const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioWhatsAppNumber = Deno.env.get("TWILIO_WHATSAPP_NUMBER");

    console.log('WhatsApp verification request:', { 
      phone: formattedPhone, 
      code,
      hasTwilioCredentials: !!(twilioAccountSid && twilioAuthToken && twilioWhatsAppNumber),
      twilioWhatsAppNumber: twilioWhatsAppNumber
    });

    if (twilioAccountSid && twilioAuthToken && twilioWhatsAppNumber) {
      try {
        // Send real WhatsApp message using Twilio
        const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`, {
          method: "POST",
          headers: {
            "Authorization": `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            From: `whatsapp:${twilioWhatsAppNumber}`,
            To: `whatsapp:${formattedPhone}`,
            Body: message,
          }),
        });

        const responseText = await response.text();
        console.log('Twilio API response:', { status: response.status, body: responseText });

        if (!response.ok) {
          console.error('Twilio API error:', responseText);
          throw new Error(`WhatsApp service error: ${response.status} - ${responseText}`);
        }

        const result = JSON.parse(responseText);
        console.log('WhatsApp message sent successfully via Twilio:', result);

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `Kode verifikasi telah dikirim via WhatsApp ke ${formattedPhone}`,
            provider: "twilio"
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (whatsappError) {
        console.error('Twilio WhatsApp sending failed:', whatsappError);
        
        // For development, return the code in the message
        return new Response(
          JSON.stringify({
            success: true,
            message: `Development fallback: Kode verifikasi WhatsApp: ${code}`,
            code: code,
            provider: "development"
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else {
      console.log('Missing Twilio credentials, using development mode');
      
      // Development mode - log the WhatsApp message
      console.log('DEVELOPMENT MODE - WhatsApp message would be sent:', {
        to: formattedPhone,
        message: message
      });

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Development mode: Kode WhatsApp untuk testing: ${code}`,
          code: code,
          provider: "development"
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
