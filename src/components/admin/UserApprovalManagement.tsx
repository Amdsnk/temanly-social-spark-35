
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, Clock, Mail, Phone, User, RefreshCw, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type UserType = Database['public']['Enums']['user_type'];
type VerificationStatus = Database['public']['Enums']['verification_status'];

interface PendingUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  user_type: UserType;
  verification_status: VerificationStatus;
  created_at: string;
}

const UserApprovalManagement = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingUsers();
    setupRealTimeUpdates();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      console.log('Fetching pending users...');
      setRefreshing(true);
      setConnectionError(null);
      
      // Try admin function first
      try {
        const { data: adminResponse, error: adminError } = await supabase.functions.invoke('admin-get-users', {
          body: {
            verificationStatus: 'pending'
          }
        });

        if (adminError) {
          console.error('Admin function error:', adminError);
          throw adminError;
        }

        console.log('Admin function response:', adminResponse);

        if (adminResponse?.success && adminResponse?.users) {
          const pendingUsers = adminResponse.users.filter((user: any) => user.verification_status === 'pending');
          console.log(`Pending users found via admin function: ${pendingUsers.length}`);
          setPendingUsers(pendingUsers);
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
          .eq('verification_status', 'pending')
          .order('created_at', { ascending: false });

        if (directError) {
          console.error('Direct query error:', directError);
          throw directError;
        }

        console.log(`Pending users found via direct query: ${profiles?.length || 0}`);
        setPendingUsers(profiles || []);
        setConnectionError('Using direct database access (RLS may limit results)');
      }

    } catch (error) {
      console.error('Error fetching pending users:', error);
      setConnectionError(error.message || 'Failed to fetch pending users');
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
          console.log('Real-time update received for pending users:', payload);
          fetchPendingUsers();
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
    } catch (error) {
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
      {/* Connection Status */}
      <Card className={connectionError ? "bg-yellow-50 border-yellow-200" : "bg-green-50 border-green-200"}>
        <CardHeader>
          <CardTitle className={`text-sm font-medium ${connectionError ? 'text-yellow-800' : 'text-green-800'}`}>
            {connectionError ? '⚠️ Connection Warning' : '✓ Admin Function Status'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-sm ${connectionError ? 'text-yellow-700' : 'text-green-700'} space-y-2`}>
            <p><strong>Status:</strong> {connectionError || 'Connected via Admin Function'}</p>
            <p><strong>Pending users loaded:</strong> {pendingUsers.length}</p>
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
                onClick={fetchPendingUsers}
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Pending User Approvals ({pendingUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No pending approvals at this time.</p>
              {connectionError && (
                <p className="text-sm mt-2 text-yellow-600">
                  If you expect pending users, please check your Supabase edge functions deployment.
                </p>
              )}
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
                          <div className="font-medium">{user.name}</div>
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
