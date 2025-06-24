
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
      message: `Kode verifikasi telah dikirim via WhatsApp ke ${phone}`,
      code: verificationCode // Return code for demo purposes
    };
  } catch (error) {
    console.error('WhatsApp verification error:', error);
    return {
      success: false,
      message: 'Gagal mengirim kode verifikasi WhatsApp'
    };
  }
};

export const verifyWhatsAppCode = async (phone: string, code: string, expectedCode: string): Promise<{ success: boolean; message: string }> => {
  try {
    // Simple code verification for demo
    if (code === expectedCode) {
      return {
        success: true,
        message: 'Nomor WhatsApp berhasil diverifikasi'
      };
    } else {
      return {
        success: false,
        message: 'Kode verifikasi tidak valid'
      };
    }
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
