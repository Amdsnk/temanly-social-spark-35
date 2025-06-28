
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, Clock, Mail, Phone, User, RefreshCw, Database, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database as DatabaseType } from '@/integrations/supabase/types';

type UserType = DatabaseType['public']['Enums']['user_type'];
type VerificationStatus = DatabaseType['public']['Enums']['verification_status'];

interface PendingUser {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  user_type: UserType;
  verification_status: VerificationStatus;
  created_at: string;
}

const UserApprovalManagement = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [allUsers, setAllUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<any>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchAllData();
    setupRealTimeUpdates();
  }, []);

  const fetchAllData = async () => {
    try {
      console.log('🔍 Starting comprehensive data fetch...');
      setRefreshing(true);
      setConnectionStatus('Connecting to database...');
      
      // First, get ALL users to debug
      const { data: allProfiles, error: allError, count: totalCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      console.log('✅ ALL USERS from database:', {
        profiles: allProfiles,
        count: totalCount,
        error: allError
      });

      if (allError) {
        console.error('❌ Error fetching all users:', allError);
        throw allError;
      }

      setAllUsers(allProfiles || []);

      // Now get pending users specifically
      const { data: pendingProfiles, error: pendingError, count: pendingCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .eq('verification_status', 'pending')
        .order('created_at', { ascending: false });

      console.log('✅ PENDING USERS query result:', {
        profiles: pendingProfiles,
        count: pendingCount,
        error: pendingError
      });

      // Debug: Check what verification statuses exist
      const statusBreakdown = (allProfiles || []).reduce((acc: any, user) => {
        acc[user.verification_status] = (acc[user.verification_status] || 0) + 1;
        return acc;
      }, {});

      console.log('📊 Verification status breakdown:', statusBreakdown);

      const debugData = {
        totalUsers: allProfiles?.length || 0,
        pendingUsers: pendingProfiles?.length || 0,
        statusBreakdown,
        sampleUsers: allProfiles?.slice(0, 3).map(u => ({
          id: u.id.slice(0, 8),
          email: u.email,
          status: u.verification_status,
          type: u.user_type
        }))
      };

      setDebugInfo(debugData);
      setPendingUsers(pendingProfiles || []);
      
      setConnectionStatus(`Loaded ${allProfiles?.length || 0} total users, ${pendingProfiles?.length || 0} pending approval`);

    } catch (error: any) {
      console.error('❌ Error in fetchAllData:', error);
      setConnectionStatus(`Error: ${error.message}`);
      toast({
        title: "Error",
        description: "Gagal memuat data user yang menunggu approval",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const setupRealTimeUpdates = () => {
    const channel = supabase
      .channel('pending-users-admin')
      .on('postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'profiles',
          filter: 'verification_status=eq.pending'
        },
        (payload) => {
          console.log('🔄 Real-time update received for pending users:', payload);
          fetchAllData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleApproval = async (userId: string, approved: boolean) => {
    try {
      const status: VerificationStatus = approved ? 'verified' : 'rejected';
      const { error } = await supabase
        .from('profiles')
        .update({ 
          verification_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      // Send notification email
      await sendApprovalNotification(userId, approved);

      setPendingUsers(prev => prev.filter(user => user.id !== userId));
      
      toast({
        title: approved ? "User Approved" : "User Rejected",
        description: `User has been ${approved ? 'approved' : 'rejected'} and notified via email.`
      });
    } catch (error: any) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive"
      });
    }
  };

  const sendApprovalNotification = async (userId: string, approved: boolean) => {
    try {
      await supabase.functions.invoke('send-approval-notification', {
        body: { userId, approved }
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  // Function to manually set users to pending status for testing
  const setUsersToPending = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ verification_status: 'pending' })
        .neq('user_type', 'admin');

      if (error) throw error;

      toast({
        title: "Users Updated",
        description: "Non-admin users set to pending status for testing"
      });

      fetchAllData();
    } catch (error: any) {
      console.error('Error updating users to pending:', error);
      toast({
        title: "Error",
        description: "Failed to update users",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading pending approvals...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Debug Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2">
            <Database className="w-4 h-4" />
            Database Debug Information - User Approvals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-blue-700 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Total Users in DB:</strong> {debugInfo.totalUsers}</p>
                <p><strong>Pending Approvals:</strong> {debugInfo.pendingUsers}</p>
                <p><strong>Connection Status:</strong> {connectionStatus}</p>
              </div>
              <div>
                <p><strong>Status Breakdown:</strong></p>
                <ul className="ml-4 text-xs">
                  {Object.entries(debugInfo.statusBreakdown || {}).map(([status, count]) => (
                    <li key={status}>• {status}: {count as number}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded border">
              <p className="font-medium mb-2">Sample Users:</p>
              <div className="text-xs space-y-1">
                {debugInfo.sampleUsers?.map((user: any, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <span>ID: {user.id}</span>
                    <span>Email: {user.email}</span>
                    <span>Status: <strong>{user.status}</strong></span>
                    <span>Type: {user.type}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={fetchAllData}
                disabled={refreshing}
                className="flex items-center gap-1"
              >
                <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={setUsersToPending}
                className="flex items-center gap-1 bg-yellow-50 hover:bg-yellow-100"
              >
                <AlertCircle className="h-3 w-3" />
                Set Non-Admin to Pending (Test)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Pending User Approvals ({pendingUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500 space-y-4">
              <div>
                <p className="text-lg">No pending approvals found.</p>
                <p className="text-sm mt-2 text-gray-600">
                  {allUsers.length > 0 
                    ? `Found ${allUsers.length} total users in database, but none have 'pending' status.`
                    : 'No users found in database.'
                  }
                </p>
              </div>
              
              {allUsers.length > 0 && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800 mb-3">
                    <strong>Debug Help:</strong> If you want to test approvals, click the button below to set non-admin users to 'pending' status.
                  </p>
                  <Button 
                    onClick={setUsersToPending} 
                    className="bg-yellow-500 hover:bg-yellow-600"
                    size="sm"
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Set Users to Pending for Testing
                  </Button>
                </div>
              )}
              
              <Button onClick={fetchAllData} className="mt-4" variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Check Again
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Details</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{user.name || user.email}</div>
                          <div className="text-sm text-gray-500">ID: {user.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="w-3 h-3" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.user_type === 'companion' ? 'default' : user.user_type === 'admin' ? 'destructive' : 'secondary'}
                      >
                        {user.user_type === 'companion' ? 'Talent' : user.user_type === 'admin' ? 'Admin' : 'User'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600"
                          onClick={() => handleApproval(user.id, true)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleApproval(user.id, false)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
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

export default UserApprovalManagement;
