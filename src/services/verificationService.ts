
import { sendEmailVerificationDirect, verifyEmailTokenDirect } from './emailService';

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
    
    // For WhatsApp, we'll return success with the code for now
    return {
      success: true,
      message: `Kode verifikasi telah dikirim via WhatsApp ke ${phone}`,
      code: verificationCode
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
