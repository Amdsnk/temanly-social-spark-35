import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, MessageCircle, Phone, Video, MapPin, Calendar, Star, Search, Filter, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';

const Index = () => {
  const [selectedCity, setSelectedCity] = useState('Jakarta');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('For You');

  const cities = ['Jakarta', 'Surabaya', 'Bandung', 'Yogyakarta', 'Bali', 'Medan'];

  const categories = [
    { name: 'For You', icon: '💛', active: true },
    { name: 'Games', icon: '🎮', active: false },
    { name: 'E-Meet', icon: '💬', active: false },
    { name: 'Meals', icon: '🍽️', active: false },
    { name: 'Drinks', icon: '🍸', active: false },
    { name: 'Mobile Legends', icon: '🎯', active: false }
  ];

  const filterTags = [
    { name: 'Most Spenders', icon: '🔥', color: 'bg-orange-100 text-orange-600' },
    { name: 'Newest Members', icon: '👥', color: 'bg-blue-100 text-blue-600' },
    { name: 'Most Earners', icon: '💰', color: 'bg-green-100 text-green-600' },
    { name: 'Potential Members', icon: '✅', color: 'bg-emerald-100 text-emerald-600' },
    { name: 'Join Telegram', icon: '📱', color: 'bg-sky-100 text-sky-600' },
    { name: 'Join Discord', icon: '🎮', color: 'bg-purple-100 text-purple-600' },
    { name: 'About Us', icon: '❓', color: 'bg-gray-100 text-gray-600' }
  ];

  const talents = [
    {
      id: 1,
      name: 'Beboo',
      description: 'dinner with a beautiful story?',
      category: 'Fine Dining',
      rating: '---',
      priceRange: '10.00 ~ 30.00',
      image: '/placeholder.svg',
      isOnline: true,
      verified: true
    },
    {
      id: 2,
      name: 'Penlibels',
      description: 'Looking for a fun conversation partner',
      category: 'Chat & Call',
      rating: '---',
      priceRange: '00.00 ~ 00.00',
      image: '/placeholder.svg',
      isOnline: false,
      verified: true
    },
    {
      id: 3,
      name: 'Yayang',
      description: 'Adventure and outdoor activities',
      category: 'Outdoor Date',
      rating: '---',
      priceRange: '00.00 ~ 00.00',
      image: '/placeholder.svg',
      isOnline: true,
      verified: true
    }
  ];

  const handleBookNow = (talentId: number) => {
    console.log(`Booking talent with ID: ${talentId}`);
    alert(`Booking request for talent ID: ${talentId}. This will redirect to booking page.`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Navigation */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <img 
                  src="/lovable-uploads/f3ebdf6a-39b9-44d3-b1c2-44a55f8ff2d4.png" 
                  alt="Temanly Logo"
                  className="h-10 w-auto"
                />
              </div>
              <nav className="hidden md:flex items-center gap-6">
                <Link to="/rent" className="text-gray-700 hover:text-gray-900 font-medium">Rent</Link>
                <Link to="/faq" className="text-gray-700 hover:text-gray-900 font-medium">FAQ</Link>
                <Link to="/terms" className="text-gray-700 hover:text-gray-900 font-medium">Terms</Link>
                <Link to="/contact" className="text-gray-700 hover:text-gray-900 font-medium">Contact</Link>
              </nav>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <img src="/placeholder.svg" alt="EN" className="w-5 h-5" />
                <span className="text-gray-700">EN</span>
              </div>
              <Link to="/rent">
                <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-6">
                  ⭐ Be Teman
                </Button>
              </Link>
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                Login
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* What's New Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">What's New</h2>
          <div className="flex flex-wrap gap-3">
            {filterTags.map((tag) => (
              <Badge
                key={tag.name}
                className={`${tag.color} border-0 px-4 py-2 rounded-full font-medium text-sm cursor-pointer hover:opacity-80`}
              >
                <span className="mr-2">{tag.icon}</span>
                {tag.name}
              </Badge>
            ))}
          </div>
        </section>

        {/* Find Your Match Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Find your match</h2>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-3 mb-6">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                className={`rounded-full px-6 py-2 font-medium ${
                  selectedCategory === category.name 
                    ? 'bg-yellow-400 text-black hover:bg-yellow-500 border-0' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-0'
                }`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-40 bg-white border-gray-300 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative flex-1 max-w-xs">
              <Input
                placeholder="Type username"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border-gray-300 rounded-lg pl-4"
              />
            </div>

            <Select defaultValue="highest">
              <SelectTrigger className="w-40 bg-white border-gray-300 rounded-lg">
                <SelectValue placeholder="Highest Ratings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="highest">Highest Ratings</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="public">
              <SelectTrigger className="w-32 bg-white border-gray-300 rounded-lg">
                <SelectValue placeholder="Public" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-gender">
              <SelectTrigger className="w-36 bg-white border-gray-300 rounded-lg">
                <SelectValue placeholder="All Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-gender">All Gender</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-ethnicity">
              <SelectTrigger className="w-36 bg-white border-gray-300 rounded-lg">
                <SelectValue placeholder="All Ethnicity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-ethnicity">All Ethnicity</SelectItem>
                <SelectItem value="asian">Asian</SelectItem>
                <SelectItem value="european">European</SelectItem>
              </SelectContent>
            </Select>

            <Button className="bg-black text-white hover:bg-gray-800 rounded-lg px-8">
              Apply
            </Button>
          </div>
        </section>

        {/* Talents Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {talents.map((talent) => (
              <Card key={talent.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border-0">
                <div className="relative">
                  <img 
                    src={talent.image} 
                    alt={talent.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-medium">
                      {talent.name}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Button size="icon" variant="ghost" className="bg-black/20 hover:bg-black/40 text-white rounded-full">
                      <Heart className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-black/70 text-white px-3 py-1 rounded-lg text-xs">
                      {talent.description}
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      {talent.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-medium">{talent.rating}</span>
                      <span className="text-sm text-gray-500">💰 {talent.priceRange}</span>
                    </div>
                    <Button 
                      onClick={() => handleBookNow(talent.id)}
                      size="sm"
                      className="bg-yellow-400 text-black hover:bg-yellow-500 rounded-lg font-medium"
                    >
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-500">You've Reached the End</p>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
