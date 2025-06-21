
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Star, Calendar, DollarSign, Users, Clock, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const TalentDashboard = () => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [profileData, setProfileData] = useState({
    name: 'Sarah Jakarta',
    bio: 'Friendly and outgoing person who loves meeting new people!',
    zodiac: 'Gemini',
    loveLanguage: 'Quality Time',
    hourlyRate: 85000
  });

  // Mock data
  const stats = {
    totalEarnings: 2500000,
    completedOrders: 45,
    rating: 4.8,
    level: 'Elite Talent',
    nextLevelProgress: 75
  };

  const recentBookings = [
    { id: 'ORD001', user: 'John D.', service: 'Chat', date: '2024-01-15', amount: 25000, status: 'completed' },
    { id: 'ORD002', user: 'Jane S.', service: 'Video Call', date: '2024-01-14', amount: 65000, status: 'in-progress' },
    { id: 'ORD003', user: 'Bob W.', service: 'Offline Date', date: '2024-01-13', amount: 285000, status: 'confirmed' }
  ];

  const availableServices = [
    { id: 'chat', name: 'Chat', basePrice: 25000, enabled: true },
    { id: 'call', name: 'Call', basePrice: 40000, enabled: true },
    { id: 'video-call', name: 'Video Call', basePrice: 65000, enabled: true },
    { id: 'offline-date', name: 'Offline Date', basePrice: 285000, enabled: true },
    { id: 'party-buddy', name: 'Party Buddy', basePrice: 1000000, enabled: false },
    { id: 'rent-lover', name: 'Rent a Lover', basePrice: 85000, enabled: true }
  ];

  const interests = [
    'Sushi Date', 'Museum Date', 'Picnic Date', 'Movie Date', 
    'Golf', 'Tennis', 'Coffee Shop', 'Shopping', 'Karaoke', 'Gaming'
  ];

  const [selectedInterests, setSelectedInterests] = useState(['Sushi Date', 'Movie Date', 'Coffee Shop']);
  const [selectedServices, setSelectedServices] = useState(['chat', 'call', 'video-call', 'rent-lover']);

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Talent Dashboard</h1>
              <p className="text-gray-600">Welcome back, {profileData.name}!</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="availability">Available for bookings</Label>
                <Switch 
                  id="availability"
                  checked={isAvailable} 
                  onCheckedChange={setIsAvailable} 
                />
              </div>
              <Badge className={stats.level === 'VIP Talent' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}>
                {stats.level}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp {(stats.totalEarnings / 1000000).toFixed(1)}M</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rating}/5</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Level Progress</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.nextLevelProgress}%</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="profile">Profile Settings</TabsTrigger>
            <TabsTrigger value="services">Services & Rates</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.id}</TableCell>
                        <TableCell>{booking.user}</TableCell>
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Display Name</Label>
                    <Input 
                      id="name"
                      value={profileData.name} 
                      onChange={(e) => setProfileData(prev => ({...prev, name: e.target.value}))} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zodiac">Zodiac Sign</Label>
                    <Select value={profileData.zodiac} onValueChange={(value) => setProfileData(prev => ({...prev, zodiac: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aries">Aries</SelectItem>
                        <SelectItem value="Gemini">Gemini</SelectItem>
                        <SelectItem value="Leo">Leo</SelectItem>
                        <SelectItem value="Virgo">Virgo</SelectItem>
                        <SelectItem value="Libra">Libra</SelectItem>
                        <SelectItem value="Scorpio">Scorpio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="love-language">Love Language</Label>
                  <Select value={profileData.loveLanguage} onValueChange={(value) => setProfileData(prev => ({...prev, loveLanguage: value}))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Quality Time">Quality Time</SelectItem>
                      <SelectItem value="Words of Affirmation">Words of Affirmation</SelectItem>
                      <SelectItem value="Physical Touch">Physical Touch</SelectItem>
                      <SelectItem value="Acts of Service">Acts of Service</SelectItem>
                      <SelectItem value="Receiving Gifts">Receiving Gifts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio"
                    value={profileData.bio} 
                    onChange={(e) => setProfileData(prev => ({...prev, bio: e.target.value}))}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Interests</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {interests.map((interest) => (
                      <div key={interest} className="flex items-center space-x-2">
                        <Checkbox 
                          id={interest}
                          checked={selectedInterests.includes(interest)}
                          onCheckedChange={() => handleInterestToggle(interest)}
                        />
                        <Label htmlFor={interest} className="text-sm">{interest}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full md:w-auto">Save Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Available Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableServices.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          checked={selectedServices.includes(service.id)}
                          onCheckedChange={() => handleServiceToggle(service.id)}
                          disabled={service.id === 'party-buddy'} // Only 21+ can enable this
                        />
                        <div>
                          <Label className="font-medium">{service.name}</Label>
                          <p className="text-sm text-gray-500">Base: Rp {service.basePrice.toLocaleString()}</p>
                        </div>
                      </div>
                      {selectedServices.includes(service.id) && (
                        <div className="flex items-center space-x-2">
                          <Label className="text-sm">Your Rate:</Label>
                          <Input 
                            type="number" 
                            defaultValue={service.basePrice} 
                            className="w-24" 
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Availability Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Offline Date Availability</h3>
                      <div className="space-y-2">
                        <Label>Weekdays</Label>
                        <div className="flex gap-2">
                          <Input type="time" defaultValue="17:00" />
                          <span className="self-center">to</span>
                          <Input type="time" defaultValue="22:00" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Weekends</Label>
                        <div className="flex gap-2">
                          <Input type="time" defaultValue="10:00" />
                          <span className="self-center">to</span>
                          <Input type="time" defaultValue="23:00" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold">Party Buddy Availability</h3>
                      <div className="space-y-2">
                        <Label>Weekend Nights</Label>
                        <div className="flex gap-2">
                          <Input type="time" defaultValue="20:00" />
                          <span className="self-center">to</span>
                          <Input type="time" defaultValue="04:00" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button>Save Schedule</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TalentDashboard;
