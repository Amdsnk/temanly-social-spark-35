import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Star, Calendar, DollarSign, CheckCircle, AlertTriangle, LogOut, Shield } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminAuthProvider, useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';
import UserApprovalManagement from '@/components/admin/UserApprovalManagement';
import PaymentManagement from '@/components/admin/PaymentManagement';

const AdminDashboardContent = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7days');
  const { signOut } = useAdminAuth();

  // Mock data - replace with real data from Supabase
  const stats = {
    totalUsers: 1250,
    totalTalents: 85,
    activeBookings: 23,
    monthlyRevenue: 45000000,
    pendingVerifications: 12,
    completedOrders: 340
  };

  const recentOrders = [
    { id: 'ORD001', user: 'John Doe', talent: 'Sarah', service: 'Chat', amount: 25000, status: 'completed' },
    { id: 'ORD002', user: 'Jane Smith', talent: 'Maya', service: 'Video Call', amount: 65000, status: 'in-progress' },
    { id: 'ORD003', user: 'Bob Wilson', talent: 'Andi', service: 'Offline Date', amount: 285000, status: 'confirmed' }
  ];

  const talentLevels = [
    { name: 'Fresh Talent', count: 45, commission: '20%', color: 'bg-blue-100 text-blue-600' },
    { name: 'Elite Talent', count: 28, commission: '18%', color: 'bg-green-100 text-green-600' },
    { name: 'VIP Talent', count: 12, commission: '15%', color: 'bg-purple-100 text-purple-600' }
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Temanly Super Admin</h1>
                <p className="text-sm text-gray-600">Welcome back, Admin</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">7 Days</SelectItem>
                  <SelectItem value="30days">30 Days</SelectItem>
                  <SelectItem value="90days">90 Days</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Talents</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTalents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeBookings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp {(stats.monthlyRevenue / 1000000).toFixed(1)}M</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingVerifications}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedOrders}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="approvals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="approvals">User Approvals</TabsTrigger>
            <TabsTrigger value="payments">Payment Management</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="talents">Talents</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="approvals">
            <UserApprovalManagement />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentManagement />
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Talent</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.user}</TableCell>
                        <TableCell>{order.talent}</TableCell>
                        <TableCell>{order.service}</TableCell>
                        <TableCell>Rp {order.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              order.status === 'completed' ? 'bg-green-100 text-green-600' :
                              order.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                              'bg-yellow-100 text-yellow-600'
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="talents">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {talentLevels.map((level) => (
                <Card key={level.name}>
                  <CardHeader>
                    <CardTitle className="text-lg">{level.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold">{level.count}</div>
                      <Badge className={level.color}>Commission: {level.commission}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Service Popularity</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Chat</span>
                        <span className="font-medium">45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Video Call</span>
                        <span className="font-medium">25%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Offline Date</span>
                        <span className="font-medium">20%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Call</span>
                        <span className="font-medium">8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Party Buddy</span>
                        <span className="font-medium">2%</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Revenue Breakdown</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Platform Fee (10%)</span>
                        <span className="font-medium">Rp 4.5M</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fresh Talent Commission</span>
                        <span className="font-medium">Rp 18M</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Elite Talent Commission</span>
                        <span className="font-medium">Rp 14.4M</span>
                      </div>
                      <div className="flex justify-between">
                        <span>VIP Talent Commission</span>
                        <span className="font-medium">Rp 8.1M</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <AdminAuthProvider>
      <AdminProtectedRoute>
        <AdminDashboardContent />
      </AdminProtectedRoute>
    </AdminAuthProvider>
  );
};

export default AdminDashboard;
