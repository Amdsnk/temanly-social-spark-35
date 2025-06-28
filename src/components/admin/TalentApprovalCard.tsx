
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Eye, Mail, Phone, MapPin, Calendar, User, FileText, Camera, CreditCard, Car, UserCheck, Clock, Heart, Globe, Briefcase } from 'lucide-react';

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
  specialties?: string[];
}

interface TalentApprovalCardProps {
  talent: TalentRegistrationData;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const TalentApprovalCard: React.FC<TalentApprovalCardProps> = ({ talent, onApprove, onReject }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'verified': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'verified': return '✅';
      case 'rejected': return '❌';
      default: return '❓';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Menunggu Review';
      case 'verified': return 'Disetujui';
      case 'rejected': return 'Ditolak';
      default: return 'Unknown';
    }
  };

  return (
    <Card className="mb-4 border-l-4 border-l-blue-500">
      <CardHeader className="bg-gray-50">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <CardTitle className="text-xl text-blue-900">{talent.full_name}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              <span>{talent.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{talent.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Daftar: {new Date(talent.created_at).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
          </div>
          <Badge className={`px-3 py-1 ${getStatusColor(talent.verification_status)}`}>
            {getStatusIcon(talent.verification_status)} {getStatusText(talent.verification_status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-blue-600" />
            <div>
              <span className="text-gray-500">Usia:</span>
              <div className="font-medium">{talent.age} tahun</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-green-600" />
            <div>
              <span className="text-gray-500">Lokasi:</span>
              <div className="font-medium">{talent.location}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CreditCard className="w-4 h-4 text-purple-600" />
            <div>
              <span className="text-gray-500">Tarif:</span>
              <div className="font-medium">Rp {talent.hourly_rate?.toLocaleString()}/jam</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Briefcase className="w-4 h-4 text-orange-600" />
            <div>
              <span className="text-gray-500">Pengalaman:</span>
              <div className="font-medium">{talent.experience_years} tahun</div>
            </div>
          </div>
        </div>

        {/* Services Preview */}
        <div className="mb-4">
          <h4 className="font-medium mb-2 text-gray-800">Layanan yang Ditawarkan:</h4>
          <div className="flex flex-wrap gap-1">
            {talent.services?.slice(0, 3).map((service, index) => (
              <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {service}
              </Badge>
            ))}
            {talent.services?.length > 3 && (
              <Badge variant="outline" className="bg-gray-50 text-gray-600">
                +{talent.services.length - 3} lainnya
              </Badge>
            )}
          </div>
        </div>

        {/* Document Status */}
        <div className="mb-4">
          <h4 className="font-medium mb-2 text-gray-800">Status Dokumen:</h4>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="text-sm">KTP:</span>
              <Badge className={talent.has_id_card ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}>
                {talent.has_id_card ? '✅ Sudah Upload' : '❌ Belum Upload'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              <span className="text-sm">Foto:</span>
              <Badge className={talent.has_profile_photo ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}>
                {talent.has_profile_photo ? '✅ Sudah Upload' : '❌ Belum Upload'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Transport & Emergency Info */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-gray-600" />
              <span className="text-gray-500">Transportasi:</span>
              <span className="font-medium">{talent.transportation_mode || 'Tidak diisi'}</span>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-gray-600" />
              <span className="text-gray-500">Kontak Darurat:</span>
              <span className="font-medium">{talent.emergency_contact || 'Tidak diisi'}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-between">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Detail Lengkap
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">📋 Detail Lengkap Pendaftaran Talent</DialogTitle>
              </DialogHeader>
              <TalentDetailView talent={talent} />
            </DialogContent>
          </Dialog>

          {talent.verification_status === 'pending' && (
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                onClick={() => onApprove(talent.id)}
              >
                <CheckCircle className="w-4 h-4" />
                Setujui
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="flex items-center gap-2"
                onClick={() => onReject(talent.id)}
              >
                <XCircle className="w-4 h-4" />
                Tolak
              </Button>
            </div>
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
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="font-bold mb-4 text-blue-900 flex items-center gap-2">
          <User className="w-5 h-5" />
          Informasi Personal
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-semibold text-blue-800">Nama Lengkap</label>
              <p className="text-sm mt-1 p-2 bg-white rounded border">{talent.full_name}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-blue-800">Email</label>
              <p className="text-sm mt-1 p-2 bg-white rounded border">{talent.email}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-blue-800">Nomor WhatsApp</label>
              <p className="text-sm mt-1 p-2 bg-white rounded border">{talent.phone}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-semibold text-blue-800">Usia</label>
              <p className="text-sm mt-1 p-2 bg-white rounded border">{talent.age} tahun</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-blue-800">Lokasi/Kota</label>
              <p className="text-sm mt-1 p-2 bg-white rounded border">{talent.location}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-blue-800">Tanggal Daftar</label>
              <p className="text-sm mt-1 p-2 bg-white rounded border">
                {new Date(talent.created_at).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
        
        {talent.bio && (
          <div className="mt-4">
            <label className="text-sm font-semibold text-blue-800 block mb-2">Bio/Tentang Diri</label>
            <div className="bg-white p-4 rounded-lg border">
              <p className="text-sm leading-relaxed">{talent.bio}</p>
            </div>
          </div>
        )}
      </div>

      {/* Service Information */}
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h3 className="font-bold mb-4 text-green-900 flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Informasi Layanan & Profesional
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-semibold text-green-800">Tarif per Jam</label>
              <p className="text-lg font-bold mt-1 p-2 bg-white rounded border text-green-700">
                Rp {talent.hourly_rate?.toLocaleString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-green-800">Pengalaman Kerja</label>
              <p className="text-sm mt-1 p-2 bg-white rounded border">{talent.experience_years} tahun</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-semibold text-green-800">Mode Transportasi</label>
              <p className="text-sm mt-1 p-2 bg-white rounded border capitalize">{talent.transportation_mode || 'Tidak diisi'}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-semibold text-green-800 block mb-2">Layanan yang Ditawarkan</label>
            <div className="flex flex-wrap gap-2">
              {talent.services?.map((service, index) => (
                <Badge key={index} className="bg-green-100 text-green-800 border-green-300 px-3 py-1">
                  {service}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-green-800 block mb-2">Bahasa yang Dikuasai</label>
            <div className="flex flex-wrap gap-2">
              {talent.languages?.map((language, index) => (
                <Badge key={index} variant="outline" className="bg-white text-green-700 border-green-300 px-3 py-1">
                  <Globe className="w-3 h-3 mr-1" />
                  {language}
                </Badge>
              ))}
            </div>
          </div>

          {talent.specialties && talent.specialties.length > 0 && (
            <div>
              <label className="text-sm font-semibold text-green-800 block mb-2">Keahlian Khusus</label>
              <div className="flex flex-wrap gap-2">
                {talent.specialties.map((specialty, index) => (
                  <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700 border-purple-300 px-3 py-1">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {talent.interests && talent.interests.length > 0 && (
            <div>
              <label className="text-sm font-semibold text-green-800 block mb-2">Minat & Hobi</label>
              <div className="flex flex-wrap gap-2">
                {talent.interests.map((interest, index) => (
                  <Badge key={index} variant="outline" className="bg-pink-50 text-pink-700 border-pink-300 px-3 py-1">
                    <Heart className="w-3 h-3 mr-1" />
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Document Verification */}
      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <h3 className="font-bold mb-4 text-yellow-900 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Status Dokumen Verifikasi
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-yellow-800">Foto KTP/Identitas</label>
                <Badge className={talent.has_id_card ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                  {talent.has_id_card ? '✅ Sudah Upload' : '❌ Belum Upload'}
                </Badge>
              </div>
              {talent.id_card_url && (
                <div className="mt-2">
                  <img 
                    src={talent.id_card_url} 
                    alt="KTP" 
                    className="w-full h-32 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-yellow-800">Foto Profil</label>
                <Badge className={talent.has_profile_photo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                  {talent.has_profile_photo ? '✅ Sudah Upload' : '❌ Belum Upload'}
                </Badge>
              </div>
              {talent.profile_photo_url && (
                <div className="mt-2">
                  <img 
                    src={talent.profile_photo_url} 
                    alt="Profile" 
                    className="w-full h-32 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency & Additional Info */}
      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
        <h3 className="font-bold mb-4 text-purple-900 flex items-center gap-2">
          <UserCheck className="w-5 h-5" />
          Informasi Kontak Darurat & Ketersediaan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-semibold text-purple-800">Nama Kontak Darurat</label>
              <p className="text-sm mt-1 p-2 bg-white rounded border">{talent.emergency_contact || 'Tidak diisi'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-purple-800">Nomor Kontak Darurat</label>
              <p className="text-sm mt-1 p-2 bg-white rounded border">{talent.emergency_phone || 'Tidak diisi'}</p>
            </div>
          </div>
        </div>
        
        {talent.availability && talent.availability.length > 0 && (
          <div className="mt-4">
            <label className="text-sm font-semibold text-purple-800 block mb-2">Ketersediaan Waktu</label>
            <div className="flex flex-wrap gap-2">
              {talent.availability.map((avail, index) => (
                <Badge key={index} variant="outline" className="bg-white text-purple-700 border-purple-300 px-3 py-1">
                  <Clock className="w-3 h-3 mr-1" />
                  {avail}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Admin Notes Section */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="font-bold mb-4 text-gray-900">📝 Catatan Admin</h3>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            <strong>Status Verifikasi:</strong> {talent.verification_status === 'pending' ? 'Menunggu Review' : talent.verification_status === 'verified' ? 'Telah Disetujui' : 'Ditolak'}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Kelengkapan Dokumen:</strong> {talent.has_id_card && talent.has_profile_photo ? 'Lengkap ✅' : 'Tidak Lengkap ❌'}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Total Layanan:</strong> {talent.services?.length || 0} layanan
          </p>
        </div>
      </div>
    </div>
  );
};

export default TalentApprovalCard;
