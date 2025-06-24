
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Shield, IdCard, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface VerificationRequiredBannerProps {
  userType: 'user' | 'companion';
}

const VerificationRequiredBanner: React.FC<VerificationRequiredBannerProps> = ({ userType }) => {
  return (
    <Card className="border-yellow-200 bg-yellow-50 mb-6">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-800 mb-3">
              ⚠️ Verifikasi Identitas Diperlukan
            </h3>
            
            {userType === 'user' ? (
              <div className="space-y-3">
                <p className="text-sm text-yellow-700">
                  Untuk mengakses layanan <strong>Offline Date</strong> dan <strong>Party Buddy</strong>, 
                  Anda perlu menyelesaikan verifikasi identitas.
                </p>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-yellow-800">Dokumen yang diperlukan:</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="flex items-center gap-2 text-sm text-yellow-700">
                      <IdCard className="w-4 h-4" />
                      KTP/ID Card
                    </div>
                    <div className="flex items-center gap-2 text-sm text-yellow-700">
                      <Mail className="w-4 h-4" />
                      Verifikasi Email
                    </div>
                    <div className="flex items-center gap-2 text-sm text-yellow-700">
                      <Phone className="w-4 h-4" />
                      Verifikasi WhatsApp
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-yellow-600">
                  💡 Tanpa verifikasi, Anda tetap dapat menggunakan layanan Chat, Voice Call, Video Call, dan Rent a Lover.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-yellow-700">
                  <strong>Semua talent wajib melakukan verifikasi identitas</strong> dengan KTP/ID Card 
                  sebelum dapat menerima booking.
                </p>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700 font-medium">
                    ⚠️ Khusus layanan Party Buddy: Hanya untuk talent berusia 21+ tahun
                  </p>
                </div>
                
                <p className="text-xs text-yellow-600">
                  📋 Saat registrasi, Anda dapat memilih layanan yang tersedia, minat/aktivitas, 
                  dan jadwal ketersediaan.
                </p>
              </div>
            )}
            
            <div className="mt-4">
              <Link to={userType === 'user' ? "/user-verification" : "/talent-register"}>
                <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                  <Shield className="w-4 h-4 mr-2" />
                  {userType === 'user' ? 'Lakukan Verifikasi' : 'Daftar Sebagai Talent'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationRequiredBanner;
