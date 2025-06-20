
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Phone, Video, MapPin, Calendar, Star, Search, Filter } from 'lucide-react';

const Index = () => {
  const [selectedCity, setSelectedCity] = useState('Jakarta');
  const [searchQuery, setSearchQuery] = useState('');

  const cities = ['Jakarta', 'Surabaya', 'Bandung', 'Yogyakarta', 'Bali', 'Medan'];

  const services = [
    { name: 'Chat', price: '25k', period: '/hari', icon: MessageCircle, color: 'bg-blue-500' },
    { name: 'Call', price: '40k', period: '/jam', icon: Phone, color: 'bg-green-500' },
    { name: 'Video Call', price: '65k', period: '/jam', icon: Video, color: 'bg-purple-500' },
    { name: 'Offline Date', price: '285k', period: '/3 jam', icon: MapPin, color: 'bg-pink-500' },
    { name: 'Party Buddy', price: '1,000k', period: '/event', icon: Calendar, color: 'bg-orange-500' },
    { name: 'Rent a Lover', price: 'up to 85k', period: '/hari', icon: Heart, color: 'bg-red-500' }
  ];

  const featuredTalents = [
    {
      id: 1,
      name: 'Sarah',
      age: 24,
      city: 'Jakarta',
      rating: 4.9,
      reviews: 45,
      level: 'VIP',
      avatar: '/placeholder.svg',
      interests: ['Sushi Date', 'Museum', 'Movie'],
      zodiac: 'Gemini',
      loveLanguage: 'Quality Time',
      services: ['Chat', 'Call', 'Video Call', 'Offline Date'],
      verified: true
    },
    {
      id: 2,
      name: 'Maya',
      age: 23,
      city: 'Jakarta',
      rating: 4.8,
      reviews: 32,
      level: 'Elite',
      avatar: '/placeholder.svg',
      interests: ['Picnic Date', 'Tennis', 'Coffee'],
      zodiac: 'Leo',
      loveLanguage: 'Words of Affirmation',
      services: ['Chat', 'Call', 'Offline Date'],
      verified: true
    },
    {
      id: 3,
      name: 'Kira',
      age: 22,
      city: 'Jakarta',
      rating: 4.7,
      reviews: 28,
      level: 'Elite',
      avatar: '/placeholder.svg',
      interests: ['Movie Date', 'Golf', 'Shopping'],
      zodiac: 'Scorpio',
      loveLanguage: 'Physical Touch',
      services: ['Chat', 'Video Call', 'Party Buddy'],
      verified: true
    }
  ];

  const newcomers = [
    {
      id: 4,
      name: 'Luna',
      age: 21,
      city: 'Jakarta',
      rating: 5.0,
      reviews: 3,
      level: 'Fresh',
      avatar: '/placeholder.svg',
      interests: ['Art Gallery', 'Cafe', 'Book Store'],
      zodiac: 'Pisces',
      loveLanguage: 'Acts of Service',
      services: ['Chat', 'Call'],
      verified: true
    },
    {
      id: 5,
      name: 'Aria',
      age: 23,
      city: 'Jakarta',
      rating: 4.6,
      reviews: 8,
      level: 'Fresh',
      avatar: '/placeholder.svg',
      interests: ['Karaoke', 'Food Tour', 'Gaming'],
      zodiac: 'Aries',
      loveLanguage: 'Gift Giving',
      services: ['Chat', 'Video Call', 'Offline Date'],
      verified: true
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'VIP': return 'bg-purple-600 text-white';
      case 'Elite': return 'bg-blue-600 text-white';
      case 'Fresh': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const handleBookNow = (talentId: number) => {
    console.log(`Booking talent with ID: ${talentId}`);
    // Here you would implement the booking flow
    alert(`Booking request for talent ID: ${talentId}. This will redirect to booking page.`);
  };

  const handleLogin = () => {
    console.log('Login button clicked');
    alert('Login functionality will be implemented here');
  };

  const handleSignUp = () => {
    console.log('Sign up button clicked');
    alert('Sign up functionality will be implemented here');
  };

  const handleBecomeTalent = () => {
    console.log('Become a talent button clicked');
    alert('Become a talent registration will be implemented here');
  };

  const handleFindMatch = () => {
    console.log('Find your match button clicked');
    alert('Find match functionality will be implemented here');
  };

  const TalentCard = ({ talent }: { talent: any }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={talent.avatar} 
          alt={talent.name}
          className="w-full h-48 object-cover"
        />
        <Badge className={`absolute top-2 right-2 ${getLevelColor(talent.level)}`}>
          {talent.level}
        </Badge>
        {talent.verified && (
          <Badge className="absolute top-2 left-2 bg-blue-500 text-white">
            Verified
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg">{talent.name}, {talent.age}</h3>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {talent.city}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{talent.rating}</span>
            </div>
            <p className="text-xs text-gray-500">{talent.reviews} reviews</p>
          </div>
        </div>
        
        <div className="mb-3">
          <p className="text-xs text-gray-600 mb-1">Zodiac: {talent.zodiac} • Love Language: {talent.loveLanguage}</p>
          <div className="flex flex-wrap gap-1">
            {talent.interests.slice(0, 3).map((interest: string) => (
              <Badge key={interest} variant="outline" className="text-xs">
                {interest}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {talent.services.map((service: string) => (
            <Badge key={service} variant="secondary" className="text-xs">
              {service}
            </Badge>
          ))}
        </div>

        <Button 
          onClick={() => handleBookNow(talent.id)}
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 font-medium"
        >
          Book Now
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/a8b92c73-b6d3-423f-9e71-b61f792f8a7a.png" 
                alt="Temanly Logo"
                className="h-16 w-auto"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleLogin}
                className="text-white border-white hover:bg-white hover:text-gray-900"
              >
                Login
              </Button>
              <Button 
                onClick={handleSignUp}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 font-medium"
              >
                Sign Up
              </Button>
            </div>
          </div>

          {/* City Selection */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Select Your City</h2>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <Button
                  key={city}
                  variant={selectedCity === city ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCity(city)}
                  className={selectedCity === city 
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 hover:from-yellow-500 hover:to-yellow-700 font-medium" 
                    : "text-white border-white hover:bg-white hover:text-gray-900"
                  }
                >
                  {city}
                </Button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search talents by name, interests, or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-300"
              />
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className="text-white border-white hover:bg-white hover:text-gray-900"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Services Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <Card key={service.name} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 ${service.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1">{service.name}</h3>
                  <p className="text-lg font-bold text-yellow-600">
                    IDR {service.price}<span className="text-sm text-gray-500">{service.period}</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Talents */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Talents in {selectedCity}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTalents.map((talent) => (
              <TalentCard key={talent.id} talent={talent} />
            ))}
          </div>
        </section>

        {/* Newcomers */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Newcomers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newcomers.map((talent) => (
              <TalentCard key={talent.id} talent={talent} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-12 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Connect?</h2>
          <p className="text-lg mb-6 text-gray-300">Join thousands of users finding meaningful connections</p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={handleBecomeTalent}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 font-medium px-8"
            >
              Become a Talent
            </Button>
            <Button 
              variant="outline" 
              onClick={handleFindMatch}
              className="text-white border-white hover:bg-white hover:text-gray-900 px-8"
            >
              Find Your Match
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img 
              src="/lovable-uploads/a8b92c73-b6d3-423f-9e71-b61f792f8a7a.png" 
              alt="Temanly Logo"
              className="h-8 w-auto"
            />
          </div>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
