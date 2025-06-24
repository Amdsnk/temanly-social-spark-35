
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { IdCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import VerificationRequiredBanner from '@/components/VerificationRequiredBanner';
import { useAuth } from '@/contexts/AuthContext';

const TalentRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    city: '',
    phone: '',
    email: '',
    bio: '',
    zodiac: '',
    loveLanguage: '',
    services: [] as string[],
    serviceDetails: {
      'rent-a-lover': '',
      'offline-date': '',
      'party-buddy': ''
    },
    interests: [] as string[],
    weekdayAvailability: '',
    weekendAvailability: '',
    agreeTerms: false,
    idVerification: null as File | null
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const services = [
    { id: 'chat', name: 'Chat (25k/hari)', description: 'Layanan chat harian' },
    { id: 'call', name: 'Voice Call (40k/jam)', description: 'Panggilan suara per jam' },
    { id: 'video-call', name: 'Video Call (65k/jam)', description: 'Video call per jam' },
    { id: 'rent-a-lover', name: 'Rent a Lover (up to 85k/hari)', description: 'Layanan pendamping virtual' },
    { id: 'offline-date', name: 'Offline Date (285k/3jam)', description: 'Kencan offline 3 jam' },
    { id: 'party-buddy', name: 'Party Buddy (1M/event)', description: 'Pendamping acara/pesta (21+ only)' }
  ];

  const interestOptions = [
    'sushi date', 'museum date', 'movie date', 'coffee chat', 'shopping',
    'picnic date', 'gaming', 'nightlife', 'cocktails', 'dancing',
    'art gallery', 'yoga', 'hiking', 'golf', 'tennis', 'karaoke',
    'photo hunting', 'culinary tour', 'city tour', 'beach activities'
  ];

  const zodiacSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  const loveLanguages = [
    'Words of Affirmation', 'Quality Time', 'Physical Touch', 
    'Acts of Service', 'Gift Giving'
  ];

  const handleServiceChange = (serviceId: string, checked: boolean) => {
    if (serviceId === 'party-buddy' && checked && parseInt(formData.age) < 21) {
      toast({
        title: "Error",
        description: "Party Buddy hanya tersedia untuk talent berusia 21+ tahun.",
        variant: "destructive"
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      services: checked 
        ? [...prev.services, serviceId]
        : prev.services.filter(s => s !== serviceId)
    }));
  };

  const handleInterestChange = (interest: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, interest]
        : prev.interests.filter(i => i !== interest)
    }));
  };

  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, idVerification: file }));
      toast({
        title: "File berhasil dipilih",
        description: `File ${file.name} telah dipilih untuk verifikasi ID.`,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeTerms) {
      toast({
        title: "Error",
        description: "Harap setujui syarat dan ketentuan.",
        variant: "destructive"
      });
      return;
    }

    if (formData.services.length === 0) {
      toast({
        title: "Error",
        description: "Pilih minimal satu layanan.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.idVerification) {
      toast({
        title: "Error",
        description: "Wajib upload KTP/ID Card untuk verifikasi.",
        variant: "destructive"
      });
      return;
    }

    if (formData.services.includes('party-buddy') && parseInt(formData.age) < 21) {
      toast({
        title: "Error",
        description: "Party Buddy hanya tersedia untuk talent berusia 21+ tahun.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await signup({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: 'temp_password_' + Date.now(), // Temporary password, admin will reset
        user_type: 'companion'
      });

      if (result.needsVerification) {
        navigate('/talent-register-success', {
          state: {
            email: formData.email,
            name: formData.name,
            message: 'Pendaftaran talent berhasil! Dokumen Anda sedang ditinjau oleh tim admin.'
          }
        });
      }
    } catch (error) {
      console.error('Talent registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Header 
        title="Daftar Jadi Talent" 
        subtitle="Bergabunglah dengan komunitas talent Temanly dan mulai earning!"
        showLogo={false}
      />

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <VerificationRequiredBanner userType="companion" />
        
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4">
            <img 
              src="/lovable-uploads/2b715270-d5ae-4f6c-be60-2dfaf1662139.png" 
              alt="Temanly Logo"
              className="h-12 mx-auto"
            />
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Informasi Pribadi</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age">Usia * (Min. 18 tahun)</Label>
                    <Input
                      id="age"
                      type="number"
                      min="18"
                      max="40"
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Kota *</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, city: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kota" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jakarta">Jakarta</SelectItem>
                        <SelectItem value="surabaya">Surabaya</SelectItem>
                        <SelectItem value="bandung">Bandung</SelectItem>
                        <SelectItem value="yogyakarta">Yogyakarta</SelectItem>
                        <SelectItem value="bali">Bali</SelectItem>
                        <SelectItem value="medan">Medan</SelectItem>
                        <SelectItem value="semarang">Semarang</SelectItem>
                        <SelectItem value="makassar">Makassar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">WhatsApp *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="08123456789"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio Singkat *</Label>
                  <Textarea
                    id="bio"
                    placeholder="Ceritakan tentang diri Anda, personality, hobi, dan hal menarik lainnya..."
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Zodiak</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, zodiac: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih zodiak" />
                      </SelectTrigger>
                      <SelectContent>
                        {zodiacSigns.map((sign) => (
                          <SelectItem key={sign} value={sign.toLowerCase()}>{sign}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Love Language</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, loveLanguage: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih love language" />
                      </SelectTrigger>
                      <SelectContent>
                        {loveLanguages.map((lang) => (
                          <SelectItem key={lang} value={lang.toLowerCase()}>{lang}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* ID Verification */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-red-600 border-b border-red-200 pb-2">
                  🆔 Verifikasi Identitas (WAJIB)
                </h3>
                
                <div className="border-2 border-dashed border-red-300 rounded-lg p-6 text-center bg-red-50">
                  <IdCard className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="font-medium text-red-700 mb-2">Upload KTP/ID Card</p>
                  <p className="text-sm text-red-600 mb-4">
                    Semua talent wajib melakukan verifikasi identitas untuk keamanan platform
                  </p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleIdUpload}
                    className="hidden"
                    id="id-upload"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="border-red-400 text-red-600 hover:bg-red-100"
                    onClick={() => document.getElementById('id-upload')?.click()}
                  >
                    Pilih File KTP/ID
                  </Button>
                  {formData.idVerification && (
                    <p className="text-sm text-green-600 mt-3 font-medium">
                      ✅ File terpilih: {formData.idVerification.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Services */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Layanan yang Tersedia *</h3>
                <p className="text-sm text-gray-600">Pilih layanan yang ingin Anda tawarkan:</p>
                
                <div className="space-y-3">
                  {services.map((service) => (
                    <div key={service.id} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id={service.id}
                          checked={formData.services.includes(service.id)}
                          onCheckedChange={(checked) => handleServiceChange(service.id, checked === true)}
                        />
                        <div className="flex-1">
                          <Label htmlFor={service.id} className="font-medium">{service.name}</Label>
                          <p className="text-sm text-gray-500">{service.description}</p>
                          
                          {service.id === 'party-buddy' && (
                            <p className="text-xs text-red-600 mt-1">⚠️ Hanya untuk talent berusia 21+ tahun</p>
                          )}
                          
                          {/* Service Details */}
                          {formData.services.includes(service.id) && ['rent-a-lover', 'offline-date'].includes(service.id) && (
                            <div className="mt-3">
                              <Label className="text-sm">Detail Layanan</Label>
                              <Textarea
                                placeholder={
                                  service.id === 'rent-a-lover' 
                                    ? "Contoh: Chat only, atau call max 1 hour per day, atau available for all services"
                                    : "Contoh: Available untuk dinner date, museum visit, shopping companion"
                                }
                                value={formData.serviceDetails[service.id as keyof typeof formData.serviceDetails]}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  serviceDetails: {
                                    ...prev.serviceDetails,
                                    [service.id]: e.target.value
                                  }
                                }))}
                                className="mt-1"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Minat & Aktivitas</h3>
                <p className="text-sm text-gray-600">Pilih aktivitas yang Anda sukai (membantu user menemukan talent yang sesuai):</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {interestOptions.map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest}
                        checked={formData.interests.includes(interest)}
                        onCheckedChange={(checked) => handleInterestChange(interest, checked === true)}
                      />
                      <Label htmlFor={interest} className="text-sm">{interest}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Jadwal Ketersediaan</h3>
                <p className="text-sm text-gray-600">
                  Tentukan jadwal untuk layanan Offline Date dan Party Buddy
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weekdayAvailability">Weekdays (Senin-Jumat)</Label>
                    <Input
                      id="weekdayAvailability"
                      placeholder="Contoh: 17:00 - 22:00 WIB"
                      value={formData.weekdayAvailability}
                      onChange={(e) => setFormData(prev => ({ ...prev, weekdayAvailability: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weekendAvailability">Weekend (Sabtu-Minggu)</Label>
                    <Input
                      id="weekendAvailability"
                      placeholder="Contoh: 14:00 - 20:00 WIB"
                      value={formData.weekendAvailability}
                      onChange={(e) => setFormData(prev => ({ ...prev, weekendAvailability: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeTerms: checked === true }))}
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed">
                    Saya setuju dengan{' '}
                    <Link to="/terms" className="text-blue-600 hover:underline">
                      Syarat & Ketentuan Talent
                    </Link>
                    {' '}dan{' '}
                    <Link to="/privacy" className="text-blue-600 hover:underline">
                      Kebijakan Privasi
                    </Link>
                    {' '}serta memahami bahwa semua informasi akan diverifikasi oleh tim Temanly.
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-purple-500 hover:bg-purple-600 py-3 text-lg font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? 'Mengirim Pendaftaran...' : 'Daftar Sebagai Talent'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TalentRegister;
