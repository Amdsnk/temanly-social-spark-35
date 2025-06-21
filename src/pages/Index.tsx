import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Heart, Users, Shield } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TalentCard from '@/components/TalentCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch featured talents (high rating, elite/vip level)
  const { data: featuredTalents } = useQuery({
    queryKey: ['featured-talents', selectedCity],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          talent_services(*),
          talent_interests(*),
          reviews!reviewee_id(rating)
        `)
        .eq('user_type', 'companion')
        .eq('verification_status', 'verified')
        .eq('is_available', true)
        .in('talent_level', ['elite', 'vip'])
        .gte('rating', 4.5)
        .limit(6);

      if (selectedCity) {
        query = query.eq('city', selectedCity);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch newcomers (recently verified, fresh level)
  const { data: newcomers } = useQuery({
    queryKey: ['newcomers', selectedCity],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          talent_services(*),
          talent_interests(*)
        `)
        .eq('user_type', 'companion')
        .eq('verification_status', 'verified')
        .eq('is_available', true)
        .eq('talent_level', 'fresh')
        .order('created_at', { ascending: false })
        .limit(6);

      if (selectedCity) {
        query = query.eq('city', selectedCity);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch available cities
  const { data: cities } = useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('city')
        .eq('user_type', 'companion')
        .eq('verification_status', 'verified')
        .not('city', 'is', null);

      if (error) throw error;
      
      const uniqueCities = [...new Set(data?.map(p => p.city).filter(Boolean))];
      return uniqueCities;
    }
  });

  const features = [
    {
      icon: <Heart className="h-8 w-8 text-pink-500" />,
      title: "Verified Companions",
      description: "All our talents are verified with KTP and background checks"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: "Safe & Secure",
      description: "Your safety and privacy are our top priorities"
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: "Diverse Services",
      description: "From casual chats to dinner dates and party companions"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-yellow-500 bg-clip-text text-transparent mb-6">
            Find Your Perfect
            <br />
            Companion
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with amazing people for unforgettable experiences. From casual conversations to exciting adventures, find your perfect companion in Indonesia.
          </p>
          
          {/* Search Section */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Cities</SelectItem>
                  {cities?.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                placeholder="Search by interests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-2"
              />
              
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                <Link to="/rent" className="flex items-center gap-2">
                  Find Companions
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Talents Section */}
      {featuredTalents && featuredTalents.length > 0 && (
        <section className="py-16 px-4 bg-white/50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Talents</h2>
              <p className="text-xl text-gray-600">Meet our top-rated companions with excellent reviews</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTalents.map((talent) => (
                <TalentCard key={talent.id} talent={talent} featured />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button asChild size="lg" variant="outline">
                <Link to="/rent">View All Featured Talents</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Newcomers Section */}
      {newcomers && newcomers.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">New Talents</h2>
              <p className="text-xl text-gray-600">Welcome our newest verified companions</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newcomers.map((talent) => (
                <TalentCard key={talent.id} talent={talent} isNewcomer />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button asChild size="lg" variant="outline">
                <Link to="/rent">View All New Talents</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-pink-600 via-purple-600 to-yellow-500">
        <div className="container mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of people finding meaningful connections every day
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/rent">Browse Companions</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-purple-600" asChild>
              <Link to="/contact">Become a Talent</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
