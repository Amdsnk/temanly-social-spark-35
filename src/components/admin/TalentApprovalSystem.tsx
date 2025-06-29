import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, CheckCircle, XCircle, User, Search, Filter, RefreshCw, AlertTriangle, FileCheck, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import TalentApprovalCard from './TalentApprovalCard';
import { adminUserService } from '@/services/adminUserService';

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

const TalentApprovalSystem = () => {
  const [talents, setTalents] = useState<TalentRegistrationData[]>([]);
  const [filteredTalents, setFilteredTalents] = useState<TalentRegistrationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchTalentRegistrations();
    setupRealTimeUpdates();
  }, []);

  useEffect(() => {
    filterTalents();
  }, [talents, searchTerm, statusFilter, serviceFilter]);

  const fetchTalentRegistrations = async () => {
    try {
      setLoading(true);
      console.log('🔍 [TalentApproval] Fetching talent registrations...');

      // Use adminUserService to get all users including auth-only users
      const { users, error } = await adminUserService.getAllUsers();
      
      if (error) {
        console.error('❌ [TalentApproval] Error fetching users:', error);
        throw new Error(error);
      }

      console.log('📊 [TalentApproval] All users received:', users.length);
      
      // Filter for companion users only
      const companionUsers = users.filter(user => user.user_type === 'companion');
      
      console.log('🎯 [TalentApproval] Companion users found:', companionUsers.length);
      console.log('👥 [TalentApproval] Companion users details:', companionUsers);

      // Transform users to talent registration data
      const transformedTalents: TalentRegistrationData[] = companionUsers.map(user => {
        let profileData = null;
        
        // Parse profile_data if exists
        if (user.profile_data) {
          try {
            profileData = JSON.parse(user.profile_data);
            console.log('📝 [TalentApproval] Parsed profile data for:', user.id.slice(0, 8), profileData);
          } catch (error) {
            console.warn('⚠️ [TalentApproval] Failed to parse profile_data for user:', user.id, error);
          }
        }

        const talent = {
          id: user.id,
          email: user.email || '',
          full_name: user.full_name || user.name || 'Tidak ada nama',
          phone: user.phone || '',
          age: profileData?.age || user.age || 0,
          location: profileData?.location || user.location || 'Tidak diisi',
          bio: profileData?.bio || user.bio || '',
          hourly_rate: profileData?.hourlyRate || user.hourly_rate || 0,
          services: profileData?.services || [],
          languages: profileData?.languages || ['Bahasa Indonesia'],
          interests: profileData?.interests || [],
          experience_years: profileData?.experienceYears || 0,
          transportation_mode: profileData?.transportationMode || '',
          emergency_contact: profileData?.emergencyContact || '',
          emergency_phone: profileData?.emergencyPhone || '',
          availability: profileData?.availability || [],
          has_id_card: profileData?.hasIdCard || false,
          has_profile_photo: profileData?.hasProfilePhoto || false,
          id_card_url: profileData?.idCardUrl,
          profile_photo_url: profileData?.profilePhotoUrl,
          created_at: user.created_at,
          verification_status: user.verification_status as 'pending' | 'verified' | 'rejected',
          specialties: profileData?.services || []
        };

        console.log('🔄 [TalentApproval] Transformed talent:', {
          id: talent.id.slice(0, 8),
          name: talent.full_name,
          verification_status: talent.verification_status,
          user_type: user.user_type,
          auth_only: user.auth_only,
          has_profile: user.has_profile
        });

        return talent;
      });

      console.log('✅ [TalentApproval] Final transformed talents:', transformedTalents.length);
      
      // Show status breakdown
      const statusBreakdown = transformedTalents.reduce((acc: any, talent) => {
        acc[talent.verification_status] = (acc[talent.verification_status] || 0) + 1;
        return acc;
      }, {});
      console.log('📊 [TalentApproval] Status breakdown:', statusBreakdown);

      setTalents(transformedTalents);

    } catch (error: any) {
      console.error('❌ [TalentApproval] Error fetching talent registrations:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data pendaftaran talent: " + error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeUpdates = () => {
    console.log('🔄 [TalentApproval] Setting up real-time updates...');
    
    const channel = supabase
      .channel('talent-registrations-approval')
      .on('postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'profiles',
          filter: 'user_type=eq.companion'
        },
        (payload) => {
          console.log('🔄 [TalentApproval] Real-time update received:', payload);
          fetchTalentRegistrations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const filterTalents = () => {
    let filtered = talents;

    if (searchTerm) {
      filtered = filtered.filter(talent =>
        talent.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        talent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        talent.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        talent.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(talent => talent.verification_status === statusFilter);
    }

    if (serviceFilter !== 'all') {
      filtered = filtered.filter(talent => 
        talent.services.some(service => 
          service.toLowerCase().includes(serviceFilter.toLowerCase())
        )
      );
    }

    console.log('🔍 [TalentApproval] Filtered talents:', filtered.length, 'from', talents.length);
    setFilteredTalents(filtered);
  };

  const handleApproval = async (talentId: string, approved: boolean) => {
    try {
      console.log(`${approved ? '✅' : '❌'} [TalentApproval] Processing approval for talent:`, talentId);
      
      // Use the admin Edge Function instead of direct database update
      const { data, error } = await supabase.functions.invoke('admin-update-talent-status', {
        body: { 
          talentId: talentId, 
          approved: approved 
        }
      });

      if (error) {
        console.error('❌ [TalentApproval] Error from admin function:', error);
        throw new Error(error.message || 'Failed to update talent status');
      }

      if (!data?.success) {
        console.error('❌ [TalentApproval] Admin function returned failure:', data);
        throw new Error(data?.error || 'Failed to update talent status');
      }

      // Update local state immediately
      const verificationStatus = approved ? 'verified' : 'rejected';
      setTalents(prev => 
        prev.map(talent => 
          talent.id === talentId 
            ? { ...talent, verification_status: verificationStatus as any }
            : talent
        )
      );
      
      toast({
        title: approved ? "✅ Talent Disetujui" : "❌ Talent Ditolak",
        description: `Pendaftaran talent telah ${approved ? 'disetujui' : 'ditolak'}.`,
        className: approved ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
      });

      // Refresh data after a short delay
      setTimeout(() => fetchTalentRegistrations(), 1000);
      
    } catch (error: any) {
      console.error('❌ [TalentApproval] Error updating talent status:', error);
      toast({
        title: "Error",
        description: "Gagal mengupdate status talent: " + error.message,
        variant: "destructive"
      });
    }
  };

  // Get unique services for filter
  const uniqueServices = Array.from(new Set(
    talents.flatMap(talent => talent.services)
  )).filter(Boolean);

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

  const pendingCount = talents.filter(t => t.verification_status === 'pending').length;
  const approvedCount = talents.filter(t => t.verification_status === 'verified').length;
  const rejectedCount = talents.filter(t => t.verification_status === 'rejected').length;
  const incompleteDataCount = talents.filter(t => !t.services?.length || !t.has_id_card || !t.has_profile_photo).length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendaftaran</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{talents.length}</div>
            <p className="text-xs text-muted-foreground">Total talent terdaftar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menunggu Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Perlu persetujuan admin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Talent Aktif</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">Talent yang disetujui</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ditolak</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground">Talent yang ditolak</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Incomplete</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{incompleteDataCount}</div>
            <p className="text-xs text-muted-foreground">Data tidak lengkap</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter & Pencarian Data Talent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari berdasarkan nama, email, lokasi, atau layanan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="pending">⏳ Menunggu Review</SelectItem>
                  <SelectItem value="verified">✅ Disetujui</SelectItem>
                  <SelectItem value="rejected">❌ Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter Layanan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Layanan</SelectItem>
                  {uniqueServices.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Menampilkan {filteredTalents.length} dari {talents.length} total talent
            </p>
            <Button 
              variant="outline" 
              onClick={fetchTalentRegistrations}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Talent Cards */}
      <div className="space-y-4">
        {filteredTalents.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {loading ? "Memuat data..." : "Tidak Ada Data"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' || serviceFilter !== 'all'
                  ? 'Tidak ada talent yang sesuai dengan filter yang dipilih.'
                  : 'Belum ada pendaftaran talent yang masuk.'}
              </p>
              <div className="text-sm text-gray-400 space-y-1">
                <p>Debug Info:</p>
                <p>Total talents found: {talents.length}</p>
                <p>Filtered result: {filteredTalents.length}</p>
                <p>Pending: {pendingCount}, Verified: {approvedCount}, Rejected: {rejectedCount}</p>
              </div>
              {(searchTerm || statusFilter !== 'all' || serviceFilter !== 'all') && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setServiceFilter('all');
                  }}
                >
                  Reset Filter
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredTalents.map((talent) => (
            <TalentApprovalCard
              key={talent.id}
              talent={talent}
              onApprove={(id) => handleApproval(id, true)}
              onReject={(id) => handleApproval(id, false)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TalentApprovalSystem;
