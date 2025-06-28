
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Camera, FileText, MapPin, Clock, DollarSign, User, Mail, Phone, Calendar, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface TalentRegistrationData {
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  age: number;
  location: string;
  bio: string;
  
  // Documents
  idCardFile: File | null;
  profilePhotoFile: File | null;
  
  // Service Information
  services: string[];
  hourlyRate: number;
  experienceYears: number;
  availability: string[];
  languages: string[];
  specialties: string[];
  interests: string[];
  
  // Additional Info
  transportationMode: string;
  emergencyContact: string;
  emergencyPhone: string;
}

const availableServices = [
  'Teman Jalan-jalan',
  'Teman Makan',
  'Teman Nonton',
  'Teman Shopping',
  'Teman Kerja',
  'Teman Olahraga',
  'Teman Belajar',
  'Party Buddy',
  'Event Companion',
  'Teman Traveling',
  'Teman Kuliner',
  'Photography Companion'
];

const availableLanguages = [
  'Bahasa Indonesia',
  'English',
  'Mandarin',
  'Jawa',
  'Sunda',
  'Batak',
  'Minang',
  'Bali',
  'Betawi'
];

const availableInterests = [
  'Fotografi',
  'Musik',
  'Olahraga',
  'Kuliner',
  'Traveling',
  'Fashion',
  'Teknologi',
  'Seni',
  'Gaming',
  'Baca Buku',
  'Film & Drama',
  'Outdoor Activities'
];

const availableSpecialties = [
  'MC/Host',
  'Fotografi',
  'Desain Grafis',
  'Social Media',
  'Bahasa Asing',
  'Musik/Bernyanyi',
  'Dance',
  'Masak',
  'Makeup Artist',
  'Event Organizer'
];

const TalentRegistrationForm = () => {
  const { signup } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState<TalentRegistrationData>({
    fullName: '',
    email: '',
    phone: '',
    age: 18,
    location: '',
    bio: '',
    idCardFile: null,
    profilePhotoFile: null,
    services: [],
    hourlyRate: 50000,
    experienceYears: 0,
    availability: [],
    languages: ['Bahasa Indonesia'],
    specialties: [],
    interests: [],
    transportationMode: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  const handleInputChange = (field: keyof TalentRegistrationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: 'idCardFile' | 'profilePhotoFile', file: File) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const toggleArrayItem = (field: 'services' | 'availability' | 'languages' | 'specialties' | 'interests', item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item) 
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const handleSubmit = async (password: string) => {
    try {
      setLoading(true);
      
      console.log('📝 Submitting comprehensive talent registration:', formData);
      
      // Create the comprehensive signup data
      const signupData = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: password,
        user_type: 'companion' as const,
        // Store ALL additional data comprehensively
        additionalData: {
          // Personal Information
          age: formData.age,
          location: formData.location,
          bio: formData.bio,
          
          // Service Information
          services: formData.services,
          hourlyRate: formData.hourlyRate,
          experienceYears: formData.experienceYears,
          
          // Skills & Preferences
          languages: formData.languages,
          specialties: formData.specialties,
          interests: formData.interests,
          availability: formData.availability,
          
          // Additional Information
          transportationMode: formData.transportationMode,
          emergencyContact: formData.emergencyContact,
          emergencyPhone: formData.emergencyPhone,
          
          // Document Status
          hasIdCard: !!formData.idCardFile,
          hasProfilePhoto: !!formData.profilePhotoFile,
          
          // Registration Metadata
          registrationTimestamp: new Date().toISOString(),
          formVersion: '2.0',
          completionStatus: 'comprehensive'
        }
      };
      
      console.log('🚀 Sending comprehensive signup data:', signupData);
      
      const result = await signup(signupData);
      
      if (result.needsVerification) {
        toast({
          title: "✅ Pendaftaran Talent Berhasil!",
          description: "Data lengkap Anda telah diterima dan disimpan dengan baik. Tim admin akan melakukan review dalam 1-2 hari kerja dan menghubungi Anda melalui email atau WhatsApp.",
          className: "bg-green-50 border-green-200"
        });
        
        // Store registration summary for success page
        localStorage.setItem('talent-registration-summary', JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          services: formData.services,
          hourlyRate: formData.hourlyRate,
          submittedAt: new Date().toISOString()
        }));
        
        // Redirect to success page
        window.location.href = '/talent-register-success';
      }
      
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      toast({
        title: "Pendaftaran Gagal",
        description: error.message || "Terjadi kesalahan saat mendaftar. Silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">📋 Informasi Personal</h3>
        <p className="text-sm text-gray-600">Lengkapi data pribadi Anda dengan benar</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Nama Lengkap *
          </Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className="mt-1"
            placeholder="Masukkan nama lengkap sesuai KTP"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="mt-1"
            placeholder="contoh@email.com"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Nomor WhatsApp *
          </Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="081234567890"
            className="mt-1"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Format: 081234567890 (tanpa +62)</p>
        </div>
        
        <div>
          <Label htmlFor="age" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Usia *
          </Label>
          <Input
            id="age"
            type="number"
            min="18"
            max="60"
            value={formData.age}
            onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
            className="mt-1"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Minimal 18 tahun</p>
        </div>
      </div>
      
      <div>
        <Label htmlFor="location" className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Lokasi/Kota *
        </Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          placeholder="Jakarta, Bandung, Surabaya, dll"
          className="mt-1"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="bio" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Bio/Tentang Anda *
        </Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          placeholder="Ceritakan tentang diri Anda, hobi, pengalaman sebagai companion, kepribadian, dan hal menarik lainnya yang membuat client tertarik..."
          className="mt-1 min-h-[120px]"
          required
        />
        <p className="text-xs text-gray-500 mt-1">Minimal 50 karakter. Tulis dengan menarik agar client tertarik!</p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">📄 Dokumen Verifikasi</h3>
        <p className="text-sm text-gray-600">Upload dokumen untuk verifikasi identitas</p>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800">Penting!</h4>
            <ul className="text-sm text-yellow-700 mt-1 space-y-1">
              <li>• Pastikan foto jelas dan tidak buram</li>
              <li>• Format file: JPG, JPEG, PNG (Max 5MB)</li>
              <li>• Dokumen asli dan masih berlaku</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <Label className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4" />
            Foto KTP/Identitas *
          </Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 5 * 1024 * 1024) {
                    toast({
                      title: "File terlalu besar",
                      description: "Ukuran file maksimal 5MB",
                      variant: "destructive"
                    });
                    return;
                  }
                  handleFileUpload('idCardFile', file);
                }
              }}
              className="hidden"
              id="idCard"
            />
            <label htmlFor="idCard" className="cursor-pointer">
              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                {formData.idCardFile ? `📁 ${formData.idCardFile.name}` : 'Klik untuk upload foto KTP'}
              </p>
              <p className="text-xs text-gray-400 mt-1">JPG, JPEG, PNG - Max 5MB</p>
            </label>
          </div>
        </div>
        
        <div>
          <Label className="flex items-center gap-2 mb-2">
            <Camera className="w-4 h-4" />
            Foto Profil *
          </Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 5 * 1024 * 1024) {
                    toast({
                      title: "File terlalu besar",
                      description: "Ukuran file maksimal 5MB",
                      variant: "destructive"
                    });
                    return;
                  }
                  handleFileUpload('profilePhotoFile', file);
                }
              }}
              className="hidden"
              id="profilePhoto"
            />
            <label htmlFor="profilePhoto" className="cursor-pointer">
              <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                {formData.profilePhotoFile ? `📁 ${formData.profilePhotoFile.name}` : 'Klik untuk upload foto profil'}
              </p>
              <p className="text-xs text-gray-400 mt-1">Foto terbaru dan profesional - Max 5MB</p>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">💼 Layanan & Tarif</h3>
        <p className="text-sm text-gray-600">Pilih layanan yang akan Anda tawarkan</p>
      </div>
      
      <div>
        <Label className="mb-3 block font-medium">Layanan yang Anda tawarkan * (Pilih minimal 1)</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-lg">
          {availableServices.map((service) => (
            <div key={service} className="flex items-center space-x-2">
              <Checkbox
                id={service}
                checked={formData.services.includes(service)}
                onCheckedChange={() => toggleArrayItem('services', service)}
              />
              <Label htmlFor={service} className="text-sm cursor-pointer">{service}</Label>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">Pilih semua layanan yang bisa Anda berikan dengan baik</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="hourlyRate" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Tarif per Jam (Rp) *
          </Label>
          <Input
            id="hourlyRate"
            type="number"
            min="25000"
            step="5000"
            value={formData.hourlyRate}
            onChange={(e) => handleInputChange('hourlyRate', parseInt(e.target.value))}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">Minimal Rp 25.000/jam</p>
        </div>
        
        <div>
          <Label htmlFor="experienceYears" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pengalaman (Tahun)
          </Label>
          <Input
            id="experienceYears"
            type="number"
            min="0"
            max="20"
            value={formData.experienceYears}
            onChange={(e) => handleInputChange('experienceYears', parseInt(e.target.value))}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">Pengalaman sebagai companion/host</p>
        </div>
      </div>
      
      <div>
        <Label className="mb-3 block font-medium">Bahasa yang Dikuasai (Pilih minimal 1)</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-blue-50 rounded-lg">
          {availableLanguages.map((language) => (
            <div key={language} className="flex items-center space-x-2">
              <Checkbox
                id={language}
                checked={formData.languages.includes(language)}
                onCheckedChange={() => toggleArrayItem('languages', language)}
              />
              <Label htmlFor={language} className="text-sm cursor-pointer">{language}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-3 block font-medium">Keahlian Khusus (Opsional)</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-purple-50 rounded-lg">
          {availableSpecialties.map((specialty) => (
            <div key={specialty} className="flex items-center space-x-2">
              <Checkbox
                id={specialty}
                checked={formData.specialties.includes(specialty)}
                onCheckedChange={() => toggleArrayItem('specialties', specialty)}
              />
              <Label htmlFor={specialty} className="text-sm cursor-pointer">{specialty}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-3 block font-medium">Minat & Hobi (Opsional)</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-pink-50 rounded-lg">
          {availableInterests.map((interest) => (
            <div key={interest} className="flex items-center space-x-2">
              <Checkbox
                id={interest}
                checked={formData.interests.includes(interest)}
                onCheckedChange={() => toggleArrayItem('interests', interest)}
              />
              <Label htmlFor={interest} className="text-sm cursor-pointer">{interest}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">🔒 Informasi Tambahan & Password</h3>
          <p className="text-sm text-gray-600">Lengkapi informasi terakhir</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="transportationMode">Moda Transportasi *</Label>
            <Select onValueChange={(value) => handleInputChange('transportationMode', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Pilih transportasi utama" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="motor">🏍️ Motor</SelectItem>
                <SelectItem value="mobil">🚗 Mobil</SelectItem>
                <SelectItem value="transportasi-umum">🚌 Transportasi Umum</SelectItem>
                <SelectItem value="berjalan-kaki">🚶 Berjalan Kaki</SelectItem>
                <SelectItem value="sepeda">🚲 Sepeda</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="emergencyContact">Nama Kontak Darurat *</Label>
            <Input
              id="emergencyContact"
              value={formData.emergencyContact}
              onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
              placeholder="Nama keluarga/teman terdekat"
              className="mt-1"
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="emergencyPhone">Nomor Kontak Darurat *</Label>
          <Input
            id="emergencyPhone"
            value={formData.emergencyPhone}
            onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
            placeholder="081234567890"
            className="mt-1"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Nomor yang bisa dihubungi saat emergency</p>
        </div>
        
        <div className="border-t pt-6">
          <h4 className="font-medium mb-3">🔐 Buat Password Akun</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                placeholder="Minimal 6 karakter"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="confirmPassword">Konfirmasi Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1"
                placeholder="Ulangi password"
                required
              />
            </div>
          </div>
          {password && confirmPassword && password !== confirmPassword && (
            <p className="text-red-500 text-sm mt-2">Password tidak sama</p>
          )}
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">📋 Ringkasan Pendaftaran</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• Nama: {formData.fullName}</p>
            <p>• Email: {formData.email}</p>
            <p>• Layanan: {formData.services.length} jenis layanan</p>
            <p>• Tarif: Rp {formData.hourlyRate.toLocaleString()}/jam</p>
            <p>• Dokumen: {formData.idCardFile && formData.profilePhotoFile ? '✅ Lengkap' : '❌ Belum lengkap'}</p>
          </div>
        </div>
        
        <Button
          onClick={() => {
            if (password !== confirmPassword) {
              toast({
                title: "Error",
                description: "Password tidak sama",
                variant: "destructive"
              });
              return;
            }
            if (password.length < 6) {
              toast({
                title: "Error",
                description: "Password minimal 6 karakter",
                variant: "destructive"
              });
              return;
            }
            handleSubmit(password);
          }}
          className="w-full mt-6 h-12 text-lg"
          disabled={loading || !password || password !== confirmPassword || password.length < 6}
        >
          {loading ? '⏳ Mendaftar...' : '🚀 Daftar Sebagai Talent'}
        </Button>
      </div>
    );
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.fullName && formData.email && formData.phone && formData.age >= 18 && formData.location && formData.bio.length >= 50;
      case 2:
        return formData.idCardFile && formData.profilePhotoFile;
      case 3:
        return formData.services.length > 0 && formData.hourlyRate >= 25000 && formData.languages.length > 0;
      case 4:
        return formData.transportationMode && formData.emergencyContact && formData.emergencyPhone;
      default:
        return false;
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          🌟 Daftar Sebagai Talent Temanly
        </CardTitle>
        <p className="text-gray-600">Bergabunglah dengan komunitas talent terbaik</p>
        
        {/* Progress Steps */}
        <div className="flex justify-center space-x-2 mt-6">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step === currentStep
                    ? 'bg-blue-600 text-white'
                    : step < currentStep
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step < currentStep ? '✓' : step}
              </div>
              {step < 4 && (
                <div className={`w-12 h-1 mx-2 ${step < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-2">
          <span className="text-sm text-gray-500">
            Langkah {currentStep} dari 4
          </span>
        </div>
      </CardHeader>
      
      <CardContent>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        
        {currentStep < 4 && (
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
              className="px-6"
            >
              ← Sebelumnya
            </Button>
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!isStepValid(currentStep)}
              className="px-6"
            >
              Selanjutnya →
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TalentRegistrationForm;
