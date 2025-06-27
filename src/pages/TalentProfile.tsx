import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, MapPin, Clock, Heart, MessageCircle, Phone, Video, Users, ArrowLeft, Calendar, Shield } from 'lucide-react';
import Footer from '@/components/Footer';
import MainHeader from '@/components/MainHeader';
import VerificationStatus from '@/components/VerificationStatus';
import ServiceRestrictionNotice from '@/components/ServiceRestrictionNotice';
import { useAuth } from '@/contexts/AuthContext';
import { getServiceRestrictions } from '@/utils/serviceCalculations';
import { useToast } from '@/hooks/use-toast';

const TalentProfile = () => {
  const { id } = useParams();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  // Mock talent data - in real app, fetch based on ID
  const talent = {
    id: 1,
    name: 'Sarah Jakarta',
    age: 24,
    city: 'Jakarta',
    rating: 4.9,
    reviewCount: 127,
    level: 'Elite Talent',
    image: '/placeholder.svg',
    bio: 'Hai! Aku Sarah, seorang yang ramah dan suka bertemu orang baru. Aku suka mengobrol tentang berbagai hal, dari hobi hingga cerita hidup. Kalau kamu butuh teman curhat atau sekedar ngobrol santai, aku siap menemani!',
    services: ['chat', 'call', 'video', 'offline-date'],
    interests: ['sushi date', 'museum date', 'movie date', 'coffee chat', 'shopping'],
    zodiac: 'Leo',
    loveLanguage: 'Quality Time',
    isOnline: true,
    verified: true,
    availability: 'Weekdays 5-10 PM',
    photos: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    pricing: {
      chat: 25000,
      call: 40000,
      video: 65000,
      'offline-date': 285000,
      'rent-a-lover': 85000
    },
    reviews: [
      {
        id: 1,
        user: 'Andi M.',
        rating: 5,
        comment: 'Sarah sangat ramah dan mudah diajak ngobrol. Waktu berlalu begitu cepat!',
        date: '2024-12-15',
        service: 'Chat'
      },
      {
        id: 2,
        user: 'Budi K.',
        rating: 5,
        comment: 'Pengalaman offline date yang menyenangkan. Sarah tahu tempat-tempat keren di Jakarta.',
        date: '2024-12-10',
        service: 'Offline Date'
      }
    ]
  };

  const isVerified = user?.verified || false;
  const restrictedServices = getServiceRestrictions(isVerified);

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'chat': return <MessageCircle className="w-4 h-4" />;
      case 'call': return <Phone className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'offline-date': return <Heart className="w-4 h-4" />;
      case 'party-buddy': return <Users className="w-4 h-4" />;
      default: return null;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'VIP Talent': return 'bg-purple-100 text-purple-700';
      case 'Elite Talent': return 'bg-blue-100 text-blue-700';
      case 'Fresh Talent': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleBookmark = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Silakan login untuk menambahkan talent ke favorites.",
        variant: "destructive"
      });
      return;
    }

    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Removed from Favorites" : "Added to Favorites",
      description: isBookmarked 
        ? `${talent.name} telah dihapus dari favorites Anda.`
        : `${talent.name} telah ditambahkan ke favorites Anda.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Service Restriction Notice */}
            {isAuthenticated && (
              <ServiceRestrictionNotice 
                isVerified={isVerified}
                restrictedServices={restrictedServices}
              />
            )}
            
            {/* Hero Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative">
                    <img 
                      src={talent.image} 
                      alt={talent.name}
                      className="w-48 h-48 rounded-xl object-cover mx-auto"
                    />
                    {talent.isOnline && (
                      <div className="absolute -top-2 -right-2">
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          Online
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <h1 className="text-2xl font-bold">{talent.name}, {talent.age}</h1>
                          {talent.verified && (
                            <Badge className="bg-blue-500 text-white">
                              <Shield className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleBookmark}
                          className={`${isBookmarked ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
                        >
                          <Heart className={`w-6 h-6 ${isBookmarked ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                      <div className="flex items-center gap-4 text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{talent.city}</span>
                        </div>
                        <span>•</span>
                        <span>{talent.zodiac}</span>
                        <span>•</span>
                        <span>{talent.loveLanguage}</span>
                      </div>
                      <Badge className={`${getLevelColor(talent.level)} mb-3`}>
                        {talent.level}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="font-bold text-lg">{talent.rating}</span>
                        <span className="text-gray-500">({talent.reviewCount} reviews)</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{talent.availability}</span>
                    </div>

                    <p className="text-gray-700">{talent.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs Content */}
            <Tabs defaultValue="services" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="services">Layanan</TabsTrigger>
                <TabsTrigger value="gallery">Galeri</TabsTrigger>
                <TabsTrigger value="reviews">Review</TabsTrigger>
                <TabsTrigger value="interests">Minat</TabsTrigger>
              </TabsList>

              <TabsContent value="services">
                <Card>
                  <CardHeader>
                    <CardTitle>Layanan & Harga</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {talent.services.map((service) => (
                        <div key={service} className="border rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-2">
                            {getServiceIcon(service)}
                            <h3 className="font-medium capitalize">{service.replace('-', ' ')}</h3>
                          </div>
                          <p className="text-2xl font-bold text-blue-600">
                            Rp {talent.pricing[service as keyof typeof talent.pricing]?.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {service === 'chat' ? '/hari' : 
                             service === 'offline-date' ? '/3 jam' : 
                             service === 'rent-a-lover' ? '/hari' : '/jam'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="gallery">
                <Card>
                  <CardHeader>
                    <CardTitle>Galeri Foto</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {talent.photos.map((photo, index) => (
                        <img 
                          key={index}
                          src={photo} 
                          alt={`${talent.name} photo ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Review & Rating</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {talent.reviews.map((review) => (
                        <div key={review.id} className="border-b pb-4 last:border-b-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="font-medium">{review.user}</span>
                              <Badge variant="outline" className="text-xs">{review.service}</Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 mb-1">{review.comment}</p>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="interests">
                <Card>
                  <CardHeader>
                    <CardTitle>Minat & Aktivitas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {talent.interests.map((interest) => (
                        <Badge key={interest} variant="outline" className="text-sm">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Book {talent.name}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBookmark}
                    className={`${isBookmarked ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
                  >
                    <Heart className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* User Status */}
                {isAuthenticated && user && (
                  <div className="text-center pb-4 border-b">
                    <VerificationStatus user={user} />
                  </div>
                )}
                
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Mulai dari</p>
                  <p className="text-2xl font-bold text-blue-600">Rp 25.000</p>
                  <p className="text-sm text-gray-500">per hari</p>
                </div>
                
                <div className="space-y-2">
                  {isAuthenticated ? (
                    <Link to={`/booking?talent=${talent.id}`} className="w-full">
                      <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Sekarang
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/signup" className="w-full">
                      <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                        <Calendar className="w-4 h-4 mr-2" />
                        Login to Book
                      </Button>
                    </Link>
                  )}
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat Dulu
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Layanan Tersedia:</h4>
                  <div className="flex flex-wrap gap-2">
                    {talent.services.map((service) => (
                      <Badge key={service} variant="outline" className="text-xs">
                        {service.replace('-', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TalentProfile;
