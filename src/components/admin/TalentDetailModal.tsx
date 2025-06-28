
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  User, Mail, Phone, MapPin, Calendar, Clock, Star, 
  CreditCard, Users, Shield, Car, Heart, Languages,
  AlertTriangle, CheckCircle, XCircle, Eye, UserCheck, UserX
} from 'lucide-react';

interface TalentData {
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

interface TalentDetailModalProps {
  talent: TalentData | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const TalentDetailModal: React.FC<TalentDetailModalProps> = ({
  talent,
  isOpen,
  onClose,
  onApprove,
  onReject
}) => {
  if (!talent) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-600"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-600"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-600"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-600">Unknown</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="w-6 h-6" />
            Detail Lengkap Talent: {talent.full_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status & Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">Status Verifikasi:</div>
              {getStatusBadge(talent.verification_status)}
            </div>
            {talent.verification_status === 'pending' && (
              <div className="flex gap-2">
                <Button
                  onClick={() => onApprove?.(talent.id)}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Setujui
                </Button>
                <Button
                  onClick={() => onReject?.(talent.id)}
                  variant="destructive"
                >
                  <UserX className="w-4 h-4 mr-2" />
                  Tolak
                </Button>
              </div>
            )}
          </div>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informasi Pribadi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Email:</span>
                    <span>{talent.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Nomor HP:</span>
                    <span>{talent.phone || 'Tidak diisi'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Usia:</span>
                    <span>{talent.age || 'Tidak diisi'} tahun</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Lokasi:</span>
                    <span>{talent.location || 'Tidak diisi'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Pengalaman:</span>
                    <span>{talent.experience_years || 0} tahun</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Transportasi:</span>
                    <span>{talent.transportation_mode || 'Tidak diisi'}</span>
                  </div>
                </div>
              </div>
              
              {talent.bio && (
                <div className="mt-4">
                  <div className="font-medium mb-2">Bio:</div>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{talent.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Service Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Informasi Layanan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="font-medium mb-2">Layanan yang Ditawarkan:</div>
                  <div className="flex flex-wrap gap-1">
                    {talent.services && talent.services.length > 0 ? (
                      talent.services.map((service, index) => (
                        <Badge key={index} variant="secondary">{service}</Badge>
                      ))
                    ) : (
                      <span className="text-gray-500">Tidak ada layanan terdaftar</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="font-medium mb-2">Tarif per Jam:</div>
                  <div className="text-lg font-bold text-green-600">
                    {talent.hourly_rate ? formatCurrency(talent.hourly_rate) : 'Belum ditentukan'}
                  </div>
                </div>
              </div>

              {talent.specialties && talent.specialties.length > 0 && (
                <div>
                  <div className="font-medium mb-2">Spesialisasi:</div>
                  <div className="flex flex-wrap gap-1">
                    {talent.specialties.map((specialty, index) => (
                      <Badge key={index} className="bg-purple-100 text-purple-600">{specialty}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills & Languages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="w-5 h-5" />
                Kemampuan & Bahasa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="font-medium mb-2">Bahasa yang Dikuasai:</div>
                  <div className="flex flex-wrap gap-1">
                    {talent.languages && talent.languages.length > 0 ? (
                      talent.languages.map((language, index) => (
                        <Badge key={index} variant="outline">{language}</Badge>
                      ))
                    ) : (
                      <span className="text-gray-500">Tidak ada bahasa terdaftar</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="font-medium mb-2">Minat & Hobi:</div>
                  <div className="flex flex-wrap gap-1">
                    {talent.interests && talent.interests.length > 0 ? (
                      talent.interests.map((interest, index) => (
                        <Badge key={index} className="bg-blue-100 text-blue-600">{interest}</Badge>
                      ))
                    ) : (
                      <span className="text-gray-500">Tidak ada minat terdaftar</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Availability & Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Ketersediaan & Kontak Darurat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="font-medium mb-2">Ketersediaan:</div>
                  <div className="flex flex-wrap gap-1">
                    {talent.availability && talent.availability.length > 0 ? (
                      talent.availability.map((day, index) => (
                        <Badge key={index} className="bg-green-100 text-green-600">{day}</Badge>
                      ))
                    ) : (
                      <span className="text-gray-500">Ketersediaan belum ditentukan</span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="font-medium">Kontak Darurat:</div>
                    <div className="text-sm text-gray-600">
                      {talent.emergency_contact || 'Tidak diisi'}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Nomor Darurat:</div>
                    <div className="text-sm text-gray-600">
                      {talent.emergency_phone || 'Tidak diisi'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Status Dokumen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">KTP/ID Card:</span>
                  {talent.has_id_card ? (
                    <Badge className="bg-green-100 text-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Sudah Upload
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-600">
                      <XCircle className="w-3 h-3 mr-1" />
                      Belum Upload
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Foto Profil:</span>
                  {talent.has_profile_photo ? (
                    <Badge className="bg-green-100 text-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Sudah Upload
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-600">
                      <XCircle className="w-3 h-3 mr-1" />
                      Belum Upload
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Document Links if available */}
              {(talent.id_card_url || talent.profile_photo_url) && (
                <div className="mt-4 space-y-2">
                  {talent.id_card_url && (
                    <div>
                      <Button variant="outline" size="sm" onClick={() => window.open(talent.id_card_url, '_blank')}>
                        <Eye className="w-3 h-3 mr-1" />
                        Lihat KTP
                      </Button>
                    </div>
                  )}
                  {talent.profile_photo_url && (
                    <div>
                      <Button variant="outline" size="sm" onClick={() => window.open(talent.profile_photo_url, '_blank')}>
                        <Eye className="w-3 h-3 mr-1" />
                        Lihat Foto Profil
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Registration Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Informasi Pendaftaran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                <div>Tanggal Pendaftaran: {new Date(talent.created_at).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</div>
                <div>ID Talent: {talent.id}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TalentDetailModal;
