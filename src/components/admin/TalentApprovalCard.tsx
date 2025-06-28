
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, Mail, Phone, MapPin, Calendar, Clock, Star, 
  CreditCard, Users, Shield, Car, Heart, Languages,
  AlertTriangle, CheckCircle, XCircle, Eye, UserCheck, UserX
} from 'lucide-react';
import TalentDetailModal from './TalentDetailModal';

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

interface TalentApprovalCardProps {
  talent: TalentData;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const TalentApprovalCard: React.FC<TalentApprovalCardProps> = ({
  talent,
  onApprove,
  onReject
}) => {
  const [showDetailModal, setShowDetailModal] = useState(false);

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

  // Check data completeness
  const requiredFields = [
    talent.full_name,
    talent.email,
    talent.phone,
    talent.age,
    talent.location,
    talent.bio,
    talent.hourly_rate,
    talent.services?.length > 0,
    talent.has_id_card,
    talent.has_profile_photo
  ];
  const completedFields = requiredFields.filter(Boolean).length;
  const completionPercentage = Math.round((completedFields / requiredFields.length) * 100);

  return (
    <>
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {talent.full_name || 'Nama tidak tersedia'}
            </CardTitle>
            <div className="flex items-center gap-2">
              {getStatusBadge(talent.verification_status)}
              <Badge variant="outline" className="text-xs">
                {completionPercentage}% Lengkap
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Email:</span>
                <span className="text-gray-700">{talent.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="font-medium">HP:</span>
                <span className="text-gray-700">{talent.phone || 'Tidak diisi'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Usia:</span>
                <span className="text-gray-700">{talent.age || 'Tidak diisi'} tahun</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Lokasi:</span>
                <span className="text-gray-700">{talent.location || 'Tidak diisi'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Tarif:</span>
                <span className="text-gray-700 font-semibold">
                  {talent.hourly_rate ? formatCurrency(talent.hourly_rate) : 'Belum ditentukan'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Pengalaman:</span>
                <span className="text-gray-700">{talent.experience_years || 0} tahun</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Car className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Transportasi:</span>
                <span className="text-gray-700">{talent.transportation_mode || 'Tidak diisi'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Kontak Darurat:</span>
                <span className="text-gray-700">{talent.emergency_contact || 'Tidak diisi'}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Services & Skills */}
          <div className="space-y-3">
            <div>
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Layanan yang Ditawarkan:
              </div>
              <div className="flex flex-wrap gap-1">
                {talent.services && talent.services.length > 0 ? (
                  talent.services.map((service, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">{service}</Badge>
                  ))
                ) : (
                  <span className="text-sm text-red-500">Belum ada layanan terdaftar</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Languages className="w-4 h-4" />
                  Bahasa:
                </div>
                <div className="flex flex-wrap gap-1">
                  {talent.languages && talent.languages.length > 0 ? (
                    talent.languages.slice(0, 3).map((language, index) => (
                      <Badge key={index} variant="outline" className="text-xs">{language}</Badge>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">Tidak ada</span>
                  )}
                  {talent.languages && talent.languages.length > 3 && (
                    <Badge variant="outline" className="text-xs">+{talent.languages.length - 3}</Badge>
                  )}
                </div>
              </div>

              <div>
                <div className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Minat:
                </div>
                <div className="flex flex-wrap gap-1">
                  {talent.interests && talent.interests.length > 0 ? (
                    talent.interests.slice(0, 3).map((interest, index) => (
                      <Badge key={index} className="bg-blue-100 text-blue-600 text-xs">{interest}</Badge>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">Tidak ada</span>
                  )}
                  {talent.interests && talent.interests.length > 3 && (
                    <Badge className="bg-blue-100 text-blue-600 text-xs">+{talent.interests.length - 3}</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Document Status */}
          <div className="space-y-2">
            <div className="font-medium text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Status Dokumen:
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">KTP:</span>
                {talent.has_id_card ? (
                  <Badge className="bg-green-100 text-green-600 text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    OK
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-600 text-xs">
                    <XCircle className="w-3 h-3 mr-1" />
                    Belum
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Foto:</span>
                {talent.has_profile_photo ? (
                  <Badge className="bg-green-100 text-green-600 text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    OK
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-600 text-xs">
                    <XCircle className="w-3 h-3 mr-1" />
                    Belum
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Bio Preview */}
          {talent.bio && (
            <div>
              <div className="font-medium text-sm mb-2">Bio:</div>
              <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                {talent.bio.length > 150 ? `${talent.bio.substring(0, 150)}...` : talent.bio}
              </p>
            </div>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              Terdaftar: {new Date(talent.created_at).toLocaleDateString('id-ID')}
            </div>
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setShowDetailModal(true)}
                className="flex items-center gap-1"
              >
                <Eye className="w-3 h-3" />
                Detail Lengkap
              </Button>
              
              {talent.verification_status === 'pending' && (
                <>
                  <Button
                    size="sm"
                    className="bg-green-500 hover:bg-green-600"
                    onClick={() => onApprove(talent.id)}
                  >
                    <UserCheck className="w-3 h-3 mr-1" />
                    Setujui
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onReject(talent.id)}
                  >
                    <UserX className="w-3 h-3 mr-1" />
                    Tolak
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <TalentDetailModal
        talent={talent}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onApprove={onApprove}
        onReject={onReject}
      />
    </>
  );
};

export default TalentApprovalCard;
