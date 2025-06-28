import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Clock, Mail, Phone, User, FileText, Eye, Calendar, MapPin, RefreshCw, AlertCircle, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { adminUserService, AdminUser } from '@/services/adminUserService';

interface TalentApplication {
  id: string;
  name: string;
  full_name: string;
  email: string;
  phone: string;
  age: number | null;
  location: string | null;
  bio: string | null;
  verification_status: 'pending' | 'verified' | 'rejected';
  status: string;
  created_at: string;
  updated_at: string;
  id_card_url?: string;
  photo_url?: string;
  experience_years?: number;
  hourly_rate?: number;
  specialties?: string[];
  languages?: string[];
  user_type: string;
  profile_data?: string;
  auth_only: boolean;
  has_profile: boolean;
}

const TalentRegistrationManagement = () => {
  const [applications, setApplications] = useState<TalentApplication[]>([]);
  const [allUsers, setAllUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<TalentApplication | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchTalentApplications();
    setupRealTimeUpdates();
  }, []);

  const transformAdminUserToTalentApplication = (user: AdminUser): TalentApplication => {
    return {
      id: user.id,
      name: user.name || user.full_name || 'No Name',
      full_name: user.full_name || user.name || '',
      email: user.email,
      phone: user.phone || '',
      age: null, // Will be populated from profile data if available
      location: null, // Will be populated from profile data if available
      bio: null, // Will be populated from profile data if available
      verification_status: user.verification_status,
      status: user.status,
      created_at: user.created_at,
      updated_at: user.updated_at || user.created_at,
      user_type: user.user_type,
      profile_data: null,
      auth_only: user.auth_only,
      has_profile: user.has_profile
    };
  };

  const fetchTalentApplications = async () => {
    try {
      console.log('🔍 Fetching talent applications...');
      setRefreshing(true);
      setConnectionStatus('Connecting to database...');
      
      // Get all users using the admin service which includes both Auth and Profile data
      const { users, error } = await adminUserService.getAllUsers();
      
      if (error) {
        throw new Error(error);
      }

      console.log('📊 All users data:', users);
      
      // Filter for talent users (companions) - including both auth-only and profile users
      const talentUsers = users.filter((user: AdminUser) => 
        user.user_type === 'companion'
      );
      
      console.log(`✅ Total users fetched: ${users.length}`);
      console.log(`✅ Talent users found: ${talentUsers.length}`);
      console.log('📋 Talent users details:', talentUsers);
      
      // Transform the data to match our interface
      const transformedTalents = talentUsers.map(transformAdminUserToTalentApplication);
      
      setAllUsers(users);
      setApplications(transformedTalents);
      setConnectionStatus(`Successfully loaded ${users.length} total users, ${transformedTalents.length} talents`);

    } catch (error: any) {
      console.error('❌ Error fetching talent applications:', error);
      setConnectionStatus(`Error: ${error.message}`);
      toast({
        title: "Error",
        description: "Gagal memuat data pendaftaran talent. Coba lagi atau periksa koneksi.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const setupRealTimeUpdates = () => {
    const channel = supabase
      .channel('talent-applications-admin')
      .on('postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'profiles',
          filter: 'user_type=eq.companion'
        },
        (payload) => {
          console.log('🔄 Real-time update received for talent profiles:', payload);
          fetchTalentApplications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleApproval = async (applicationId: string, approved: boolean) => {
    try {
      const verificationStatus = approved ? 'verified' : 'rejected';
      const profileStatus = approved ? 'active' : 'suspended';
      
      console.log(`${approved ? '✅' : '❌'} Processing approval for talent:`, applicationId);
      
      // First, check if user has a profile
      const userToUpdate = applications.find(app => app.id === applicationId);
      
      if (!userToUpdate) {
        throw new Error('User not found');
      }
      
      if (userToUpdate.auth_only && !userToUpdate.has_profile) {
        // User is auth-only, need to create profile first
        const adminUser = allUsers.find(u => u.id === applicationId);
        if (adminUser) {
          await adminUserService.createMissingProfiles([adminUser]);
          console.log('✅ Created profile for auth-only user');
        }
      }
      
      // Now update the profile
      const { error } = await supabase
        .from('profiles')
        .update({ 
          verification_status: verificationStatus,
          status: profileStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (error) {
        console.error('❌ Error updating talent status:', error);
        throw error;
      }

      // Send notification
      await sendApprovalNotification(applicationId, approved);

      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, verification_status: verificationStatus as any, status: profileStatus, auth_only: false, has_profile: true }
            : app
        )
      );
      
      toast({
        title: approved ? "✅ Talent Disetujui" : "❌ Talent Ditolak",
        description: `Pendaftaran talent telah ${approved ? 'disetujui' : 'ditolak'} dan notifikasi telah dikirim.`,
        className: approved ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
      });

      // Refresh data to get latest
      setTimeout(() => fetchTalentApplications(), 1000);
      
    } catch (error: any) {
      console.error('❌ Error updating talent status:', error);
      toast({
        title: "Error",
        description: "Gagal mengupdate status talent: " + error.message,
        variant: "destructive"
      });
    }
  };

  const sendApprovalNotification = async (applicationId: string, approved: boolean) => {
    try {
      console.log('📧 Sending approval notification...');
      const { error } = await supabase.functions.invoke('send-approval-notification', {
        body: { userId: applicationId, approved }
      });
      
      if (error) {
        console.error('❌ Error sending notification:', error);
        throw error;
      }
      
      console.log('✅ Notification sent successfully');
    } catch (error) {
      console.error('❌ Error sending notification:', error);
      // Don't throw error here as the main approval still succeeded
    }
  };

  const getStatusBadge = (status: string, verificationStatus: string) => {
    if (verificationStatus === 'pending') {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">⏳ Menunggu Review</Badge>;
    }
    if (verificationStatus === 'verified') {
      return <Badge className="bg-green-100 text-green-800 border-green-300">✅ Disetujui</Badge>;
    }
    if (verificationStatus === 'rejected') {
      return <Badge className="bg-red-100 text-red-800 border-red-300">❌ Ditolak</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-600">❓ Unknown</Badge>;
  };

  const parseProfileData = (profileData: string | null) => {
    if (!profileData) return null;
    try {
      return JSON.parse(profileData);
    } catch (error) {
      console.warn('⚠️ Failed to parse profile data:', error);
      return null;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Memuat data pendaftaran talent...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const pendingApplications = applications.filter(app => app.verification_status === 'pending');
  const approvedApplications = applications.filter(app => app.verification_status === 'verified');
  const rejectedApplications = applications.filter(app => app.verification_status === 'rejected');

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendaftaran</CardTitle>
            <User className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{applications.length}</div>
            <p className="text-xs text-muted-foreground">Semua pendaftaran talent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menunggu Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingApplications.length}</div>
            <p className="text-xs text-muted-foreground">Perlu persetujuan admin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Talent Aktif</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedApplications.length}</div>
            <p className="text-xs text-muted-foreground">Talent yang disetujui</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ditolak</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedApplications.length}</div>
            <p className="text-xs text-muted-foreground">Talent yang ditolak</p>
          </CardContent>
        </Card>
      </div>

      {/* Connection Status */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2">
            <Database className="w-4 h-4" />
            Database Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-blue-700 space-y-2">
            <p><strong>Status:</strong> {connectionStatus}</p>
            <p><strong>Last Updated:</strong> {new Date().toLocaleString('id-ID')}</p>
            
            <div className="flex gap-2 mt-3">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={fetchTalentApplications}
                disabled={refreshing}
                className="flex items-center gap-1"
              >
                <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Pendaftaran Talent ({applications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">Belum ada pendaftaran talent yang ditemukan.</p>
              <div className="mt-4 text-sm space-y-2">
                <p>Sistem telah terhubung dengan database.</p>
                <p>Total users di sistem: {allUsers.length}</p>
                <p>User type 'companion' yang ditemukan: {applications.length}</p>
              </div>
              <Button 
                onClick={fetchTalentApplications} 
                className="mt-4" 
                variant="outline"
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Cek Lagi
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data Talent</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead>Lokasi & Usia</TableHead>
                  <TableHead>Services & Tarif</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal Daftar</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => {
                  const profileData = parseProfileData(application.profile_data);
                  
                  return (
                    <TableRow key={application.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <div>
                            <div className="font-medium">{application.name || application.full_name || 'No Name'}</div>
                            <div className="text-sm text-gray-500">ID: {application.id.slice(0, 8)}...</div>
                            <div className="flex gap-1 mt-1">
                              {application.auth_only && (
                                <Badge variant="outline" className="text-xs bg-orange-100 text-orange-600">Auth Only</Badge>
                              )}
                              {profileData?.hasIdCard && (
                                <Badge variant="outline" className="text-xs">📄 KTP</Badge>
                              )}
                              {profileData?.hasProfilePhoto && (
                                <Badge variant="outline" className="text-xs">📸 Foto</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="w-3 h-3" />
                            {application.email}
                          </div>
                          {application.phone && (
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="w-3 h-3" />
                              {application.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          {application.location && (
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="w-3 h-3" />
                              {application.location}
                            </div>
                          )}
                          {application.age && (
                            <div className="text-sm">
                              Usia: {application.age} tahun
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          {application.hourly_rate && (
                            <div className="text-sm font-medium">
                              Rp {application.hourly_rate.toLocaleString()}/jam
                            </div>
                          )}
                          {profileData?.services && profileData.services.length > 0 && (
                            <div className="text-xs">
                              {profileData.services.slice(0, 2).join(', ')}
                              {profileData.services.length > 2 && ` +${profileData.services.length - 2} lainnya`}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {getStatusBadge(application.status, application.verification_status)}
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-3 h-3" />
                          {new Date(application.created_at).toLocaleDateString('id-ID')}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex items-center gap-1"
                                onClick={() => {
                                  console.log('🔍 Opening detail modal for:', application.id);
                                  setSelectedApplication(application);
                                }}
                              >
                                <Eye className="w-3 h-3" />
                                Detail
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Detail Pendaftaran Talent Lengkap</DialogTitle>
                              </DialogHeader>
                              {selectedApplication && (
                                <TalentDetailView 
                                  application={selectedApplication}
                                  onApproval={handleApproval}
                                />
                              )}
                            </DialogContent>
                          </Dialog>

                          {application.verification_status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-500 hover:bg-green-600 text-white"
                                onClick={() => handleApproval(application.id, true)}
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Setujui
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleApproval(application.id, false)}
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                Tolak
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Separate component for talent detail view
const TalentDetailView = ({ 
  application, 
  onApproval 
}: { 
  application: TalentApplication; 
  onApproval: (id: string, approved: boolean) => void;
}) => {
  const profileData = application.profile_data ? JSON.parse(application.profile_data) : null;

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-3 text-gray-900">📋 Informasi Personal</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
            <p className="text-sm mt-1">{application.name || application.full_name || 'Tidak ada'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <p className="text-sm mt-1">{application.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Nomor WhatsApp</label>
            <p className="text-sm mt-1">{application.phone || 'Tidak ada'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Usia</label>
            <p className="text-sm mt-1">{application.age ? `${application.age} tahun` : 'Tidak ada'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Lokasi</label>
            <p className="text-sm mt-1">{application.location || 'Tidak ada'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Tanggal Daftar</label>
            <p className="text-sm mt-1">{new Date(application.created_at).toLocaleString('id-ID')}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Status Data</label>
            <p className="text-sm mt-1">
              {application.auth_only ? (
                <Badge className="bg-orange-100 text-orange-700">Auth Only - Belum ada Profile</Badge>
              ) : (
                <Badge className="bg-green-100 text-green-700">Profile Lengkap</Badge>
              )}
            </p>
          </div>
        </div>
        
        {application.bio && (
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700 block mb-1">Bio</label>
            <p className="text-sm bg-white p-3 rounded border">{application.bio}</p>
          </div>
        )}
      </div>

      {/* Service Information */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-3 text-blue-900">💼 Informasi Layanan</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-blue-700">Tarif per Jam</label>
            <p className="text-sm mt-1 font-medium">
              {application.hourly_rate ? `Rp ${application.hourly_rate.toLocaleString()}` : 'Belum diisi'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-blue-700">Pengalaman</label>
            <p className="text-sm mt-1">
              {profileData?.experienceYears ? `${profileData.experienceYears} tahun` : 'Belum diisi'}
            </p>
          </div>
        </div>
        
        {profileData?.services && profileData.services.length > 0 && (
          <div className="mt-4">
            <label className="text-sm font-medium text-blue-700 block mb-2">Services yang Ditawarkan</label>
            <div className="flex flex-wrap gap-1">
              {profileData.services.map((service: string, index: number) => (
                <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                  {service}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Document Status */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-3 text-yellow-900">📄 Status Dokumen</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-yellow-700">Foto KTP</label>
            <p className="text-sm mt-1">
              {profileData?.hasIdCard ? 
                <Badge className="bg-green-100 text-green-700">✅ Sudah Upload</Badge> : 
                <Badge className="bg-red-100 text-red-700">❌ Belum Upload</Badge>
              }
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-yellow-700">Foto Profil</label>
            <p className="text-sm mt-1">
              {profileData?.hasProfilePhoto ? 
                <Badge className="bg-green-100 text-green-700">✅ Sudah Upload</Badge> : 
                <Badge className="bg-red-100 text-red-700">❌ Belum Upload</Badge>
              }
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {application.verification_status === 'pending' && (
        <div className="flex gap-2 pt-4 border-t">
          <Button
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={() => onApproval(application.id, true)}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            ✅ Setujui Talent
          </Button>
          <Button
            variant="destructive"
            onClick={() => onApproval(application.id, false)}
          >
            <XCircle className="w-4 h-4 mr-2" />
            ❌ Tolak Talent
          </Button>
        </div>
      )}

      {application.verification_status === 'verified' && (
        <div className="bg-green-50 p-3 rounded border border-green-200">
          <p className="text-green-800 font-medium">✅ Talent ini sudah disetujui</p>
        </div>
      )}

      {application.verification_status === 'rejected' && (
        <div className="bg-red-50 p-3 rounded border border-red-200">
          <p className="text-red-800 font-medium">❌ Talent ini sudah ditolak</p>
        </div>
      )}
    </div>
  );
};

export default TalentRegistrationManagement;
