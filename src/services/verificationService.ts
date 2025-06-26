
import { sendEmailVerificationDirect, verifyEmailTokenDirect } from './emailService';
import { supabase } from '@/integrations/supabase/client';

export interface VerificationRequest {
  email?: string;
  phone?: string;
  type: 'email' | 'whatsapp';
}

export const sendEmailVerification = async (email: string): Promise<{ success: boolean; message: string; token?: string }> => {
  try {
    console.log('Sending email verification to:', email);
    
    // Use direct EmailJS service
    const result = await sendEmailVerificationDirect(email);
    
    console.log('Email verification result:', result);
    
    return result;

  } catch (error) {
    console.error('Email verification error:', error);
    
    return {
      success: false,
      message: 'Gagal mengirim email verifikasi. Silakan coba lagi.'
    };
  }
};

export const sendWhatsAppVerification = async (phone: string): Promise<{ success: boolean; message: string; code?: string }> => {
  try {
    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    console.log('Sending WhatsApp verification to:', phone);
    
    // Call Supabase edge function for WhatsApp
    const { data, error } = await supabase.functions.invoke('send-whatsapp-verification', {
      body: {
        phone: phone,
        code: verificationCode
      }
    });

    if (error) {
      console.error('WhatsApp verification error:', error);
      // Fallback to returning the code for development
      return {
        success: true,
        message: `Kode verifikasi WhatsApp: ${verificationCode}`,
        code: verificationCode
      };
    }

    console.log('WhatsApp verification result:', data);
    
    return {
      success: data.success,
      message: data.message,
      code: data.code || verificationCode
    };
  } catch (error) {
    console.error('WhatsApp verification error:', error);
    
    // Provide fallback
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    return {
      success: true,
      message: `Kode verifikasi WhatsApp: ${verificationCode}`,
      code: verificationCode
    };
  }
};

export const verifyWhatsAppCode = async (phone: string, code: string, expectedCode: string): Promise<{ success: boolean; message: string }> => {
  try {
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
    return await verifyEmailTokenDirect(email, token);
  } catch (error) {
    console.error('Email token verification error:', error);
    return {
      success: false,
      message: 'Token verifikasi email tidak valid'
    };
  }
};
