
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Eye, 
  RefreshCw,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  FileText,
  AlertCircle
} from 'lucide-react';
import { newAdminService, UserData, TransactionData } from '@/services/newAdminService';
import { useToast } from '@/hooks/use-toast';

const NewAdminDashboard = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [approvalLoading, setApprovalLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const pendingUsers = users.filter(u => u.verification_status === 'pending');
  const verifiedUsers = users.filter(u => u.verification_status === 'verified');
  const rejectedUsers = users.filter(u => u.verification_status === 'rejected');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [usersResult, transactionsResult] = await Promise.all([
        newAdminService.getAllUsers(),
        newAdminService.getAllTransactions()
      ]);

      if (usersResult.error) {
        toast({
          title: "Error",
          description: `Failed to load users: ${usersResult.error}`,
          variant: "destructive"
        });
      } else {
        setUsers(usersResult.users);
      }

      if (transactionsResult.error) {
        toast({
          title: "Error", 
          description: `Failed to load transactions: ${transactionsResult.error}`,
          variant: "destructive"
        });
      } else {
        setTransactions(transactionsResult.transactions);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (userId: string, approved: boolean) => {
    if (!selectedUser) return;

    setApprovalLoading(userId);
    try {
      let result;
      if (approved) {
        result = await newAdminService.approveUser(userId, selectedUser);
      } else {
        result = await newAdminService.rejectUser(userId, 'Admin rejection');
      }

      if (result.success) {
        toast({
          title: approved ? "User Approved" : "User Rejected",
          description: `User has been ${approved ? 'approved' : 'rejected'} successfully.`,
          className: approved ? "bg-green-50 border-green-200" : ""
        });
        
        // Refresh data
        await fetchAllData();
        setSelectedUser(null);
      } else {
        throw new Error(result.error || 'Operation failed');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setApprovalLoading(null);
    }
  };

  const UserDetailsModal = ({ user }: { user: UserData }) => (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>User Details - {user.name}</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Email</Label>
            <div className="flex items-center gap-2 mt-1">
              <Mail className="w-4 h-4 text-gray-500" />
              <span>{user.email}</span>
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium">Phone</Label>
            <div className="flex items-center gap-2 mt-1">
              <Phone className="w-4 h-4 text-gray-500" />
              <span>{user.phone || 'Not provided'}</span>
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium">User Type</Label>
            <Badge className="mt-1" variant={user.user_type === 'companion' ? 'default' : 'secondary'}>
              {user.user_type === 'companion' ? 'Talent' : 'User'}
            </Badge>
          </div>
          
          <div>
            <Label className="text-sm font-medium">Status</Label>
            <Badge 
              className="mt-1" 
              variant={
                user.verification_status === 'verified' ? 'default' : 
                user.verification_status === 'rejected' ? 'destructive' : 'secondary'
              }
            >
              {user.verification_status}
            </Badge>
          </div>
          
          {user.age && (
            <div>
              <Label className="text-sm font-medium">Age</Label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>{user.age} years old</span>
              </div>
            </div>
          )}
          
          {user.city && (
            <div>
              <Label className="text-sm font-medium">City</Label>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>{user.city}</span>
              </div>
            </div>
          )}
        </div>
        
        {user.ktp_number && (
          <div>
            <Label className="text-sm font-medium">KTP Number</Label>
            <div className="flex items-center gap-2 mt-1">
              <FileText className="w-4 h-4 text-gray-500" />
              <span>{user.ktp_number}</span>
            </div>
          </div>
        )}
        
        {user.ktp_image && (
          <div>
            <Label className="text-sm font-medium">KTP Image</Label>
            <div className="mt-2">
              <img 
                src={user.ktp_image} 
                alt="KTP" 
                className="max-w-full h-auto border rounded-lg"
                style={{ maxHeight: '300px' }}
              />
            </div>
          </div>
        )}
        
        {user.bio && (
          <div>
            <Label className="text-sm font-medium">Bio</Label>
            <p className="mt-1 text-sm text-gray-600">{user.bio}</p>
          </div>
        )}
        
        <div className="text-xs text-gray-500">
          <p>Registered: {new Date(user.created_at).toLocaleString()}</p>
          <p>Profile: {user.has_profile ? 'Complete' : 'Auth only'}</p>
          <p>Email Verified: {user.auth_verified ? 'Yes' : 'No'}</p>
        </div>
        
        {user.verification_status === 'pending' && (
          <div className="flex gap-2 pt-4 border-t">
            <Button
              onClick={() => handleApproval(user.id, true)}
              disabled={approvalLoading === user.id}
              className="bg-green-500 hover:bg-green-600 flex-1"
            >
              {approvalLoading === user.id ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Approve User
            </Button>
            
            <Button
              onClick={() => handleApproval(user.id, false)}
              disabled={approvalLoading === user.id}
              variant="destructive"
              className="flex-1"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject User
            </Button>
          </div>
        )}
      </div>
    </DialogContent>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={fetchAllData} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{pendingUsers.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{verifiedUsers.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="approvals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="approvals">
            Pending Approvals ({pendingUsers.length})
          </TabsTrigger>
          <TabsTrigger value="users">All Users ({users.length})</TabsTrigger>
          <TabsTrigger value="transactions">Transactions ({transactions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="approvals">
          <Card>
            <CardHeader>
              <CardTitle>Users Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <p>No pending approvals!</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Registration</TableHead>
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
                              <div className="text-sm text-gray-500">
                                {user.has_profile ? 'Complete Profile' : 'Auth Only'}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">{user.email}</div>
                            {user.phone && (
                              <div className="text-sm text-gray-500">{user.phone}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.user_type === 'companion' ? 'default' : 'secondary'}>
                            {user.user_type === 'companion' ? 'Talent' : 'User'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(user.created_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedUser(user)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Review
                                </Button>
                              </DialogTrigger>
                              {selectedUser && <UserDetailsModal user={selectedUser} />}
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registration</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.user_type === 'companion' ? 'default' : 'secondary'}>
                          {user.user_type === 'companion' ? 'Talent' : 'User'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            user.verification_status === 'verified' ? 'default' : 
                            user.verification_status === 'rejected' ? 'destructive' : 'secondary'
                          }
                        >
                          {user.verification_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          {selectedUser && <UserDetailsModal user={selectedUser} />}
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="w-12 h-12 mx-auto mb-4" />
                  <p>No transactions found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Service</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-mono">
                          {transaction.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell>
                          Rp {transaction.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {transaction.service_type || 'Standard'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewAdminDashboard;
