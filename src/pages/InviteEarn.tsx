
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2, Users, Gift, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';

const InviteEarn = () => {
  const [referralCode, setReferralCode] = useState('TEMAN123');
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            Ajak & Dapatkan Bonus
          </h1>
          <p className="text-xl text-gray-600">
            Bagikan Temanly dengan teman-teman dan dapatkan bonus menarik
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Referral Code Section */}
          <Card className="mb-8 p-8 text-center">
            <CardHeader>
              <CardTitle className="text-2xl mb-4">Kode Referral Anda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-4 mb-6">
                <Input 
                  value={referralCode} 
                  readOnly 
                  className="text-center text-xl font-bold bg-gray-100 border-2"
                />
                <Button onClick={handleCopyCode} className="flex items-center gap-2">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Tersalin!' : 'Salin'}
                </Button>
              </div>
              <p className="text-gray-600">
                Bagikan kode ini dengan teman-teman Anda
              </p>
            </CardContent>
          </Card>

          {/* How it Works */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center p-6">
              <CardHeader>
                <Share2 className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <CardTitle className="text-lg">1. Bagikan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Bagikan kode referral Anda dengan teman dan keluarga</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <Users className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <CardTitle className="text-lg">2. Mereka Bergabung</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Teman Anda mendaftar menggunakan kode referral Anda</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <Gift className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <CardTitle className="text-lg">3. Dapatkan Bonus</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Anda dan teman Anda mendapatkan bonus pendaftaran</p>
              </CardContent>
            </Card>
          </div>

          {/* Bonus Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Bonus yang Bisa Anda Dapatkan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <span className="font-medium">Bonus Pendaftaran Teman</span>
                <span className="text-blue-600 font-bold">Rp 50.000</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="font-medium">Bonus Transaksi Pertama Teman</span>
                <span className="text-green-600 font-bold">Rp 25.000</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                <span className="font-medium">Bonus Bulanan (10+ referral aktif)</span>
                <span className="text-purple-600 font-bold">Rp 500.000</span>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Statistik Referral Anda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold text-blue-600">0</div>
                  <div className="text-gray-600">Total Referral</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">Rp 0</div>
                  <div className="text-gray-600">Total Bonus</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">0</div>
                  <div className="text-gray-600">Referral Aktif</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default InviteEarn;
