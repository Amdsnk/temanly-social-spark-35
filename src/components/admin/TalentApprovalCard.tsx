
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Eye, Mail, Phone, MapPin, Calendar, User, FileText, Camera, CreditCard } from 'lucide-react';

interface TalentRegistrationData {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  age: number;
  location: string;
  bio: string;
  hourly_rate: number;
  services: string[];
  languages: string[];
  interests: string[];
  experience_years: number;
  transportation_mode: string;
  emergency_contact: string;
  emergency_phone: string;
  availability: string[];
  has_id_card: boolean;
  has_profile_photo: boolean;
  id_card_url?: string;
  profile_photo_url?: string;
  created_at: string;
  verification_status: 'pending' | 'verified' | 'rejected';
}

interface TalentApprovalCardProps {
  talent: TalentRegistrationData;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const TalentApprovalCard: React.FC<TalentApprovalCardProps> = ({ talent, onApprove, onReject }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{talent.full_name}</CardTitle>
            <p className="text-sm text-gray-600">{talent.email}</p>
            <p className="text-sm text-gray-600">{talent.phone}</p>
          </div>
          <Badge 
            variant={talent.verification_status === 'pending' ? 'default' : 
                    talent.verification_status === 'verified' ? 'secondary' : 'destructive'}
          >
            {talent.verification_status === 'pending' ? '⏳ Menunggu' : 
             talent.verification_status === 'verified' ? '✅ Disetujui' : '❌ Ditolak'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4" />
            <span>Usia: {talent.age} tahun</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{talent.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CreditCard className="w-4 h-4" />
            <span>Rp {talent.hourly_rate?.toLocaleString()}/jam</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4" />
            <span>{talent.experience_years} tahun pengalaman</span>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-medium mb-2">Layanan yang Ditawarkan:</h4>
          <div className="flex flex-wrap gap-1">
            {talent.services?.map((service, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {service}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-medium mb-2">Status Dokumen:</h4>
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span className="text-sm">KTP: </span>
              {talent.has_id_card ? 
                <Badge className="bg-green-100 text-green-700 text-xs">✅ Sudah Upload</Badge> : 
                <Badge className="bg-red-100 text-red-700 text-xs">❌ Belum Upload</Badge>
              }
            </div>
            <div className="flex items-center gap-1">
              <Camera className="w-4 h-4" />
              <span className="text-sm">Foto: </span>
              {talent.has_profile_photo ? 
                <Badge className="bg-green-100 text-green-700 text-xs">✅ Sudah Upload</Badge> : 
                <Badge className="bg-red-100 text-red-700 text-xs">❌ Belum Upload</Badge>
              }
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                Detail Lengkap
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Detail Lengkap Pendaftaran Talent</DialogTitle>
              </DialogHeader>
              <TalentDetailView talent={talent} />
            </DialogContent>
          </Dialog>

          {talent.verification_status === 'pending' && (
            <>
              <Button
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={() => onApprove(talent.id)}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Setujui
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onReject(talent.id)}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Tolak
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const TalentDetailView: React.FC<{ talent: TalentRegistrationData }> = ({ talent }) => {
  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-3 text-gray-900">📋 Informasi Personal</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
            <p className="text-sm mt-1">{talent.full_name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <p className="text-sm mt-1">{talent.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Nomor WhatsApp</label>
            <p className="text-sm mt-1">{talent.phone}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Usia</label>
            <p className="text-sm mt-1">{talent.age} tahun</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Lokasi</label>
            <p className="text-sm mt-1">{talent.location}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Tanggal Daftar</label>
            <p className="text-sm mt-1">{new Date(talent.created_at).toLocaleString('id-ID')}</p>
          </div>
        </div>
        
        {talent.bio && (
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700 block mb-1">Bio</label>
            <p className="text-sm bg-white p-3 rounded border">{talent.bio}</p>
          </div>
        )}
      </div>

      {/* Service Information */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-3 text-blue-900">💼 Informasi Layanan</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-blue-700">Tarif per Jam</label>
            <p className="text-sm mt-1 font-medium">Rp {talent.hourly_rate?.toLocaleString()}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-blue-700">Pengalaman</label>
            <p className="text-sm mt-1">{talent.experience_years} tahun</p>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="text-sm font-medium text-blue-700 block mb-2">Layanan yang Ditawarkan</label>
          <div className="flex flex-wrap gap-1">
            {talent.services?.map((service, index) => (
              <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                {service}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-blue-700 block mb-2">Bahasa yang Dikuasai</label>
          <div className="flex flex-wrap gap-1">
            {talent.languages?.map((language, index) => (
              <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                {language}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-blue-700 block mb-2">Minat/Hobi</label>
          <div className="flex flex-wrap gap-1">
            {talent.interests?.map((interest, index) => (
              <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Document Status */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-3 text-yellow-900">📄 Status Dokumen</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-yellow-700">Foto KTP</label>
            <p className="text-sm mt-1">
              {talent.has_id_card ? 
                <Badge className="bg-green-100 text-green-700">✅ Sudah Upload</Badge> : 
                <Badge className="bg-red-100 text-red-700">❌ Belum Upload</Badge>
              }
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-yellow-700">Foto Profil</label>
            <p className="text-sm mt-1">
              {talent.has_profile_photo ? 
                <Badge className="bg-green-100 text-green-700">✅ Sudah Upload</Badge> : 
                <Badge className="bg-red-100 text-red-700">❌ Belum Upload</Badge>
              }
            </p>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-3 text-purple-900">📝 Informasi Tambahan</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-purple-700">Mode Transportasi</label>
            <p className="text-sm mt-1">{talent.transportation_mode || 'Tidak diisi'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-purple-700">Kontak Darurat</label>
            <p className="text-sm mt-1">{talent.emergency_contact || 'Tidak diisi'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-purple-700">Nomor Darurat</label>
            <p className="text-sm mt-1">{talent.emergency_phone || 'Tidak diisi'}</p>
          </div>
        </div>
        
        {talent.availability && talent.availability.length > 0 && (
          <div className="mt-4">
            <label className="text-sm font-medium text-purple-700 block mb-2">Ketersediaan</label>
            <div className="flex flex-wrap gap-1">
              {talent.availability.map((avail, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {avail}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TalentApprovalCard;
