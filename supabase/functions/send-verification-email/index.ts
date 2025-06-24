
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

    // Get environment variables for email service
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const fromEmail = Deno.env.get("FROM_EMAIL") || "noreply@temanly.com";

    console.log('Email verification request:', { email, type, hasApiKey: !!resendApiKey });

    if (resendApiKey) {
      // Send real email using Resend
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: email,
          subject: "Verifikasi Email Temanly",
          html: getVerificationEmailTemplate(email, verificationToken),
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Resend API error:', errorData);
        throw new Error(`Email service error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Email sent successfully via Resend:', result);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Email verifikasi telah dikirim",
          token: verificationToken,
          provider: "resend"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // Development mode - log the email content
      console.log('DEVELOPMENT MODE - Email would be sent:', {
        to: email,
        subject: "Verifikasi Email Temanly",
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

function getVerificationEmailTemplate(email: string, token: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verifikasi Email Temanly</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { color: #e91e63; font-size: 24px; font-weight: bold; }
        .verification-code { 
          background: #f8f9fa; 
          border: 2px dashed #e91e63; 
          padding: 20px; 
          text-align: center; 
          margin: 20px 0;
          border-radius: 8px;
        }
        .code { 
          font-size: 24px; 
          font-weight: bold; 
          color: #e91e63; 
          letter-spacing: 3px;
          font-family: monospace;
        }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
        .small { font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🤝 Temanly</div>
        </div>
        
        <h2 style="color: #4caf50;">Verifikasi Email Anda</h2>
        
        <p>Halo,</p>
        
        <p>Terima kasih telah mendaftar di Temanly. Untuk melanjutkan proses pendaftaran, masukkan kode verifikasi berikut di halaman pendaftaran:</p>
        
        <div class="verification-code">
          <div>Kode Verifikasi Anda:</div>
          <div class="code">${token}</div>
        </div>
        
        <p><strong>Petunjuk:</strong></p>
        <ul>
          <li>Masukkan kode di atas pada form verifikasi email</li>
          <li>Kode berlaku selama 15 menit</li>
          <li>Jangan bagikan kode ini kepada siapa pun</li>
        </ul>
        
        <p>Jika Anda tidak mendaftar di Temanly, abaikan email ini.</p>
        
        <p>Salam hangat,<br>Tim Temanly</p>
        
        <div class="footer">
          <p class="small">
            Email ini dikirim secara otomatis. Mohon tidak membalas email ini.<br>
            © 2024 Temanly. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
