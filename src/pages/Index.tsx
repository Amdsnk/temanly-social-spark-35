
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
      case 'VIP': return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white';
      case 'Elite': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
      case 'Fresh': return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const handleBookNow = (talentId: number) => {
    console.log(`Booking talent with ID: ${talentId}`);
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
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white shadow-lg">
      <div className="relative">
        <img 
          src={talent.avatar} 
          alt={talent.name}
          className="w-full h-48 object-cover"
        />
        <Badge className={`absolute top-3 right-3 ${getLevelColor(talent.level)} shadow-lg`}>
          {talent.level}
        </Badge>
        {talent.verified && (
          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg">
            ✓ Verified
          </Badge>
        )}
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-xl text-gray-800">{talent.name}, {talent.age}</h3>
            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4 text-pink-500" />
              {talent.city}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-gray-800">{talent.rating}</span>
            </div>
            <p className="text-xs text-gray-500">{talent.reviews} reviews</p>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">{talent.zodiac} • {talent.loveLanguage}</p>
          <div className="flex flex-wrap gap-2">
            {talent.interests.slice(0, 3).map((interest: string) => (
              <Badge key={interest} variant="outline" className="text-xs border-pink-200 text-pink-700 bg-pink-50">
                {interest}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {talent.services.map((service: string) => (
            <Badge key={service} className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0">
              {service}
            </Badge>
          ))}
        </div>

        <Button 
          onClick={() => handleBookNow(talent.id)}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Book Now
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/a8b92c73-b6d3-423f-9e71-b61f792f8a7a.png" 
                alt="Temanly Logo"
                className="h-16 w-auto"
              />
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleLogin}
                className="text-white border-2 border-white/80 hover:bg-white hover:text-purple-600 font-semibold px-6 py-2 rounded-full transition-all duration-300"
              >
                Login
              </Button>
              <Button 
                onClick={handleSignUp}
                className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-6 py-2 rounded-full shadow-lg transition-all duration-300"
              >
                Sign Up
              </Button>
            </div>
          </div>

          {/* City Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Select Your City</h2>
            <div className="flex flex-wrap gap-3">
              {cities.map((city) => (
                <Button
                  key={city}
                  variant={selectedCity === city ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCity(city)}
                  className={selectedCity === city 
                    ? "bg-white text-purple-600 hover:bg-gray-100 font-semibold px-4 py-2 rounded-full shadow-lg" 
                    : "text-white border-2 border-white/60 hover:bg-white/20 font-medium px-4 py-2 rounded-full transition-all duration-300"
                  }
                >
                  {city}
                </Button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search talents by name, interests, or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-white/95 border-0 text-gray-700 placeholder:text-gray-400 rounded-full py-3 shadow-lg focus:shadow-xl transition-all duration-300"
              />
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className="text-white border-2 border-white/60 hover:bg-white/20 rounded-full p-3 transition-all duration-300"
            >
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Services Overview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.name} className="hover:shadow-xl transition-all duration-300 border-0 bg-white shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-800">{service.name}</h3>
                  <p className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                    IDR {service.price}<span className="text-sm text-gray-500 font-normal">{service.period}</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Talents */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Featured Talents in {selectedCity}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTalents.map((talent) => (
              <TalentCard key={talent.id} talent={talent} />
            ))}
          </div>
        </section>

        {/* Newcomers */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Newcomers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newcomers.map((talent) => (
              <TalentCard key={talent.id} talent={talent} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16 bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 rounded-3xl text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-6">Ready to Connect?</h2>
          <p className="text-xl mb-8 text-white/90">Join thousands of users finding meaningful connections</p>
          <div className="flex gap-6 justify-center flex-wrap">
            <Button 
              onClick={handleBecomeTalent}
              className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-8 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              Become a Talent
            </Button>
            <Button 
              variant="outline" 
              onClick={handleFindMatch}
              className="text-white border-2 border-white hover:bg-white hover:text-purple-600 font-bold px-8 py-4 rounded-full text-lg transition-all duration-300"
            >
              Find Your Match
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img 
              src="/lovable-uploads/a8b92c73-b6d3-423f-9e71-b61f792f8a7a.png" 
              alt="Temanly Logo"
              className="h-10 w-auto"
            />
          </div>
          <div className="flex justify-center gap-8 text-gray-300">
            <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
