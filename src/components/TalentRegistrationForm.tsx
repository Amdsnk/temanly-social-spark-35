
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Camera, FileText, MapPin, Clock, DollarSign, User, Mail, Phone, Calendar } from 'lucide-react';
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
  'Event Companion'
];

const availableLanguages = [
  'Bahasa Indonesia',
  'English',
  'Mandarin',
  'Jawa',
  'Sunda',
  'Batak',
  'Minang'
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

  const toggleArrayItem = (field: 'services' | 'availability' | 'languages' | 'specialties', item: string) => {
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
      
      // Create the signup data
      const signupData = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: password,
        user_type: 'companion' as const,
        // Store all additional data in metadata for now
        additionalData: {
          age: formData.age,
          location: formData.location,
          bio: formData.bio,
          services: formData.services,
          hourlyRate: formData.hourlyRate,
          experienceYears: formData.experienceYears,
          availability: formData.availability,
          languages: formData.languages,
          specialties: formData.specialties,
          transportationMode: formData.transportationMode,
          emergencyContact: formData.emergencyContact,
          emergencyPhone: formData.emergencyPhone,
          hasIdCard: !!formData.idCardFile,
          hasProfilePhoto: !!formData.profilePhotoFile
        }
      };
      
      const result = await signup(signupData);
      
      if (result.needsVerification) {
        toast({
          title: "Pendaftaran Berhasil!",
          description: "Data Anda telah diterima dan sedang menunggu verifikasi admin. Kami akan menghubungi Anda melalui email atau WhatsApp.",
          className: "bg-green-50 border-green-200"
        });
        
        // Redirect to success page
        window.location.href = '/talent-register-success';
      }
      
    } catch (error: any) {
      console.error('Registration error:', error);
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
        <h3 className="text-lg font-semibold text-gray-900">Informasi Personal</h3>
        <p className="text-sm text-gray-600">Lengkapi data pribadi Anda</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Nama Lengkap *</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className="mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="phone">Nomor WhatsApp *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="081234567890"
            className="mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="age">Usia *</Label>
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
        </div>
      </div>
      
      <div>
        <Label htmlFor="location">Lokasi/Kota *</Label>
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
        <Label htmlFor="bio">Bio/Tentang Anda *</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          placeholder="Ceritakan tentang diri Anda, hobi, dan pengalaman sebagai companion..."
          className="mt-1 min-h-[100px]"
          required
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Dokumen Verifikasi</h3>
        <p className="text-sm text-gray-600">Upload dokumen untuk verifikasi identitas</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <Label className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4" />
            Foto KTP *
          </Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload('idCardFile', file);
              }}
              className="hidden"
              id="idCard"
            />
            <label htmlFor="idCard" className="cursor-pointer">
              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                {formData.idCardFile ? formData.idCardFile.name : 'Klik untuk upload foto KTP'}
              </p>
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
                if (file) handleFileUpload('profilePhotoFile', file);
              }}
              className="hidden"
              id="profilePhoto"
            />
            <label htmlFor="profilePhoto" className="cursor-pointer">
              <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                {formData.profilePhotoFile ? formData.profilePhotoFile.name : 'Klik untuk upload foto profil'}
              </p>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Layanan & Tarif</h3>
        <p className="text-sm text-gray-600">Pilih services yang akan Anda tawarkan</p>
      </div>
      
      <div>
        <Label className="mb-3 block">Services yang Anda tawarkan *</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {availableServices.map((service) => (
            <div key={service} className="flex items-center space-x-2">
              <Checkbox
                id={service}
                checked={formData.services.includes(service)}
                onCheckedChange={() => toggleArrayItem('services', service)}
              />
              <Label htmlFor={service} className="text-sm">{service}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="hourlyRate">Tarif per Jam (Rp) *</Label>
          <Input
            id="hourlyRate"
            type="number"
            min="25000"
            step="5000"
            value={formData.hourlyRate}
            onChange={(e) => handleInputChange('hourlyRate', parseInt(e.target.value))}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="experienceYears">Pengalaman (Tahun)</Label>
          <Input
            id="experienceYears"
            type="number"
            min="0"
            max="20"
            value={formData.experienceYears}
            onChange={(e) => handleInputChange('experienceYears', parseInt(e.target.value))}
            className="mt-1"
          />
        </div>
      </div>
      
      <div>
        <Label className="mb-3 block">Bahasa yang Dikuasai</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {availableLanguages.map((language) => (
            <div key={language} className="flex items-center space-x-2">
              <Checkbox
                id={language}
                checked={formData.languages.includes(language)}
                onCheckedChange={() => toggleArrayItem('languages', language)}
              />
              <Label htmlFor={language} className="text-sm">{language}</Label>
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
          <h3 className="text-lg font-semibold text-gray-900">Informasi Tambahan & Password</h3>
          <p className="text-sm text-gray-600">Lengkapi informasi terakhir</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="transportationMode">Moda Transportasi *</Label>
            <Select onValueChange={(value) => handleInputChange('transportationMode', value)}>
              <SelectTrigger className="mt-1">
                <span>{formData.transportationMode || 'Pilih transportasi'}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="motor">Motor</SelectItem>
                <SelectItem value="mobil">Mobil</SelectItem>
                <SelectItem value="transportasi-umum">Transportasi Umum</SelectItem>
                <SelectItem value="berjalan-kaki">Berjalan Kaki</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="emergencyContact">Kontak Darurat *</Label>
            <Input
              id="emergencyContact"
              value={formData.emergencyContact}
              onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
              placeholder="Nama keluarga/teman"
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
        </div>
        
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Buat Password Akun</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
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
                required
              />
            </div>
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
            handleSubmit(password);
          }}
          className="w-full mt-6"
          disabled={loading || !password || password !== confirmPassword}
        >
          {loading ? 'Mendaftar...' : 'Daftar Sebagai Talent'}
        </Button>
      </div>
    );
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.fullName && formData.email && formData.phone && formData.age >= 18 && formData.location && formData.bio;
      case 2:
        return formData.idCardFile && formData.profilePhotoFile;
      case 3:
        return formData.services.length > 0 && formData.hourlyRate >= 25000;
      case 4:
        return formData.transportationMode && formData.emergencyContact && formData.emergencyPhone;
      default:
        return false;
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          Daftar Sebagai Talent Temanly
        </CardTitle>
        <div className="flex justify-center space-x-2 mt-4">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === currentStep
                  ? 'bg-blue-600 text-white'
                  : step < currentStep
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step}
            </div>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        
        {currentStep < 4 && (
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
            >
              Sebelumnya
            </Button>
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!isStepValid(currentStep)}
            >
              Selanjutnya
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TalentRegistrationForm;
