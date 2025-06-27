import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Clock, Mail, Phone, User, FileText, Eye, Calendar, MapPin, RefreshCw, AlertCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TalentApplication {
  id: string;
  name: string;
  full_name: string;
  email: string;
  phone: string;
  age: number;
  location: string;
  bio: string;
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
}

const TalentRegistrationManagement = () => {
  const [applications, setApplications] = useState<TalentApplication[]>([]);
  const [allUsers, setAllUsers] = useState<TalentApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<TalentApplication | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTalentApplications();
    setupRealTimeUpdates();
  }, []);

  const fetchTalentApplications = async () => {
    try {
      console.log('Fetching talent applications...');
      setRefreshing(true);
      setConnectionError(null);
      
      // Try admin function first
      try {
        const { data: adminResponse, error: adminError } = await supabase.functions.invoke('admin-get-users', {
          body: {}
        });

        if (adminError) {
          console.error('Admin function error:', adminError);
          throw adminError;
        }

        console.log('Admin function response:', adminResponse);

        if (adminResponse?.success && adminResponse?.users) {
          const allUsers = adminResponse.users;
          console.log(`Total users fetched via admin function: ${allUsers.length}`);
          
          // Filter for companion/talent users
          const talentUsers = allUsers.filter((user: any) => user.user_type === 'companion');
          console.log(`Talent users found: ${talentUsers.length}`);
          
          setAllUsers(allUsers);
          setApplications(talentUsers);
          return;
        } else if (!adminResponse?.success) {
          throw new Error('Admin function returned unsuccessful response');
        }
      } catch (adminError) {
        console.log('Admin function failed, trying direct query...');
        
        // Fallback to direct query
        const { data: profiles, error: directError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (directError) {
          console.error('Direct query error:', directError);
          throw directError;
        }

        const allUsers = profiles || [];
        const talentUsers = allUsers.filter((user: any) => user.user_type === 'companion');
        
        console.log(`Total users fetched via direct query: ${allUsers.length}`);
        console.log(`Talent users found: ${talentUsers.length}`);
        
        setAllUsers(allUsers);
        setApplications(talentUsers);
        setConnectionError('Using direct database access (RLS may limit results)');
      }

    } catch (error) {
      console.error('Error fetching talent applications:', error);
      setConnectionError(error.message || 'Failed to fetch talent applications');
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
          table: 'profiles'
        },
        (payload) => {
          console.log('Real-time update received for profiles:', payload);
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
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          verification_status: verificationStatus,
          status: profileStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (error) throw error;

      // Send notification
      await sendApprovalNotification(applicationId, approved);

      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, verification_status: verificationStatus as any, status: profileStatus }
            : app
        )
      );
      
      toast({
        title: approved ? "Talent Disetujui" : "Talent Ditolak",
        description: `Pendaftaran talent telah ${approved ? 'disetujui' : 'ditolak'} dan notifikasi telah dikirim.`,
        className: approved ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
      });
    } catch (error) {
      console.error('Error updating talent status:', error);
      toast({
        title: "Error",
        description: "Gagal mengupdate status talent",
        variant: "destructive"
      });
    }
  };

  const sendApprovalNotification = async (applicationId: string, approved: boolean) => {
    try {
      await supabase.functions.invoke('send-approval-notification', {
        body: { userId: applicationId, approved }
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const getStatusBadge = (status: string, verificationStatus: string) => {
    if (verificationStatus === 'pending') {
      return <Badge className="bg-yellow-100 text-yellow-600">Menunggu Review</Badge>;
    }
    if (verificationStatus === 'verified') {
      return <Badge className="bg-green-100 text-green-600">Disetujui</Badge>;
    }
    if (verificationStatus === 'rejected') {
      return <Badge className="bg-red-100 text-red-600">Ditolak</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-600">Unknown</Badge>;
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
  const allApplications = applications;

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
            <div className="text-2xl font-bold text-blue-600">{allApplications.length}</div>
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
            <div className="text-2xl font-bold text-green-600">
              {applications.filter(app => app.verification_status === 'verified').length}
            </div>
            <p className="text-xs text-muted-foreground">Talent yang disetujui</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Semua User</CardTitle>
            <AlertCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{allUsers.length}</div>
            <p className="text-xs text-muted-foreground">Semua user di sistem</p>
          </CardContent>
        </Card>
      </div>

      {/* Connection Status */}
      <Card className={connectionError ? "bg-yellow-50 border-yellow-200" : "bg-blue-50 border-blue-200"}>
        <CardHeader>
          <CardTitle className={`text-sm font-medium ${connectionError ? 'text-yellow-800' : 'text-blue-800'}`}>
            {connectionError ? '⚠️ Connection Warning' : 'Admin Function Status & Debug Info'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-sm ${connectionError ? 'text-yellow-700' : 'text-blue-700'} space-y-2`}>
            <p><strong>Status:</strong> {connectionError || 'Loaded via Admin Function'}</p>
            <p><strong>Total users loaded:</strong> {allUsers.length}</p>
            <p><strong>Talent applications:</strong> {allApplications.length}</p>
            <p><strong>Pending applications:</strong> {pendingApplications.length}</p>
            {connectionError && (
              <p className="text-yellow-600">
                <AlertTriangle className="inline w-4 h-4 mr-1" />
                Edge function may not be deployed. Using fallback method.
              </p>
            )}
            
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
            Pendaftaran Talent ({allApplications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {allApplications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg font-medium">Belum ada pendaftaran talent yang ditemukan.</p>
              <div className="mt-4 text-sm space-y-2">
                <p>Sistem telah terhubung dengan database.</p>
                {connectionError && (
                  <p className="text-yellow-600">
                    If you expect talent data, please check your Supabase edge functions deployment.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data Talent</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead>Lokasi & Usia</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal Daftar</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{application.name || application.full_name}</div>
                          <div className="text-sm text-gray-500">ID: {application.id.slice(0, 8)}...</div>
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
                              onClick={() => setSelectedApplication(application)}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Detail
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Detail Pendaftaran Talent</DialogTitle>
                            </DialogHeader>
                            {selectedApplication && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Nama Lengkap</label>
                                    <p className="text-sm">{selectedApplication.name || selectedApplication.full_name}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Email</label>
                                    <p className="text-sm">{selectedApplication.email}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Nomor Telepon</label>
                                    <p className="text-sm">{selectedApplication.phone}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Usia</label>
                                    <p className="text-sm">{selectedApplication.age} tahun</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Lokasi</label>
                                    <p className="text-sm">{selectedApplication.location}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Pengalaman</label>
                                    <p className="text-sm">{selectedApplication.experience_years} tahun</p>
                                  </div>
                                </div>

                                {selectedApplication.bio && (
                                  <div>
                                    <label className="text-sm font-medium">Bio</label>
                                    <p className="text-sm">{selectedApplication.bio}</p>
                                  </div>
                                )}

                                {selectedApplication.specialties && (
                                  <div>
                                    <label className="text-sm font-medium">Keahlian</label>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {selectedApplication.specialties.map((specialty, index) => (
                                        <Badge key={index} variant="secondary">{specialty}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {selectedApplication.id_card_url && (
                                  <div>
                                    <label className="text-sm font-medium">Foto KTP</label>
                                    <div className="mt-2">
                                      <img 
                                        src={selectedApplication.id_card_url} 
                                        alt="ID Card" 
                                        className="max-w-full h-48 object-contain border rounded"
                                      />
                                    </div>
                                  </div>
                                )}

                                {selectedApplication.photo_url && (
                                  <div>
                                    <label className="text-sm font-medium">Foto Profil</label>
                                    <div className="mt-2">
                                      <img 
                                        src={selectedApplication.photo_url} 
                                        alt="Profile" 
                                        className="w-24 h-24 object-cover rounded-full border"
                                      />
                                    </div>
                                  </div>
                                )}

                                {selectedApplication.verification_status === 'pending' && (
                                  <div className="flex gap-2 pt-4 border-t">
                                    <Button
                                      className="bg-green-500 hover:bg-green-600"
                                      onClick={() => handleApproval(selectedApplication.id, true)}
                                    >
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Setujui Talent
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleApproval(selectedApplication.id, false)}
                                    >
                                      <XCircle className="w-4 h-4 mr-1" />
                                      Tolak Talent
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {application.verification_status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-500 hover:bg-green-600"
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
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TalentRegistrationManagement;
