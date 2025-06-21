import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TalentCard from '@/components/TalentCard';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Filter, SlidersHorizontal } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type TalentLevel = Database['public']['Enums']['talent_level'];

const Rent = () => {
  const [filters, setFilters] = useState({
    city: '',
    serviceType: '',
    minAge: 18,
    maxAge: 50,
    talentLevel: '' as TalentLevel | '',
    availability: true,
    minRating: 0,
    priceRange: [0, 2000000],
    interests: [] as string[]
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch talents with filters
  const { data: talents, isLoading } = useQuery({
    queryKey: ['talents', filters, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          talent_services(*),
          talent_interests(*),
          availability_slots(*)
        `)
        .eq('user_type', 'companion')
        .eq('verification_status', 'verified');

      if (filters.availability) {
        query = query.eq('is_available', true);
      }

      if (filters.city) {
        query = query.eq('city', filters.city);
      }

      if (filters.talentLevel) {
        query = query.eq('talent_level', filters.talentLevel as TalentLevel);
      }

      if (filters.minRating > 0) {
        query = query.gte('rating', filters.minRating);
      }

      if (filters.minAge > 18) {
        query = query.gte('age', filters.minAge);
      }

      if (filters.maxAge < 50) {
        query = query.lte('age', filters.maxAge);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Filter by search query and interests on client side
      let filteredData = data || [];

      if (searchQuery) {
        filteredData = filteredData.filter(talent => 
          talent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          talent.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          talent.talent_interests?.some((interest: any) => 
            interest.interest.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      }

      if (filters.serviceType) {
        filteredData = filteredData.filter(talent =>
          talent.talent_services?.some((service: any) => 
            service.service_type === filters.serviceType && service.is_available
          )
        );
      }

      return filteredData;
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

  // Fetch popular interests
  const { data: interests } = useQuery({
    queryKey: ['interests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('talent_interests')
        .select('interest');

      if (error) throw error;
      
      const uniqueInterests = [...new Set(data?.map(i => i.interest))];
      return uniqueInterests.slice(0, 10); // Top 10 interests
    }
  });

  const serviceTypes = [
    { value: 'chat', label: 'Chat' },
    { value: 'call', label: 'Voice Call' },
    { value: 'video_call', label: 'Video Call' },
    { value: 'offline_date', label: 'Offline Date' },
    { value: 'party_buddy', label: 'Party Buddy' },
    { value: 'rent_lover', label: 'Rent Lover' }
  ];

  const talentLevels = [
    { value: 'fresh' as TalentLevel, label: 'Fresh' },
    { value: 'elite' as TalentLevel, label: 'Elite' },
    { value: 'vip' as TalentLevel, label: 'VIP' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Find Your Perfect Companion</h1>
          
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search by name, interests, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 text-lg"
              />
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Select value={filters.city} onValueChange={(value) => setFilters({...filters, city: value})}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Cities</SelectItem>
                {cities?.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.serviceType} onValueChange={(value) => setFilters({...filters, serviceType: value})}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Services</SelectItem>
                {serviceTypes.map((service) => (
                  <SelectItem key={service.value} value={service.value}>{service.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.talentLevel} onValueChange={(value) => setFilters({...filters, talentLevel: value as TalentLevel | ''})}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Talent Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Levels</SelectItem>
                {talentLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Advanced Filters Sidebar */}
          {showFilters && (
            <div className="lg:w-80">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Age Range */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Age Range: {filters.minAge} - {filters.maxAge}
                    </label>
                    <div className="px-2">
                      <Slider
                        value={[filters.minAge, filters.maxAge]}
                        onValueChange={([min, max]) => setFilters({...filters, minAge: min, maxAge: max})}
                        max={50}
                        min={18}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Minimum Rating: {filters.minRating}
                    </label>
                    <div className="px-2">
                      <Slider
                        value={[filters.minRating]}
                        onValueChange={([rating]) => setFilters({...filters, minRating: rating})}
                        max={5}
                        min={0}
                        step={0.5}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Interests */}
                  {interests && (
                    <div>
                      <label className="text-sm font-medium mb-3 block">Popular Interests</label>
                      <div className="space-y-2">
                        {interests.slice(0, 8).map((interest) => (
                          <div key={interest} className="flex items-center space-x-2">
                            <Checkbox
                              id={interest}
                              checked={filters.interests.includes(interest)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFilters({
                                    ...filters,
                                    interests: [...filters.interests, interest]
                                  });
                                } else {
                                  setFilters({
                                    ...filters,
                                    interests: filters.interests.filter(i => i !== interest)
                                  });
                                }
                              }}
                            />
                            <label
                              htmlFor={interest}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {interest}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clear Filters */}
                  <Button
                    variant="outline"
                    onClick={() => setFilters({
                      city: '',
                      serviceType: '',
                      minAge: 18,
                      maxAge: 50,
                      talentLevel: '',
                      availability: true,
                      minRating: 0,
                      priceRange: [0, 2000000],
                      interests: []
                    })}
                    className="w-full"
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Talent Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-96 bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : talents && talents.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600">
                    Found {talents.length} companion{talents.length !== 1 ? 's' : ''}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {talents.map((talent) => (
                    <TalentCard key={talent.id} talent={talent} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600 mb-4">No companions found matching your criteria</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters({
                      city: '',
                      serviceType: '',
                      minAge: 18,
                      maxAge: 50,
                      talentLevel: '',
                      availability: true,
                      minRating: 0,
                      priceRange: [0, 2000000],
                      interests: []
                    });
                    setSearchQuery('');
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Rent;
