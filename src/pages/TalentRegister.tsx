import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, IdCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
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
    interests: [] as string[],
    availability: '',
    agreeTerms: false,
    idVerification: null as File | null
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const services = [
    { id: 'chat', name: 'Chat (25k/hari)' },
    { id: 'call', name: 'Voice Call (40k/jam)' },
    { id: 'video', name: 'Video Call (65k/jam)' },
    { id: 'offline-date', name: 'Offline Date (285k/3jam)' },
    { id: 'party-buddy', name: 'Party Buddy (1M/event)' },
    { id: 'rent-a-lover', name: 'Rent a Lover (up to 85k/hari)' }
  ];

  const interestOptions = [
    'sushi date', 'museum date', 'movie date', 'coffee chat', 'shopping',
    'picnic date', 'gaming', 'nightlife', 'cocktails', 'dancing',
    'art gallery', 'yoga', 'hiking', 'golf', 'tennis'
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

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4">
            <img 
              src="/lovable-uploads/2b715270-d5ae-4f6c-be60-2dfaf1662139.png" 
              alt="Temanly Logo"
              className="h-12 mx-auto"
            />
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informasi Pribadi</h3>
                
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
                    <Label htmlFor="age">Usia *</Label>
                    <Input
                      id="age"
                      type="number"
                      min="21"
                      max="35"
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                      required
                    />
                  </div>
                </div>

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
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio Singkat *</Label>
                  <Textarea
                    id="bio"
                    placeholder="Ceritakan tentang diri Anda..."
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
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
                <h3 className="text-lg font-semibold text-red-600">Verifikasi Identitas *</h3>
                <p className="text-sm text-gray-600">Upload KTP/ID Card untuk verifikasi identitas (wajib)</p>
                
                <div className="border-2 border-dashed border-red-300 rounded-lg p-6 text-center">
                  <IdCard className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Upload KTP/ID Card</p>
                  <p className="text-xs text-red-500 mb-4">* Wajib untuk verifikasi identitas</p>
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
                    className="border-red-300 text-red-600 hover:bg-red-50"
                    onClick={() => document.getElementById('id-upload')?.click()}
                  >
                    Pilih File KTP/ID
                  </Button>
                  {formData.idVerification && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ File terpilih: {formData.idVerification.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Services */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Layanan yang Tersedia</h3>
                <p className="text-sm text-gray-600">Pilih layanan yang ingin Anda tawarkan:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={service.id}
                        checked={formData.services.includes(service.id)}
                        onCheckedChange={(checked) => handleServiceChange(service.id, checked === true)}
                      />
                      <Label htmlFor={service.id} className="text-sm">{service.name}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Minat & Aktivitas</h3>
                <p className="text-sm text-gray-600">Pilih aktivitas yang Anda sukai:</p>
                
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
                <h3 className="text-lg font-semibold">Ketersediaan</h3>
                <div className="space-y-2">
                  <Label htmlFor="availability">Jadwal Ketersediaan</Label>
                  <Input
                    id="availability"
                    placeholder="Contoh: Weekdays 5-10 PM, Weekends 2-8 PM"
                    value={formData.availability}
                    onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Photo Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Upload Foto</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Upload foto profil (minimal 3 foto)</p>
                  <Button type="button" variant="outline">
                    Pilih Foto
                  </Button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeTerms: checked === true }))}
                />
                <Label htmlFor="terms" className="text-sm">
                  Saya setuju dengan{' '}
                  <Link to="/terms" className="text-blue-600 hover:underline">
                    Syarat & Ketentuan Talent
                  </Link>
                  {' '}dan{' '}
                  <Link to="/privacy" className="text-blue-600 hover:underline">
                    Kebijakan Privasi
                  </Link>
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-purple-500 hover:bg-purple-600"
                disabled={isLoading}
              >
                {isLoading ? 'Mendaftar...' : 'Daftar Sebagai Talent'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TalentRegister;
