
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Star, Calendar, DollarSign, User, CheckCircle, AlertTriangle, Heart, TrendingUp, Clock, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import TransactionHistory from '@/components/TransactionHistory';
import ProfileSettings from '@/components/ProfileSettings';

const UserDashboard = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'overview';
  
  // Mock data - would come from API
  const stats = {
    totalSpent: 1500000,
    completedBookings: 12,
    favoriteCount: 5,
    verificationStatus: user?.verification_status || 'verified',
    activeBookings: 2,
    averageRating: 4.8,
    memberSince: '2024-01-01'
  };

  const recentBookings = [
    { 
      id: 'ORD001', 
      talent: 'Sarah Jakarta', 
      service: 'Chat', 
      date: '2024-01-15', 
      amount: 25000, 
      status: 'completed',
      rating: 5,
      duration: '1 day'
    },
    { 
      id: 'ORD002', 
      talent: 'Maya Bandung', 
      service: 'Video Call', 
      date: '2024-01-14', 
      amount: 65000, 
      status: 'in-progress',
      rating: null,
      duration: '1 hour'
    },
    { 
      id: 'ORD003', 
      talent: 'Andi Surabaya', 
      service: 'Offline Date', 
      date: '2024-01-13', 
      amount: 285000, 
      status: 'confirmed',
      rating: null,
      duration: '3 hours'
    }
  ];

  const favoritesTalents = [
    { 
      id: 1, 
      name: 'Sarah Jakarta', 
      rating: 4.9, 
      specialties: ['Chat', 'Video Call', 'Rent a Lover'],
      image: '/placeholder.svg',
      isOnline: true,
      responseTime: '< 5 min',
      totalBookings: 15
    },
    { 
      id: 2, 
      name: 'Maya Bandung', 
      rating: 4.8, 
      specialties: ['Offline Date', 'Party Buddy'],
      image: '/placeholder.svg',
      isOnline: false,
      responseTime: '< 10 min',
      totalBookings: 8
    }
  ];

  const handleRating = (bookingId: string, rating: number) => {
    console.log(`Rating ${rating} for booking ${bookingId}`);
  };

  const handleBookAgain = (talentName: string) => {
    console.log(`Book again with ${talentName}`);
  };

  const getVerificationProgress = () => {
    const steps = ['email', 'phone', 'ktp', 'whatsapp'];
    const completed = 3; // Mock completed steps
    return (completed / steps.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="User Dashboard" 
        subtitle={`Welcome back, ${user?.name}!`}
        userType="user"
        notificationCount={3}
      />

      <div className="container mx-auto px-4 py-8">
        <Tabs value={defaultTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Enhanced Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Rp {(stats.totalSpent / 1000000).toFixed(1)}M</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeBookings}</div>
                  <p className="text-xs text-muted-foreground">Currently ongoing</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Favorite Talents</CardTitle>
                  <Heart className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.favoriteCount}</div>
                  <p className="text-xs text-muted-foreground">Saved for quick booking</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.averageRating}</div>
                  <p className="text-xs text-muted-foreground">Based on {stats.completedBookings} bookings</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{booking.talent}</p>
                          <p className="text-sm text-gray-500">{booking.service} • {booking.duration}</p>
                          <p className="text-xs text-gray-400">{booking.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">Rp {booking.amount.toLocaleString()}</p>
                          <Badge className={
                            booking.status === 'completed' ? 'bg-green-100 text-green-600' :
                            booking.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                            'bg-yellow-100 text-yellow-600'
                          }>
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Profile Completion</span>
                    <div className="flex items-center gap-2">
                      <Progress value={getVerificationProgress()} className="w-20" />
                      <span className="text-sm">{Math.round(getVerificationProgress())}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Verification Status</span>
                    <Badge className={stats.verificationStatus === 'verified' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {stats.verificationStatus === 'verified' ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Booking History</CardTitle>
                <p className="text-sm text-gray-600">Track all your bookings and their status</p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Talent</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.id}</TableCell>
                        <TableCell>{booking.talent}</TableCell>
                        <TableCell>{booking.service}</TableCell>
                        <TableCell>{booking.duration}</TableCell>
                        <TableCell>{booking.date}</TableCell>
                        <TableCell>Rp {booking.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              booking.status === 'completed' ? 'bg-green-100 text-green-600' :
                              booking.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                              'bg-yellow-100 text-yellow-600'
                            }
                          >
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {booking.rating ? (
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 mr-1" />
                              <span>{booking.rating}</span>
                            </div>
                          ) : booking.status === 'completed' ? (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleRating(booking.id, 5)}
                            >
                              Rate
                            </Button>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {booking.status === 'completed' && (
                            <Button 
                              size="sm"
                              onClick={() => handleBookAgain(booking.talent)}
                            >
                              Book Again
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoritesTalents.map((talent) => (
                <Card key={talent.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={talent.image} 
                          alt={talent.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <CardTitle className="text-lg">{talent.name}</CardTitle>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm">{talent.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${talent.isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {talent.specialties.map((specialty) => (
                          <Badge key={specialty} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Response time: {talent.responseTime}</p>
                        <p>Total bookings: {talent.totalBookings}</p>
                      </div>
                      <Button className="w-full" onClick={() => handleBookAgain(talent.name)}>
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionHistory userType="user" />
          </TabsContent>

          <TabsContent value="settings">
            <ProfileSettings userType="user" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;
