import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, MessageCircle, Phone, Video, MapPin, Search, Filter, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';
import TalentCard from '@/components/TalentCard';
import MainHeader from '@/components/MainHeader';

const Index = () => {
  const [selectedCity, setSelectedCity] = useState('Jakarta');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('all');

  const cities = ['Jakarta', 'Surabaya', 'Bandung', 'Yogyakarta', 'Bali', 'Medan'];

  const services = [
    { id: 'all', name: 'All Services', icon: '🎯' },
    { id: 'chat', name: 'Chat', icon: '💬' },
    { id: 'call', name: 'Voice Call', icon: '📞' },
    { id: 'video', name: 'Video Call', icon: '📹' },
    { id: 'offline-date', name: 'Offline Date', icon: '❤️' },
    { id: 'party-buddy', name: 'Party Buddy', icon: '🎉' },
    { id: 'rent-a-lover', name: 'Rent a Lover', icon: '💕' }
  ];

  const featuredTalents = [
    {
      id: 1,
      name: 'Sari',
      age: 24,
      city: 'Jakarta',
      rating: 4.8,
      reviewCount: 127,
      level: 'VIP Talent',
      image: '/placeholder.svg',
      services: ['chat', 'call', 'video', 'offline-date'],
      interests: ['sushi date', 'museum date', 'movie date'],
      zodiac: 'Leo',
      loveLanguage: 'Quality Time',
      description: 'Friendly companion for deep conversations and fun dates',
      priceRange: '25k - 285k',
      isOnline: true,
      verified: true,
      availability: 'Weekdays 5-10 PM'
    },
    {
      id: 2,
      name: 'Maya',
      age: 22,
      city: 'Jakarta',
      rating: 4.9,
      reviewCount: 89,
      level: 'Elite Talent',
      image: '/placeholder.svg',
      services: ['chat', 'call', 'rent-a-lover'],
      interests: ['picnic date', 'coffee chat', 'gaming'],
      zodiac: 'Gemini',
      loveLanguage: 'Words of Affirmation',
      description: 'Sweet and caring virtual girlfriend experience',
      priceRange: '25k - 85k',
      isOnline: true,
      verified: true,
      availability: 'Daily 7 AM - 11 PM'
    },
    {
      id: 3,
      name: 'Kania',
      age: 26,
      city: 'Jakarta',
      rating: 4.7,
      reviewCount: 156,
      level: 'VIP Talent',
      image: '/placeholder.svg',
      services: ['party-buddy', 'offline-date', 'video'],
      interests: ['nightlife', 'cocktails', 'dancing'],
      zodiac: 'Scorpio',
      loveLanguage: 'Physical Touch',
      description: 'Perfect party companion for nightlife adventures',
      priceRange: '65k - 1M',
      isOnline: false,
      verified: true,
      availability: 'Weekends 8 PM - 4 AM'
    }
  ];

  const newcomers = [
    {
      id: 4,
      name: 'Dinda',
      age: 23,
      city: 'Jakarta',
      rating: 0,
      reviewCount: 0,
      level: 'Fresh Talent',
      image: '/placeholder.svg',
      services: ['chat', 'call'],
      interests: ['anime', 'books', 'cooking'],
      zodiac: 'Virgo',
      loveLanguage: 'Acts of Service',
      description: 'New talent ready to be your perfect companion',
      priceRange: '25k - 40k',
      isOnline: true,
      verified: true,
      availability: 'Evenings 6-10 PM'
    },
    {
      id: 5,
      name: 'Rina',
      age: 25,
      city: 'Jakarta',
      rating: 0,
      reviewCount: 0,
      level: 'Fresh Talent',
      image: '/placeholder.svg',
      services: ['offline-date', 'video'],
      interests: ['art gallery', 'yoga', 'hiking'],
      zodiac: 'Aquarius',
      loveLanguage: 'Gift Giving',
      description: 'Art lover seeking meaningful connections',
      priceRange: '65k - 285k',
      isOnline: true,
      verified: true,
      availability: 'Weekends Only'
    }
  ];

  const filteredTalents = [...featuredTalents, ...newcomers].filter(talent => {
    const matchesCity = talent.city === selectedCity;
    const matchesSearch = talent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         talent.interests.some(interest => interest.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesService = selectedService === 'all' || talent.services.includes(selectedService);
    
    return matchesCity && matchesSearch && matchesService;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Temukan Teman <span className="text-pink-500">Perfect</span> Anda
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Platform rental talent terpercaya untuk kebutuhan sosial Anda. 
            Chat, call, video call, offline date, hingga party buddy.
          </p>
          
          {/* Service Overview */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Chat</p>
              <p className="text-xs text-gray-500">25k/hari</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <Phone className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Voice Call</p>
              <p className="text-xs text-gray-500">40k/jam</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <Video className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Video Call</p>
              <p className="text-xs text-gray-500">65k/jam</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Offline Date</p>
              <p className="text-xs text-gray-500">285k/3jam</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <Users className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Party Buddy</p>
              <p className="text-xs text-gray-500">1M/event</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <Star className="w-8 h-8 text-pink-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Rent a Lover</p>
              <p className="text-xs text-gray-500">up to 85k/hari</p>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex flex-wrap gap-4 items-center">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-48">
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="relative flex-1 min-w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Cari nama talent atau minat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.icon} {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Featured Talents */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">✨ Featured Talents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTalents
              .filter(talent => talent.city === selectedCity)
              .map((talent) => (
                <TalentCard key={talent.id} talent={talent} />
              ))}
          </div>
        </section>

        {/* Newcomers */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">🌟 Newcomers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newcomers
              .filter(talent => talent.city === selectedCity)
              .map((talent) => (
                <TalentCard key={talent.id} talent={talent} isNewcomer />
              ))}
          </div>
        </section>

        {/* All Talents */}
        {searchQuery || selectedService !== 'all' ? (
          <section>
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Hasil Pencarian ({filteredTalents.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTalents.map((talent) => (
                <TalentCard key={talent.id} talent={talent} />
              ))}
            </div>
            {filteredTalents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Tidak ada talent yang ditemukan</p>
              </div>
            )}
          </section>
        ) : null}
      </div>

      <Footer />
    </div>
  );
};

export default Index;
