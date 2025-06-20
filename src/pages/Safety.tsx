
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, Phone, MessageSquare, CheckCircle, Users } from 'lucide-react';
import Footer from '@/components/Footer';

const Safety = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/a8b92c73-b6d3-423f-9e71-b61f792f8a7a.png" 
                alt="Temanly Logo"
                className="h-10 w-auto"
              />
            </Link>
            <Link to="/">
              <Button variant="ghost">← Kembali ke Beranda</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Panduan Keamanan
          </h1>
          <p className="text-xl text-gray-600">
            Keamanan Anda adalah prioritas utama kami
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Safety Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center p-6">
              <CardHeader>
                <Shield className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <CardTitle className="text-lg">Verifikasi Identitas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Semua anggota diverifikasi dengan ID dan foto untuk memastikan keaslian</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <Users className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <CardTitle className="text-lg">Sistem Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Rating dan review dari pengguna lain membantu membangun kepercayaan</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <Phone className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <CardTitle className="text-lg">Dukungan 24/7</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Tim support kami siap membantu kapan saja jika ada masalah</p>
              </CardContent>
            </Card>
          </div>

          {/* Safety Guidelines */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  Tips Keamanan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Sebelum Bertemu</h4>
                  <ul className="text-green-700 space-y-1 text-sm">
                    <li>• Periksa profil dan rating dengan teliti</li>
                    <li>• Komunikasi melalui platform terlebih dahulu</li>
                    <li>• Pilih tempat pertemuan yang ramai dan aman</li>
                    <li>• Beri tahu teman/keluarga tentang rencana Anda</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Saat Bertemu</h4>
                  <ul className="text-blue-700 space-y-1 text-sm">
                    <li>• Bertemu di tempat umum terlebih dahulu</li>
                    <li>• Percayai insting Anda</li>
                    <li>• Jaga barang pribadi dengan baik</li>
                    <li>• Gunakan transportasi sendiri jika memungkinkan</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  Yang Harus Dihindari
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Tanda Bahaya</h4>
                  <ul className="text-red-700 space-y-1 text-sm">
                    <li>• Meminta informasi pribadi berlebihan</li>
                    <li>• Mendesak untuk bertemu di tempat privat</li>
                    <li>• Perilaku tidak sopan atau agresif</li>
                    <li>• Meminta uang atau bantuan keuangan</li>
                  </ul>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Jangan Pernah</h4>
                  <ul className="text-yellow-700 space-y-1 text-sm">
                    <li>• Berikan informasi finansial</li>
                    <li>• Bertemu di rumah pada pertemuan pertama</li>
                    <li>• Abaikan perasaan tidak nyaman</li>
                    <li>• Lanjutkan jika ada tanda-tanda bahaya</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Emergency Contact */}
          <Card className="text-center mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Kontak Darurat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-red-50 rounded-lg">
                  <Phone className="w-8 h-8 text-red-500 mx-auto mb-4" />
                  <h4 className="font-semibold text-red-800 mb-2">Hotline Darurat</h4>
                  <p className="text-red-700 text-xl font-bold">+62 123 456 7890</p>
                  <p className="text-red-600 text-sm">24/7 untuk situasi darurat</p>
                </div>
                <div className="p-6 bg-blue-50 rounded-lg">
                  <MessageSquare className="w-8 h-8 text-blue-500 mx-auto mb-4" />
                  <h4 className="font-semibold text-blue-800 mb-2">Live Chat Support</h4>
                  <p className="text-blue-700 text-xl font-bold">support@temanly.com</p>
                  <p className="text-blue-600 text-sm">Respon dalam 1 jam</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reporting */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Laporkan Masalah</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Jika Anda mengalami perilaku yang tidak pantas atau merasa tidak aman, 
                segera laporkan kepada kami. Kami akan menindaklanjuti setiap laporan dengan serius.
              </p>
              <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white">
                Laporkan Masalah
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Safety;
