import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Star, Calendar, DollarSign, CheckCircle, AlertTriangle, LogOut, Shield, Heart, Phone, Video, MapPin, PartyPopper } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import DemoPaymentManagement from '@/components/admin/DemoPaymentManagement';
import TalentLevelManagement from '@/components/admin/TalentLevelManagement';
import ServiceAnalytics from '@/components/admin/ServiceAnalytics';
import UserApprovalManagement from '@/components/admin/UserApprovalManagement';
import PaymentManagement from '@/components/admin/PaymentManagement';

const AdminDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7days');
  const { signOut } = useAdminAuth();

  // Temanly-specific stats with Indonesian pricing
  const stats = {
    totalUsers: 1847,
    totalTalents: 156,
    activeBookings: 45,
    monthlyRevenue: 156000000, // IDR 156M
    pendingVerifications: 23,
    completedOrders: 892,
    freshTalents: 89,
    eliteTalents: 45,
    vipTalents: 22
  };

  // Temanly service pricing (in IDR)
  const servicePricing = [
    { name: 'Chat', price: 25000, duration: '/hari', icon: '💬', popularity: 45 },
    { name: 'Call', price: 40000, duration: '/jam', icon: '📞', popularity: 25 },
    { name: 'Video Call', price: 65000, duration: '/jam', icon: '📹', popularity: 20 },
    { name: 'Offline Date', price: 285000, duration: '/3 jam', icon: '🗓️', popularity: 8 },
    { name: 'Party Buddy', price: 1000000, duration: '/event', icon: '🎉', popularity: 2 }
  ];

  // Demo recent orders with Temanly services
  const recentOrders = [
    { 
      id: 'TEM001', 
      user: 'Ahmad Rizki', 
      talent: 'Sarah M.', 
      service: 'Chat', 
      amount: 27500, // 25k + 10% app fee
      talentEarning: 20000, // 25k - 20% commission
      platformFee: 2500,
      appFee: 2500,
      status: 'completed',
      duration: '1 hari',
      city: 'Jakarta'
    },
    { 
      id: 'TEM002', 
      user: 'Budi Santoso', 
      talent: 'Maya A.', 
      service: 'Video Call', 
      amount: 71500, // 65k + 10% app fee
      talentEarning: 53300, // 65k - 18% commission (Elite)
      platformFee: 6500,
      appFee: 6500,
      status: 'in-progress',
      duration: '1 jam',
      city: 'Bandung'
    },
    { 
      id: 'TEM003', 
      user: 'Dewi Lestari', 
      talent: 'Andi K.', 
      service: 'Offline Date', 
      amount: 313500, // 285k + 10% app fee
      talentEarning: 242250, // 285k - 15% commission (VIP)
      platformFee: 28500,
      appFee: 28500,
      status: 'confirmed',
      duration: '3 jam',
      city: 'Surabaya'
    },
    { 
      id: 'TEM004', 
      user: 'Eka Putra', 
      talent: 'Luna S.', 
      service: 'Rent a Lover', 
      amount: 93500, // 85k + 10% app fee
      talentEarning: 68000, // 85k - 20% commission (Fresh)
      platformFee: 8500,
      appFee: 8500,
      status: 'active',
      duration: '1 hari',
      city: 'Medan'
    }
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
                <p className="text-sm text-gray-600">Platform Rental Talent & Pengalaman Sosial</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">7 Hari</SelectItem>
                  <SelectItem value="30days">30 Hari</SelectItem>
                  <SelectItem value="90days">90 Hari</SelectItem>
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
        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% dari bulan lalu</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Talents</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTalents}</div>
              <div className="text-xs text-muted-foreground">
                Fresh: {stats.freshTalents} | Elite: {stats.eliteTalents} | VIP: {stats.vipTalents}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeBookings}</div>
              <p className="text-xs text-muted-foreground">Sedang berlangsung</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue Bulanan</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp {(stats.monthlyRevenue / 1000000).toFixed(0)}M</div>
              <p className="text-xs text-muted-foreground">+18% dari bulan lalu</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Verifikasi</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingVerifications}</div>
              <p className="text-xs text-muted-foreground">Menunggu approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedOrders}</div>
              <p className="text-xs text-muted-foreground">Total selesai</p>
            </CardContent>
          </Card>
        </div>

        {/* Service Pricing Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Temanly Service Pricing & Popularity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {servicePricing.map((service) => (
                <div key={service.name} className="text-center p-4 border rounded-lg">
                  <div className="text-2xl mb-2">{service.icon}</div>
                  <h3 className="font-semibold">{service.name}</h3>
                  <p className="text-lg font-bold text-blue-600">
                    Rp {service.price.toLocaleString()}{service.duration}
                  </p>
                  <p className="text-sm text-gray-500">{service.popularity}% popularitas</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="approvals" className="space-y-6">
          <TabsList className="flex flex-wrap gap-2 h-auto p-2 bg-muted">
            <TabsTrigger value="approvals" className="flex-shrink-0">User Approvals</TabsTrigger>
            <TabsTrigger value="payments" className="flex-shrink-0">Payment Management</TabsTrigger>
            <TabsTrigger value="payment-demo" className="flex-shrink-0">Payment Demo</TabsTrigger>
            <TabsTrigger value="orders" className="flex-shrink-0">Orders</TabsTrigger>
            <TabsTrigger value="talents" className="flex-shrink-0">Talent Levels</TabsTrigger>
            <TabsTrigger value="analytics" className="flex-shrink-0">Service Analytics</TabsTrigger>
            <TabsTrigger value="verification" className="flex-shrink-0">Verifikasi</TabsTrigger>
            <TabsTrigger value="cities" className="flex-shrink-0">Kota</TabsTrigger>
          </TabsList>

          <TabsContent value="approvals">
            <UserApprovalManagement />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentManagement />
          </TabsContent>

          <TabsContent value="payment-demo">
            <DemoPaymentManagement />
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Temanly Orders</CardTitle>
                <p className="text-sm text-gray-600">Pesanan terbaru dengan detail komisi dan fee</p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Talent</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Durasi</TableHead>
                      <TableHead>Kota</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Talent Earning</TableHead>
                      <TableHead>Platform Fee</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.user}</TableCell>
                        <TableCell>{order.talent}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{order.service}</Badge>
                        </TableCell>
                        <TableCell>{order.duration}</TableCell>
                        <TableCell>{order.city}</TableCell>
                        <TableCell className="font-semibold">Rp {order.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-green-600">Rp {order.talentEarning.toLocaleString()}</TableCell>
                        <TableCell className="text-blue-600">Rp {order.platformFee.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              order.status === 'completed' ? 'bg-green-100 text-green-600' :
                              order.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                              order.status === 'active' ? 'bg-purple-100 text-purple-600' :
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
            <TalentLevelManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <ServiceAnalytics />
          </TabsContent>

          <TabsContent value="verification">
            <Card>
              <CardHeader>
                <CardTitle>User & Talent Verification Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">User Verification Requirements</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span>KTP Verification</span>
                        <Badge className="bg-red-100 text-red-600">Required for Offline Date & Party</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span>Email Verification</span>
                        <Badge className="bg-green-100 text-green-600">Required</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span>WhatsApp Verification</span>
                        <Badge className="bg-green-100 text-green-600">Required</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Talent Verification Requirements</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span>ID Verification (Wajib)</span>
                        <Badge className="bg-red-100 text-red-600">Mandatory</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span>Age 21+ for Party Buddy</span>
                        <Badge className="bg-orange-100 text-orange-600">Conditional</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span>Service Selection</span>
                        <Badge className="bg-blue-100 text-blue-600">Required</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cities">
            <Card>
              <CardHeader>
                <CardTitle>Talent Distribution by City</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { city: 'Jakarta', talents: 65, activeOrders: 23 },
                    { city: 'Bandung', talents: 28, activeOrders: 8 },
                    { city: 'Surabaya', talents: 32, activeOrders: 12 },
                    { city: 'Medan', talents: 18, activeOrders: 6 },
                    { city: 'Yogyakarta', talents: 13, activeOrders: 4 }
                  ].map((cityData) => (
                    <div key={cityData.city} className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-lg">{cityData.city}</h3>
                      <p className="text-2xl font-bold text-blue-600">{cityData.talents} talents</p>
                      <p className="text-sm text-gray-500">{cityData.activeOrders} active orders</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
