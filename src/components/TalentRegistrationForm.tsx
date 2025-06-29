import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Camera, FileText, MapPin, Clock, DollarSign, User, Mail, Phone, Calendar, AlertCircle, Heart, Star } from 'lucide-react';
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
  zodiac: string;
  loveLanguage: string;
  
  // Documents
  idCardFile: File | null;
  profilePhotoFile: File | null;
  
  // Service Information - Updated untuk Temanly
  availableServices: string[];
  rentLoverDetails: {
    price: number;
    inclusions: string[];
    description: string;
  };
  
  // Availability & Scheduling
  availability: {
    offlineDate: {
      weekdays: string[];
      timeSlots: string[];
    };
    partyBuddy: {
      available: boolean;
      weekends: string[];
    };
    general: string[];
  };
  
  // Interests & Preferences
  dateInterests: string[];
  languages: string[];
  specialties: string[];
  
  // Additional Info
  transportationMode: string;
  emergencyContact: string;
  emergencyPhone: string;
}

// Temanly Service Options
const temanlyServices = [
  { id: 'chat', name: 'Chat', basePrice: 25000, unit: '/hari', description: 'Chat sepanjang hari' },
  { id: 'call', name: 'Voice Call', basePrice: 40000, unit: '/jam', description: 'Panggilan suara' },
  { id: 'video-call', name: 'Video Call', basePrice: 65000, unit: '/jam', description: 'Video call (platform apa saja)' },
  { id: 'offline-date', name: 'Offline Date', basePrice: 285000, unit: '/3 jam', description: 'Kencan offline (21+ untuk verifikasi)' },
  { id: 'party-buddy', name: 'Party Buddy', basePrice: 1000000, unit: '/event', description: 'Teman pesta (21+ only, 8 malam - 4 pagi)' },
  { id: 'rent-lover', name: 'Rent a Lover', basePrice: 0, unit: '/hari', description: 'Paket romantis (up to 85k/hari, atur sendiri)' }
];

const rentLoverInclusions = [
  'Chat unlimited',
  'Voice note unlimited', 
  'Phone call (max 30 menit/hari)',
  'Phone call (max 1 jam/hari)',
  'Video call (max 30 menit/hari)',
  'Video call (max 1 jam/hari)',
  'Ucapan selamat pagi/malam',
  'Panggilan nama sayang',
  'Good morning/night messages'
];

const dateInterests = [
  'Sushi Date', 'Museum Date', 'Picnic Date', 'Movie Date', 'Golf', 'Tennis',
  'Coffee Date', 'Art Gallery', 'Shopping', 'Karaoke', 'Bowling', 'Arcade',
  'Beach Walk', 'Hiking', 'Food Court', 'Night Market', 'Concert', 'Theater'
];

const zodiacSigns = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const loveLanguages = [
  'Words of Affirmation', 'Quality Time', 'Physical Touch', 
  'Acts of Service', 'Receiving Gifts'
];

const availableCities = [
  'Jakarta', 'Bandung', 'Surabaya', 'Medan', 'Semarang', 'Makassar',
  'Palembang', 'Yogyakarta', 'Denpasar', 'Balikpapan'
];

const timeSlots = [
  '09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00', '21:00-24:00'
];

const TalentRegistrationForm = () => {
  const { signup } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Add password state at component level
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [formData, setFormData] = useState<TalentRegistrationData>({
    fullName: '',
    email: '',
    phone: '',
    age: 21,
    location: '',
    bio: '',
    zodiac: '',
    loveLanguage: '',
    idCardFile: null,
    profilePhotoFile: null,
    availableServices: [],
    rentLoverDetails: {
      price: 50000,
      inclusions: [],
      description: ''
    },
    availability: {
      offlineDate: {
        weekdays: [],
        timeSlots: []
      },
      partyBuddy: {
        available: false,
        weekends: []
      },
      general: []
    },
    dateInterests: [],
    languages: ['Bahasa Indonesia'],
    specialties: [],
    transportationMode: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  const handleInputChange = (field: keyof TalentRegistrationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parentField: keyof TalentRegistrationData, childField: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField] as any,
        [childField]: value
      }
    }));
  };

  const handleFileUpload = (field: 'idCardFile' | 'profilePhotoFile', file: File) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const toggleArrayItem = (field: string, item: string, nested?: string) => {
    if (nested) {
      setFormData(prev => {
        const parentData = prev[field as keyof TalentRegistrationData] as any;
        const nestedPath = nested.split('.');
        
        if (nestedPath.length === 2) {
          const [nestedField, subField] = nestedPath;
          const currentArray = parentData[nestedField]?.[subField] || [];
          
          return {
            ...prev,
            [field]: {
              ...parentData,
              [nestedField]: {
                ...parentData[nestedField],
                [subField]: currentArray.includes(item) 
                  ? currentArray.filter((i: string) => i !== item)
                  : [...currentArray, item]
              }
            }
          };
        }
        
        const currentArray = parentData[nested] || [];
        return {
          ...prev,
          [field]: {
            ...parentData,
            [nested]: currentArray.includes(item) 
              ? currentArray.filter((i: string) => i !== item)
              : [...currentArray, item]
          }
        };
      });
    } else {
      setFormData(prev => {
        const currentArray = (prev[field as keyof TalentRegistrationData] as string[]) || [];
        return {
          ...prev,
          [field]: currentArray.includes(item) 
            ? currentArray.filter(i => i !== item)
            : [...currentArray, item]
        };
      });
    }
  };

  const handleSubmit = async (password: string) => {
    try {
      setLoading(true);
      
      console.log('📝 Submitting Temanly talent registration:', formData);
      
      const signupData = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: password,
        user_type: 'companion' as const,
        additionalData: {
          // Personal Information
          age: formData.age,
          location: formData.location,
          bio: formData.bio,
          zodiac: formData.zodiac,
          loveLanguage: formData.loveLanguage,
          
          // Temanly Service Information
          availableServices: formData.availableServices,
          rentLoverDetails: formData.rentLoverDetails,
          
          // Availability & Scheduling
          availability: formData.availability,
          
          // Skills & Preferences
          languages: formData.languages,
          dateInterests: formData.dateInterests,
          specialties: formData.specialties,
          
          // Additional Information
          transportationMode: formData.transportationMode,
          emergencyContact: formData.emergencyContact,
          emergencyPhone: formData.emergencyPhone,
          
          // Document Status
          hasIdCard: !!formData.idCardFile,
          hasProfilePhoto: !!formData.profilePhotoFile,
          
          // Registration Metadata
          registrationTimestamp: new Date().toISOString(),
          formVersion: '3.0-temanly',
          completionStatus: 'comprehensive',
          businessModel: 'temanly-hybrid'
        }
      };
      
      console.log('🚀 Sending Temanly talent signup data:', signupData);
      
      const result = await signup(signupData);
      
      if (result.needsVerification) {
        toast({
          title: "✅ Pendaftaran Talent Temanly Berhasil!",
          description: "Data lengkap Anda telah diterima. Tim admin akan melakukan review dan verifikasi dalam 1-2 hari kerja. Kami akan menghubungi Anda melalui WhatsApp setelah disetujui.",
          className: "bg-green-50 border-green-200"
        });
        
        localStorage.setItem('talent-registration-summary', JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          services: formData.availableServices,
          location: formData.location,
          submittedAt: new Date().toISOString()
        }));
        
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
        <h3 className="text-lg font-semibold text-gray-900">👤 Informasi Personal</h3>
        <p className="text-sm text-gray-600">Data pribadi dan karakteristik Anda</p>
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
            placeholder="Nama lengkap sesuai KTP"
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
        </div>
        
        <div>
          <Label htmlFor="age" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Usia *
          </Label>
          <Input
            id="age"
            type="number"
            min="21"
            max="30"
            value={formData.age}
            onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
            className="mt-1"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Minimal 21 tahun untuk bergabung</p>
        </div>
        
        <div>
          <Label htmlFor="location" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Kota *
          </Label>
          <Select onValueChange={(value) => handleInputChange('location', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Pilih kota Anda" />
            </SelectTrigger>
            <SelectContent>
              {availableCities.map((city) => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="zodiac" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Zodiak *
          </Label>
          <Select onValueChange={(value) => handleInputChange('zodiac', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Pilih zodiak Anda" />
            </SelectTrigger>
            <SelectContent>
              {zodiacSigns.map((sign) => (
                <SelectItem key={sign} value={sign}>{sign}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="loveLanguage" className="flex items-center gap-2">
          <Heart className="w-4 h-4" />
          Love Language *
        </Label>
        <Select onValueChange={(value) => handleInputChange('loveLanguage', value)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Pilih love language Anda" />
          </SelectTrigger>
          <SelectContent>
            {loveLanguages.map((lang) => (
              <SelectItem key={lang} value={lang}>{lang}</SelectItem>
            ))}
          </SelectContent>
        </Select>
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
          placeholder="Ceritakan tentang diri Anda, kepribadian, hobi, dan hal menarik yang membuat client tertarik untuk menghabiskan waktu bersama Anda..."
          className="mt-1 min-h-[120px]"
          required
        />
        <p className="text-xs text-gray-500 mt-1">Minimal 100 karakter. Tulis dengan menarik!</p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">📄 Dokumen Verifikasi</h3>
        <p className="text-sm text-gray-600">Upload dokumen untuk verifikasi identitas (Wajib 21+)</p>
      </div>
      
      <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-red-800">Verifikasi Usia Wajib!</h4>
            <ul className="text-sm text-red-700 mt-1 space-y-1">
              <li>• Usia minimal 21 tahun untuk semua layanan</li>
              <li>• KTP akan diverifikasi secara ketat</li>
              <li>• Foto profil harus jelas dan profesional</li>
              <li>• Dokumen palsu akan mengakibatkan penolakan permanen</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <Label className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4" />
            Foto KTP/Identitas * (Verifikasi Usia 21+)
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
                {formData.idCardFile ? `📁 ${formData.idCardFile.name}` : 'Klik untuk upload KTP'}
              </p>
              <p className="text-xs text-gray-400 mt-1">JPG, JPEG, PNG - Max 5MB</p>
            </label>
          </div>
        </div>
        
        <div>
          <Label className="flex items-center gap-2 mb-2">
            <Camera className="w-4 h-4" />
            Foto Profil * (Untuk ditampilkan ke client)
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
              <p className="text-xs text-gray-400 mt-1">Foto menarik dan profesional - Max 5MB</p>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">💼 Layanan Temanly</h3>
        <p className="text-sm text-gray-600">Pilih layanan yang akan Anda tawarkan</p>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">📋 Daftar Layanan Temanly</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• Chat - Rp 25.000/hari</p>
          <p>• Voice Call - Rp 40.000/jam</p>
          <p>• Video Call - Rp 65.000/jam</p>
          <p>• Offline Date - Rp 285.000/3 jam (+90k/jam tambahan)</p>
          <p>• Party Buddy - Rp 1.000.000/event (21+ only)</p>
          <p>• Rent a Lover - Up to Rp 85.000/hari (atur sendiri)</p>
        </div>
      </div>

      <div>
        <Label className="mb-3 block font-medium">Layanan yang Tersedia * (Pilih minimal 1)</Label>
        <div className="space-y-3">
          {temanlyServices.map((service) => {
            const isPartyBuddy = service.id === 'party-buddy';
            return (
              <div key={service.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={service.id}
                  checked={formData.availableServices.includes(service.id)}
                  onCheckedChange={() => toggleArrayItem('availableServices', service.id)}
                />
                <div className="flex-1">
                  <Label htmlFor={service.id} className="font-medium cursor-pointer">
                    {service.name} {isPartyBuddy && '(21+ Only)'}
                  </Label>
                  <p className="text-sm text-gray-600">{service.description}</p>
                  <p className="text-sm font-medium text-green-600">
                    {service.basePrice > 0 ? `Rp ${service.basePrice.toLocaleString()}${service.unit}` : 'Tarif fleksibel'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {formData.availableServices.includes('rent-lover') && (
        <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
          <h4 className="font-medium text-pink-900 mb-3">💕 Rent a Lover Package Details</h4>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="rentLoverPrice">Harga per Hari (Max Rp 85.000) *</Label>
              <Input
                id="rentLoverPrice"
                type="number"
                min="25000"
                max="85000"
                step="5000"
                value={formData.rentLoverDetails.price}
                onChange={(e) => handleNestedChange('rentLoverDetails', 'price', parseInt(e.target.value))}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label className="mb-2 block">Yang Termasuk dalam Paket *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {rentLoverInclusions.map((inclusion) => (
                  <div key={inclusion} className="flex items-center space-x-2">
                    <Checkbox
                      id={inclusion}
                      checked={formData.rentLoverDetails.inclusions.includes(inclusion)}
                      onCheckedChange={() => {
                        const current = formData.rentLoverDetails.inclusions;
                        const updated = current.includes(inclusion)
                          ? current.filter(i => i !== inclusion)
                          : [...current, inclusion];
                        handleNestedChange('rentLoverDetails', 'inclusions', updated);
                      }}
                    />
                    <Label htmlFor={inclusion} className="text-sm cursor-pointer">{inclusion}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="rentLoverDesc">Deskripsi Paket Anda</Label>
              <Textarea
                id="rentLoverDesc"
                value={formData.rentLoverDetails.description}
                onChange={(e) => handleNestedChange('rentLoverDetails', 'description', e.target.value)}
                placeholder="Contoh: Chat unlimited sepanjang hari, panggilan maksimal 1 jam, ucapan selamat pagi/malam..."
                className="mt-1"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">📅 Ketersediaan & Minat</h3>
        <p className="text-sm text-gray-600">Atur jadwal dan preferensi Anda</p>
      </div>

      <div>
        <Label className="mb-3 block font-medium">Minat Date & Aktivitas *</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-purple-50 rounded-lg">
          {dateInterests.map((interest) => (
            <div key={interest} className="flex items-center space-x-2">
              <Checkbox
                id={interest}
                checked={formData.dateInterests.includes(interest)}
                onCheckedChange={() => toggleArrayItem('dateInterests', interest)}
              />
              <Label htmlFor={interest} className="text-sm cursor-pointer">{interest}</Label>
            </div>
          ))}
        </div>
      </div>

      {formData.availableServices.includes('offline-date') && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-medium text-green-900 mb-3">📅 Jadwal Offline Date</h4>
          
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Hari Tersedia</Label>
              <div className="grid grid-cols-2 gap-2">
                {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={`weekday-${day}`}
                      checked={formData.availability.offlineDate.weekdays.includes(day)}
                      onCheckedChange={() => toggleArrayItem('availability', day, 'offlineDate.weekdays')}
                    />
                    <Label htmlFor={`weekday-${day}`} className="text-sm cursor-pointer">{day}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="mb-2 block">Jam Tersedia</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {timeSlots.map((slot) => (
                  <div key={slot} className="flex items-center space-x-2">
                    <Checkbox
                      id={`time-${slot}`}
                      checked={formData.availability.offlineDate.timeSlots.includes(slot)}
                      onCheckedChange={() => toggleArrayItem('availability', slot, 'offlineDate.timeSlots')}
                    />
                    <Label htmlFor={`time-${slot}`} className="text-sm cursor-pointer">{slot}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {formData.availableServices.includes('party-buddy') && (
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <h4 className="font-medium text-orange-900 mb-3">🎉 Party Buddy Availability</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="party-available"
                checked={formData.availability.partyBuddy.available}
                onCheckedChange={(checked) => 
                  handleNestedChange('availability', 'partyBuddy', {
                    ...formData.availability.partyBuddy,
                    available: checked
                  })
                }
              />
              <Label htmlFor="party-available" className="text-sm cursor-pointer">
                Tersedia untuk Party Buddy (8 malam - 4 pagi)
              </Label>
            </div>
            
            {formData.availability.partyBuddy.available && (
              <div className="mt-3">
                <Label className="mb-2 block text-sm">Weekend Tersedia</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['Jumat', 'Sabtu', 'Minggu'].map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={`party-${day}`}
                        checked={formData.availability.partyBuddy.weekends.includes(day)}
                        onCheckedChange={() => {
                          const current = formData.availability.partyBuddy.weekends;
                          const updated = current.includes(day)
                            ? current.filter(d => d !== day)
                            : [...current, day];
                          handleNestedChange('availability', 'partyBuddy', {
                            ...formData.availability.partyBuddy,
                            weekends: updated
                          });
                        }}
                      />
                      <Label htmlFor={`party-${day}`} className="text-sm cursor-pointer">{day}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep5 = () => {
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
                <SelectItem value="ojek-online">🛵 Ojek Online</SelectItem>
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
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">📋 Ringkasan Pendaftaran Temanly</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• Nama: {formData.fullName}</p>
            <p>• Kota: {formData.location}</p>
            <p>• Usia: {formData.age} tahun</p>
            <p>• Zodiak: {formData.zodiac}</p>
            <p>• Love Language: {formData.loveLanguage}</p>
            <p>• Layanan: {formData.availableServices.length} jenis layanan</p>
            <p>• Minat Date: {formData.dateInterests.length} aktivitas</p>
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
          {loading ? '⏳ Mendaftar...' : '🚀 Daftar Sebagai Talent Temanly'}
        </Button>
      </div>
    );
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.fullName && formData.email && formData.phone && 
               formData.age >= 21 && formData.location && formData.bio.length >= 100 &&
               formData.zodiac && formData.loveLanguage;
      case 2:
        return formData.idCardFile && formData.profilePhotoFile;
      case 3:
        return formData.availableServices.length > 0;
      case 4:
        return formData.dateInterests.length > 0;
      case 5:
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
        <p className="text-gray-600">Platform hybrid rental talent & pengalaman sosial</p>
        
        {/* Progress Steps */}
        <div className="flex justify-center space-x-2 mt-6">
          {[1, 2, 3, 4, 5].map((step) => (
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
              {step < 5 && (
                <div className={`w-12 h-1 mx-2 ${step < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-2">
          <span className="text-sm text-gray-500">
            Langkah {currentStep} dari 5
          </span>
        </div>
      </CardHeader>
      
      <CardContent>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
        
        {currentStep < 5 && (
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
