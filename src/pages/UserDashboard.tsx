
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Star, Calendar, DollarSign, User, CheckCircle, AlertTriangle, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

const UserDashboard = () => {
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+62812345678',
    verified: false
  });

  // Mock data
  const stats = {
    totalSpent: 1500000,
    completedBookings: 12,
    favoriteCount: 5,
    verificationStatus: 'pending'
  };

  const recentBookings = [
    { 
      id: 'ORD001', 
      talent: 'Sarah Jakarta', 
      service: 'Chat', 
      date: '2024-01-15', 
      amount: 25000, 
      status: 'completed',
      rating: 5
    },
    { 
      id: 'ORD002', 
      talent: 'Maya Bandung', 
      service: 'Video Call', 
      date: '2024-01-14', 
      amount: 65000, 
      status: 'in-progress',
      rating: null
    },
    { 
      id: 'ORD003', 
      talent: 'Andi Surabaya', 
      service: 'Offline Date', 
      date: '2024-01-13', 
      amount: 285000, 
      status: 'confirmed',
      rating: null
    }
  ];

  const favoritesTalents = [
    { 
      id: 1, 
      name: 'Sarah Jakarta', 
      rating: 4.9, 
      specialties: ['Chat', 'Video Call', 'Rent a Lover'],
      image: '/placeholder.svg',
      isOnline: true
    },
    { 
      id: 2, 
      name: 'Maya Bandung', 
      rating: 4.8, 
      specialties: ['Offline Date', 'Party Buddy'],
      image: '/placeholder.svg',
      isOnline: false
    }
  ];

  const verificationSteps = [
    { step: 'Email Verification', completed: true, required: true },
    { step: 'Phone Verification', completed: true, required: true },
    { step: 'KTP Verification', completed: false, required: true },
    { step: 'WhatsApp Verification', completed: false, required: false }
  ];

  const handleRating = (bookingId: string, rating: number) => {
    console.log(`Rating ${rating} for booking ${bookingId}`);
    // Implementation here
  };

  const handleBookAgain = (talentName: string) => {
    console.log(`Book again with ${talentName}`);
    // Implementation here
  };

  const getVerificationProgress = () => {
    const completed = verificationSteps.filter(step => step.completed).length;
    return (completed / verificationSteps.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
              <p className="text-gray-600">Welcome back, {profileData.name}!</p>
            </div>
            <div className="flex items-center gap-4">
              {stats.verificationStatus !== 'verified' && (
                <Badge className="bg-yellow-100 text-yellow-600">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Verification Pending
                </Badge>
              )}
              {stats.verificationStatus === 'verified' && (
                <Badge className="bg-green-100 text-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified User
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp {(stats.totalSpent / 1000000).toFixed(1)}M</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedBookings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Favorite Talents</CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.favoriteCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(getVerificationProgress())}%</div>
              <Progress value={getVerificationProgress()} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Booking History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Talent</TableHead>
                      <TableHead>Service</TableHead>
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
                      <Button className="w-full" onClick={() => handleBookAgain(talent.name)}>
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name"
                      value={profileData.name} 
                      onChange={(e) => setProfileData(prev => ({...prev, name: e.target.value}))} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      type="email"
                      value={profileData.email} 
                      onChange={(e) => setProfileData(prev => ({...prev, email: e.target.value}))} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone"
                    value={profileData.phone} 
                    onChange={(e) => setProfileData(prev => ({...prev, phone: e.target.value}))} 
                  />
                </div>

                <Button className="w-full md:w-auto">Save Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification">
            <Card>
              <CardHeader>
                <CardTitle>Account Verification</CardTitle>
                <p className="text-sm text-gray-600">
                  Complete verification to access all services including Offline Date and Party Buddy
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {verificationSteps.map((step, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {step.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                        )}
                        <div>
                          <span className="font-medium">{step.step}</span>
                          {step.required && (
                            <Badge className="ml-2 bg-red-100 text-red-600 text-xs">Required</Badge>
                          )}
                        </div>
                      </div>
                      {!step.completed && (
                        <Button size="sm" variant="outline">
                          Complete
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Verification Benefits</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Access to Offline Date services</li>
                    <li>• Access to Party Buddy services (21+ only)</li>
                    <li>• Higher booking priority</li>
                    <li>• Enhanced security features</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;
