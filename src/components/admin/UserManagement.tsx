
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Users, Search, Eye, UserCheck, UserX, Mail, Phone, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type UserType = Database['public']['Enums']['user_type'];
type VerificationStatus = Database['public']['Enums']['verification_status'];

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  user_type: UserType;
  verification_status: VerificationStatus;
  status: string;
  created_at: string;
  total_bookings: number;
  total_earnings: number;
  rating: number;
  location: string | null;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | UserType>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | VerificationStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTalents: 0,
    verifiedUsers: 0,
    pendingApprovals: 0
  });

  useEffect(() => {
    fetchUsers();
    calculateStats();
  }, [filterType, filterStatus]);

  const fetchUsers = async () => {
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterType !== 'all') {
        query = query.eq('user_type', filterType as UserType);
      }

      if (filterStatus !== 'all') {
        query = query.eq('verification_status', filterStatus as VerificationStatus);
      }

      const { data, error } = await query;
      if (error) throw error;

      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_type, verification_status');

      if (error) throw error;

      const totalUsers = data.filter(u => u.user_type === 'user').length;
      const totalTalents = data.filter(u => u.user_type === 'companion').length;
      const verifiedUsers = data.filter(u => u.verification_status === 'verified').length;
      const pendingApprovals = data.filter(u => u.verification_status === 'pending').length;

      setStats({
        totalUsers,
        totalTalents,
        verifiedUsers,
        pendingApprovals
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  };

  const updateUserStatus = async (userId: string, newStatus: VerificationStatus) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          verification_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, verification_status: newStatus }
            : user
        )
      );

      toast({
        title: "User Updated",
        description: `User status has been updated to ${newStatus}`,
      });

      calculateStats();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserTypeBadge = (userType: UserType) => {
    switch (userType) {
      case 'companion':
        return <Badge className="bg-purple-100 text-purple-600">Talent</Badge>;
      case 'admin':
        return <Badge className="bg-red-100 text-red-600">Admin</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-600">User</Badge>;
    }
  };

  const getStatusBadge = (status: VerificationStatus) => {
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

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading users...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Regular users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Talents</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalTalents}</div>
            <p className="text-xs text-muted-foreground">Companion talents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.verifiedUsers}</div>
            <p className="text-xs text-muted-foreground">Verified accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <UserX className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">Need review</p>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            All Users ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <Input
                placeholder="Search by name, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            
            <Select value={filterType} onValueChange={(value) => setFilterType(value as 'all' | UserType)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="user">Users</SelectItem>
                <SelectItem value="companion">Talents</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as 'all' | VerificationStatus)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {users.length === 0 ? "No users found." : "No users match your search criteria."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Details</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Statistics</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{user.name || 'No name'}</div>
                          <div className="text-sm text-gray-500">ID: {user.id.slice(0, 8)}...</div>
                          {user.location && (
                            <div className="text-xs text-gray-400">{user.location}</div>
                          )}
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
                      {getUserTypeBadge(user.user_type)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(user.verification_status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs space-y-1">
                        {user.user_type === 'companion' && (
                          <>
                            <div>Rating: {user.rating}/5</div>
                            <div>Bookings: {user.total_bookings}</div>
                            <div>Earnings: Rp {(user.total_earnings || 0).toLocaleString('id-ID')}</div>
                          </>
                        )}
                        {user.user_type === 'user' && (
                          <div>Bookings: {user.total_bookings}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-3 h-3" />
                        {new Date(user.created_at).toLocaleDateString('id-ID')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        {user.verification_status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-500 hover:bg-green-600"
                              onClick={() => updateUserStatus(user.id, 'verified')}
                            >
                              <UserCheck className="w-3 h-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateUserStatus(user.id, 'rejected')}
                            >
                              <UserX className="w-3 h-3 mr-1" />
                              Reject
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

export default UserManagement;
