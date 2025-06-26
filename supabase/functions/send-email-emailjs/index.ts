
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

    // Get EmailJS credentials
    const emailjsServiceId = Deno.env.get("EMAILJS_SERVICE_ID");
    const emailjsTemplateId = Deno.env.get("EMAILJS_TEMPLATE_ID");
    const emailjsPublicKey = Deno.env.get("EMAILJS_PUBLIC_KEY");
    const emailjsPrivateKey = Deno.env.get("EMAILJS_PRIVATE_KEY");

    console.log('EmailJS verification request:', { 
      email, 
      type, 
      hasEmailJSCredentials: !!(emailjsServiceId && emailjsTemplateId && emailjsPublicKey)
    });

    if (emailjsServiceId && emailjsTemplateId && emailjsPublicKey) {
      try {
        // Send email using EmailJS
        const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            service_id: emailjsServiceId,
            template_id: emailjsTemplateId,
            user_id: emailjsPublicKey,
            accessToken: emailjsPrivateKey,
            template_params: {
              to_email: email,
              to_name: email.split('@')[0],
              verification_code: verificationToken,
              app_name: "Temanly",
              message: `Kode verifikasi Anda: ${verificationToken}. Kode berlaku selama 15 menit.`
            }
          }),
        });

        const responseText = await response.text();
        console.log('EmailJS API response:', { status: response.status, body: responseText });

        if (!response.ok) {
          console.error('EmailJS API error:', responseText);
          throw new Error(`Email service error: ${response.status} - ${responseText}`);
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
      } catch (emailError) {
        console.error('EmailJS sending failed:', emailError);
        
        // Return fallback for development
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `Development fallback: Kode verifikasi email: ${verificationToken}`,
            token: verificationToken,
            provider: "development"
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else {
      console.log('No EmailJS credentials found, using development mode');
      
      // Development mode
      console.log('DEVELOPMENT MODE - Email would be sent:', {
        to: email,
        token: verificationToken
      });

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Development mode: Kode verifikasi email: ${verificationToken}`,
          token: verificationToken,
          provider: "development"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

  } catch (error) {
    console.error('Error sending verification email:', error);
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
