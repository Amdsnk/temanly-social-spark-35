
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
    const { email, type } = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    // Generate verification token
    const verificationToken = crypto.randomUUID().replace(/-/g, '').substring(0, 8).toUpperCase();

    // EmailJS credentials - using your provided values
    const emailjsServiceId = "service_l21gt56";
    const emailjsTemplateId = "template_vnxelok";
    const emailjsPublicKey = "vBw5YkSScmsVPjq24";
    const emailjsPrivateKey = "r6NoH8wv1QtFRvJX6Gy9B";

    console.log('EmailJS verification request:', { 
      email, 
      type, 
      verificationToken,
      serviceId: emailjsServiceId
    });

    // Send email using EmailJS
    const emailPayload = {
      service_id: emailjsServiceId,
      template_id: emailjsTemplateId,
      user_id: emailjsPublicKey,
      accessToken: emailjsPrivateKey,
      template_params: {
        to_email: email,
        to_name: email.split('@')[0],
        verification_code: verificationToken,
        app_name: "Temanly",
        message: `Kode verifikasi Anda: ${verificationToken}. Kode berlaku selama 15 menit.`,
        subject: "Verifikasi Email Temanly"
      }
    };

    console.log('Sending to EmailJS with payload:', JSON.stringify(emailPayload, null, 2));

    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    const responseText = await response.text();
    console.log('EmailJS API response:', { 
      status: response.status, 
      statusText: response.statusText,
      body: responseText 
    });

    if (!response.ok) {
      console.error('EmailJS API error:', {
        status: response.status,
        statusText: response.statusText,
        body: responseText
      });
      throw new Error(`EmailJS error: ${response.status} - ${responseText}`);
    }

    console.log('Email sent successfully via EmailJS');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email verifikasi telah dikirim",
        token: verificationToken,
        provider: "emailjs"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error in send-email-emailjs function:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        message: "Gagal mengirim email verifikasi"
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
