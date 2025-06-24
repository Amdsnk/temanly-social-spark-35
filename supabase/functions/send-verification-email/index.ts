
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
    const verificationToken = crypto.randomUUID();

    // For demo purposes, we'll just log the verification email
    // In production, you would integrate with an email service like Resend, SendGrid, etc.
    const emailContent = {
      to: email,
      subject: "Verifikasi Email Temanly",
      html: getVerificationEmailTemplate(email, verificationToken)
    };

    console.log('Verification email would be sent:', emailContent);

    // Here you would integrate with your email service
    // Example with Resend (uncomment and add RESEND_API_KEY to secrets):
    /*
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "noreply@temanly.com",
          to: email,
          subject: emailContent.subject,
          html: emailContent.html,
        }),
      });

      if (!response.ok) {
        throw new Error(`Email service error: ${response.statusText}`);
      }
    }
    */

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Verification email sent successfully",
        token: verificationToken // In demo mode, return token for testing
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error sending verification email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});

function getVerificationEmailTemplate(email: string, token: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verifikasi Email Temanly</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #e91e63;">Temanly</h1>
        </div>
        
        <h2 style="color: #4caf50;">Verifikasi Email Anda</h2>
        
        <p>Halo,</p>
        
        <p>Terima kasih telah mendaftar di Temanly. Untuk melanjutkan proses pendaftaran, silakan verifikasi email Anda dengan mengklik tombol di bawah ini:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" onclick="alert('Token verifikasi: ${token}')" style="background: #e91e63; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Verifikasi Email
          </a>
        </div>
        
        <p style="font-size: 12px; color: #666;">
          Atau salin kode verifikasi ini: <strong>${token}</strong>
        </p>
        
        <p>Jika Anda tidak mendaftar di Temanly, abaikan email ini.</p>
        
        <p>Salam hangat,<br>Tim Temanly</p>
        
        <hr style="margin: 30px 0;">
        <p style="font-size: 12px; color: #666;">
          Email ini dikirim secara otomatis. Mohon tidak membalas email ini.
        </p>
      </div>
    </body>
    </html>
  `;
}
