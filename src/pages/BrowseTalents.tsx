import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, MapPin } from 'lucide-react';
import TalentCard from '@/components/TalentCard';
import Footer from '@/components/Footer';
import MainHeader from '@/components/MainHeader';

const BrowseTalents = () => {
  const [selectedCity, setSelectedCity] = useState('Jakarta');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const cities = ['Jakarta', 'Surabaya', 'Bandung', 'Yogyakarta', 'Bali', 'Medan'];

  const services = [
    { id: 'all', name: 'All Services' },
    { id: 'chat', name: 'Chat' },
    { id: 'call', name: 'Voice Call' },
    { id: 'video', name: 'Video Call' },
    { id: 'offline-date', name: 'Offline Date' },
    { id: 'party-buddy', name: 'Party Buddy' },
    { id: 'rent-a-lover', name: 'Rent a Lover' }
  ];

  const levels = [
    { id: 'all', name: 'All Levels' },
    { id: 'fresh', name: 'Fresh Talent' },
    { id: 'elite', name: 'Elite Talent' },
    { id: 'vip', name: 'VIP Talent' }
  ];

  // Mock talents data
  const allTalents = [
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
    },
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
    }
  ];

  const filteredTalents = allTalents.filter(talent => {
    const matchesCity = talent.city === selectedCity;
    const matchesSearch = talent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         talent.interests.some(interest => interest.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesService = selectedService === 'all' || talent.services.includes(selectedService);
    const matchesLevel = selectedLevel === 'all' || 
                        (selectedLevel === 'fresh' && talent.level === 'Fresh Talent') ||
                        (selectedLevel === 'elite' && talent.level === 'Elite Talent') ||
                        (selectedLevel === 'vip' && talent.level === 'VIP Talent');
    
    return matchesCity && matchesSearch && matchesService && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Talents</h1>
          <p className="text-gray-600">Temukan talent yang sempurna untuk kebutuhan Anda</p>
        </div>
        
        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* City Filter */}
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <MapPin className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Cari nama atau minat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Service Filter */}
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Level Filter */}
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level.id} value={level.id}>{level.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {filteredTalents.length} Talent ditemukan di {selectedCity}
          </h2>
        </div>

        {/* Talent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredTalents.map((talent) => (
            <TalentCard key={talent.id} talent={talent} />
          ))}
        </div>

        {filteredTalents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Tidak ada talent yang sesuai dengan filter Anda</p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setSelectedService('all');
                setSelectedLevel('all');
              }}
              className="mt-4"
              variant="outline"
            >
              Reset Filter
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BrowseTalents;
