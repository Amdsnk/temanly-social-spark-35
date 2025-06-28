
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, Calendar, MapPin, CreditCard, Shield, Clock } from 'lucide-react';
import { AdminUser } from '@/services/adminUserService';

interface UserDetailModalProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, isOpen, onClose }) => {
  if (!user) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getUserTypeBadge = (userType: string) => {
    switch (userType) {
      case 'companion':
        return <Badge className="bg-purple-100 text-purple-600">Talent</Badge>;
      case 'admin':
        return <Badge className="bg-red-100 text-red-600">Admin</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-600">User</Badge>;
    }
  };

  const getStatusBadge = (status: string, authOnly: boolean) => {
    if (authOnly) {
      return <Badge className="bg-orange-100 text-orange-600">Auth Only</Badge>;
    }
    
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-600">Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-600">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-600">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-600">Unknown</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Detail User: {user.name || 'No name'}
          </DialogTitle>
          <DialogDescription>
            Informasi lengkap pengguna dalam sistem
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informasi Dasar</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Email:</span>
                  <span>{user.email}</span>
                </div>
                
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Telepon:</span>
                    <span>{user.phone}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Terdaftar:</span>
                  <span>{new Date(user.created_at).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Tipe User:</span>
                  {getUserTypeBadge(user.user_type)}
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Status:</span>
                  {getStatusBadge(user.verification_status, user.auth_only)}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="font-medium">ID:</span>
                  <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {user.id}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Profile Information (for talents) */}
          {user.user_type === 'companion' && user.has_profile && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informasi Talent</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.age && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Usia:</span>
                    <span>{user.age} tahun</span>
                  </div>
                )}
                
                {user.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Lokasi:</span>
                    <span>{user.location}</span>
                  </div>
                )}
                
                {user.hourly_rate && (
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Tarif per Jam:</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(user.hourly_rate)}
                    </span>
                  </div>
                )}
              </div>
              
              {user.bio && (
                <div>
                  <span className="font-medium">Bio:</span>
                  <p className="mt-1 text-gray-600 bg-gray-50 p-3 rounded">
                    {user.bio}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Account Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Status Akun</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="font-medium">Data Source:</span>
                <div className="mt-1">
                  {user.has_profile && user.auth_only ? (
                    <Badge variant="secondary">Auth + Profile</Badge>
                  ) : user.has_profile ? (
                    <Badge className="bg-green-100 text-green-600">Profile Only</Badge>
                  ) : (
                    <Badge className="bg-orange-100 text-orange-600">Auth Only</Badge>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="font-medium">Account Status:</span>
                <div className="mt-1">
                  <Badge className={
                    user.status === 'active' 
                      ? "bg-green-100 text-green-600" 
                      : "bg-gray-100 text-gray-600"
                  }>
                    {user.status || 'Unknown'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Data (if available) */}
          {user.profile_data && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Data Profile Tambahan</h3>
              <div className="bg-gray-50 p-3 rounded">
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(JSON.parse(user.profile_data), null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* System Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informasi Sistem</h3>
            
            <div className="text-sm space-y-2">
              <div><strong>Created:</strong> {new Date(user.created_at).toLocaleString('id-ID')}</div>
              {user.updated_at && (
                <div><strong>Last Updated:</strong> {new Date(user.updated_at).toLocaleString('id-ID')}</div>
              )}
              <div><strong>Has Profile:</strong> {user.has_profile ? 'Yes' : 'No'}</div>
              <div><strong>Auth Only:</strong> {user.auth_only ? 'Yes' : 'No'}</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailModal;
