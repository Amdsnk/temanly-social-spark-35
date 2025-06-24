
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, Mail } from 'lucide-react';
import MainHeader from '@/components/MainHeader';

const SignupSuccess = () => {
  const location = useLocation();
  const { email, name, message } = location.state || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <MainHeader />
      
      <div className="flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-600">Pendaftaran Berhasil!</CardTitle>
            </CardHeader>
            
            <CardContent className="text-center space-y-6">
              <div className="space-y-2">
                <p className="text-gray-600">
                  Halo <strong>{name}</strong>!
                </p>
                <p className="text-gray-600">
                  {message || 'Akun Anda telah berhasil dibuat dan menunggu verifikasi dari admin.'}
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-800 mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">Status: Menunggu Verifikasi</span>
                </div>
                <p className="text-sm text-yellow-700">
                  Tim admin kami akan meninjau pendaftaran Anda dalam 1-2 hari kerja. 
                  Anda akan menerima notifikasi email di <strong>{email}</strong> setelah akun diverifikasi.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-800 mb-2">
                  <Mail className="w-4 h-4" />
                  <span className="font-medium">Langkah Selanjutnya</span>
                </div>
                <ul className="text-sm text-blue-700 text-left space-y-1">
                  <li>• Periksa email untuk konfirmasi pendaftaran</li>
                  <li>• Tunggu notifikasi persetujuan dari admin</li>
                  <li>• Login setelah akun diverifikasi</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Link to="/login">
                  <Button className="w-full bg-blue-500 hover:bg-blue-600">
                    Coba Login Sekarang
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" className="w-full">
                    Kembali ke Beranda
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignupSuccess;
