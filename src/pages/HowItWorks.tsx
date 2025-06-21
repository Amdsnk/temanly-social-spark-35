
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, UserCheck, Search, Calendar, MessageCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';

const HowItWorks = () => {
  const steps = [
    {
      icon: <UserCheck className="w-12 h-12 text-blue-500" />,
      title: "1. Buat Akun",
      description: "Daftar gratis dan verifikasi identitas Anda untuk keamanan bersama."
    },
    {
      icon: <Search className="w-12 h-12 text-green-500" />,
      title: "2. Pilih Talent",
      description: "Browse talent berdasarkan lokasi, layanan, dan preferensi Anda."
    },
    {
      icon: <Calendar className="w-12 h-12 text-purple-500" />,
      title: "3. Book & Bayar",
      description: "Pilih layanan, tentukan waktu, dan lakukan pembayaran yang aman."
    },
    {
      icon: <MessageCircle className="w-12 h-12 text-pink-500" />,
      title: "4. Nikmati Layanan",
      description: "Talent akan menghubungi Anda dan layanan dimulai sesuai jadwal."
    },
    {
      icon: <Star className="w-12 h-12 text-yellow-500" />,
      title: "5. Berikan Review",
      description: "Setelah selesai, berikan rating dan review untuk membantu talent lain."
    }
  ];

  const features = [
    {
      title: "Verifikasi Ketat",
      description: "Semua talent telah melalui proses verifikasi identitas dan background check."
    },
    {
      title: "Pembayaran Aman",
      description: "Sistem pembayaran terintegrasi dengan berbagai metode yang aman dan terpercaya."
    },
    {
      title: "Customer Support 24/7",
      description: "Tim support siap membantu Anda kapan saja jika ada masalah atau pertanyaan."
    },
    {
      title: "Rating & Review",
      description: "Sistem rating transparan untuk membantu Anda memilih talent terbaik."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">How It Works</h1>
              <p className="text-gray-600">Panduan lengkap menggunakan Temanly</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Cara Menggunakan Temanly
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dalam 5 langkah mudah, Anda sudah bisa menikmati layanan social companion terbaik di Indonesia
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-16">
          {steps.map((step, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="mb-4 flex justify-center">
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Mengapa Pilih Temanly?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pricing Info */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Informasi Harga & Biaya</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-bold text-lg mb-2">Chat</h4>
                <p className="text-2xl font-bold text-blue-600 mb-1">Rp 25.000</p>
                <p className="text-gray-500">per hari</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-bold text-lg mb-2">Voice Call</h4>
                <p className="text-2xl font-bold text-green-600 mb-1">Rp 40.000</p>
                <p className="text-gray-500">per jam</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-bold text-lg mb-2">Video Call</h4>
                <p className="text-2xl font-bold text-purple-600 mb-1">Rp 65.000</p>
                <p className="text-gray-500">per jam</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-bold text-lg mb-2">Offline Date</h4>
                <p className="text-2xl font-bold text-red-600 mb-1">Rp 285.000</p>
                <p className="text-gray-500">per 3 jam</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-bold text-lg mb-2">Party Buddy</h4>
                <p className="text-2xl font-bold text-orange-600 mb-1">Rp 1.000.000</p>
                <p className="text-gray-500">per event</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-bold text-lg mb-2">Rent a Lover</h4>
                <p className="text-2xl font-bold text-pink-600 mb-1">up to Rp 85.000</p>
                <p className="text-gray-500">per hari</p>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-bold text-lg mb-2">⚠️ Biaya Tambahan</h4>
              <ul className="text-sm space-y-1">
                <li>• Biaya aplikasi 10% dari total harga</li>
                <li>• Transport untuk offline date: 20% dari total tarif</li>
                <li>• Overtime offline date: Rp 90.000/jam</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Siap Memulai?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3">
                Daftar Sekarang
              </Button>
            </Link>
            <Link to="/talents">
              <Button variant="outline" className="px-8 py-3">
                Browse Talents
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HowItWorks;
