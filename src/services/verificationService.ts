
import { supabase } from '@/integrations/supabase/client';

export interface VerificationRequest {
  email?: string;
  phone?: string;
  type: 'email' | 'whatsapp';
}

export const sendEmailVerification = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    // Use Supabase edge function to send verification email
    const { data, error } = await supabase.functions.invoke('send-verification-email', {
      body: { 
        email,
        type: 'signup_verification'
      }
    });

    if (error) throw error;

    return {
      success: true,
      message: `Email verifikasi telah dikirim ke ${email}`
    };
  } catch (error) {
    console.error('Email verification error:', error);
    return {
      success: false,
      message: 'Gagal mengirim email verifikasi'
    };
  }
};

export const sendWhatsAppVerification = async (phone: string): Promise<{ success: boolean; message: string; code?: string }> => {
  try {
    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store verification code in database
    const { error: dbError } = await supabase
      .from('verification_codes')
      .insert({
        phone,
        code: verificationCode,
        type: 'whatsapp',
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
        created_at: new Date().toISOString()
      });

    if (dbError) throw dbError;

    // Use Supabase edge function to send WhatsApp message
    const { data, error } = await supabase.functions.invoke('send-whatsapp-verification', {
      body: { 
        phone,
        code: verificationCode
      }
    });

    if (error) {
      console.warn('WhatsApp service unavailable, using fallback');
      // For demo purposes, return the code so user can see it
      return {
        success: true,
        message: `Kode verifikasi WhatsApp: ${verificationCode} (Demo mode - kode ditampilkan di sini)`,
        code: verificationCode
      };
    }

    return {
      success: true,
      message: `Kode verifikasi telah dikirim via WhatsApp ke ${phone}`
    };
  } catch (error) {
    console.error('WhatsApp verification error:', error);
    return {
      success: false,
      message: 'Gagal mengirim kode verifikasi WhatsApp'
    };
  }
};

export const verifyWhatsAppCode = async (phone: string, code: string): Promise<{ success: boolean; message: string }> => {
  try {
    const { data, error } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('phone', phone)
      .eq('code', code)
      .eq('type', 'whatsapp')
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !data) {
      return {
        success: false,
        message: 'Kode verifikasi tidak valid atau sudah kedaluwarsa'
      };
    }

    // Mark code as used
    await supabase
      .from('verification_codes')
      .update({ used_at: new Date().toISOString() })
      .eq('id', data.id);

    return {
      success: true,
      message: 'Nomor WhatsApp berhasil diverifikasi'
    };
  } catch (error) {
    console.error('WhatsApp code verification error:', error);
    return {
      success: false,
      message: 'Gagal memverifikasi kode WhatsApp'
    };
  }
};

export const verifyEmailToken = async (email: string, token: string): Promise<{ success: boolean; message: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('verify-email-token', {
      body: { 
        email,
        token
      }
    });

    if (error) throw error;

    return {
      success: true,
      message: 'Email berhasil diverifikasi'
    };
  } catch (error) {
    console.error('Email token verification error:', error);
    return {
      success: false,
      message: 'Token verifikasi email tidak valid'
    };
  }
};
