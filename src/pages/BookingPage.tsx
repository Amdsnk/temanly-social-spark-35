import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, MapPin, Star, DollarSign, Plus, Minus } from 'lucide-react';
import { format } from 'date-fns';

const BookingPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [bookingDetails, setBookingDetails] = useState({
    duration: 1,
    location: '',
    datePlan: '',
    specialRequests: ''
  });

  // Mock talent data
  const talent = {
    id: 1,
    name: 'Sarah Jakarta',
    rating: 4.9,
    totalReviews: 127,
    image: '/placeholder.svg',
    level: 'Elite Talent',
    zodiac: 'Gemini',
    loveLanguage: 'Quality Time',
    interests: ['Sushi Date', 'Movie Date', 'Coffee Shop', 'Shopping'],
    bio: 'Friendly and outgoing person who loves meeting new people and creating memorable experiences!',
    isOnline: true,
    commission: 18 // Elite talent commission
  };

  const services = [
    { 
      id: 'chat', 
      name: 'Chat', 
      price: 25000, 
      unit: 'per day',
      description: 'Friendly conversation throughout the day',
      multiDay: true
    },
    { 
      id: 'call', 
      name: 'Voice Call', 
      price: 40000, 
      unit: 'per hour',
      description: 'Personal phone conversation',
      multiDay: false
    },
    { 
      id: 'video-call', 
      name: 'Video Call', 
      price: 65000, 
      unit: 'per hour',
      description: 'Face-to-face video conversation',
      multiDay: false
    },
    { 
      id: 'offline-date', 
      name: 'Offline Date', 
      price: 285000, 
      unit: 'per 3 hours',
      description: 'In-person meetup and activities',
      additionalHourly: 90000,
      multiDay: false,
      requiresVerification: true
    },
    { 
      id: 'party-buddy', 
      name: 'Party Buddy', 
      price: 1000000, 
      unit: 'per event (8 PM - 4 AM)',
      description: 'Companion for parties and night events',
      multiDay: false,
      requiresVerification: true,
      ageRestriction: '21+'
    },
    { 
      id: 'rent-lover', 
      name: 'Rent a Lover', 
      price: 85000, 
      unit: 'per day',
      description: 'Virtual boyfriend/girlfriend experience with sweet messages',
      multiDay: true,
      customizable: true
    }
  ];

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', 
    '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const calculateTotal = () => {
    let total = 0;
    selectedServices.forEach(serviceId => {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        if (service.id === 'offline-date' && bookingDetails.duration > 3) {
          total += service.price + ((bookingDetails.duration - 3) * service.additionalHourly!);
        } else {
          total += service.price * (service.multiDay ? bookingDetails.duration : 1);
        }
      }
    });
    
    // Add transport cost for offline date (20% of total)
    if (selectedServices.includes('offline-date')) {
      const offlineTotal = services.find(s => s.id === 'offline-date')!.price;
      total += Math.round(offlineTotal * 0.2);
    }
    
    // Add platform fee (10%)
    const platformFee = Math.round(total * 0.1);
    return { subtotal: total, platformFee, total: total + platformFee };
  };

  const handleBooking = () => {
    const costs = calculateTotal();
    console.log('Booking Details:', {
      talent: talent.name,
      services: selectedServices,
      date: selectedDate,
      duration: bookingDetails.duration,
      location: bookingDetails.location,
      datePlan: bookingDetails.datePlan,
      specialRequests: bookingDetails.specialRequests,
      costs
    });
    alert('Booking submitted! You will be redirected to payment.');
  };

  const costs = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Talent Info */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <img 
                    src={talent.image} 
                    alt={talent.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h2 className="text-xl font-bold">{talent.name}</h2>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="font-medium">{talent.rating}</span>
                    <span className="text-gray-500">({talent.totalReviews} reviews)</span>
                  </div>
                  <Badge className="mt-2 bg-green-100 text-green-600">{talent.level}</Badge>
                  <div className={`w-3 h-3 rounded-full mx-auto mt-2 ${talent.isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-sm text-gray-600">{talent.isOnline ? 'Online' : 'Offline'}</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">About</h3>
                    <p className="text-sm text-gray-600">{talent.bio}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Zodiac:</span>
                      <p className="text-gray-600">{talent.zodiac}</p>
                    </div>
                    <div>
                      <span className="font-medium">Love Language:</span>
                      <p className="text-gray-600">{talent.loveLanguage}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Interests</h3>
                    <div className="flex flex-wrap gap-1">
                      {talent.interests.map((interest) => (
                        <Badge key={interest} variant="outline" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {services.map((service) => (
                  <div key={service.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <Checkbox 
                          checked={selectedServices.includes(service.id)}
                          onCheckedChange={(checked: boolean | "indeterminate") => {
                            // Handle the checkbox state change properly
                            if (checked === true || checked === false) {
                              const isCurrentlySelected = selectedServices.includes(service.id);
                              if (checked && !isCurrentlySelected) {
                                handleServiceToggle(service.id);
                              } else if (!checked && isCurrentlySelected) {
                                handleServiceToggle(service.id);
                              }
                            }
                            // Ignore "indeterminate" state
                          }}
                          disabled={service.requiresVerification || service.ageRestriction}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{service.name}</h3>
                            {service.ageRestriction && (
                              <Badge className="bg-red-100 text-red-600">{service.ageRestriction}</Badge>
                            )}
                            {service.requiresVerification && (
                              <Badge className="bg-yellow-100 text-yellow-600">Verification Required</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="font-semibold text-green-600">
                              Rp {service.price.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500">{service.unit}</span>
                          </div>
                          {service.additionalHourly && (
                            <p className="text-xs text-gray-500 mt-1">
                              +Rp {service.additionalHourly.toLocaleString()}/hour after 3 hours
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {selectedServices.includes(service.id) && service.multiDay && (
                      <div className="mt-4 flex items-center gap-4">
                        <Label>Duration:</Label>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setBookingDetails(prev => ({
                              ...prev, 
                              duration: Math.max(1, prev.duration - 1)
                            }))}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center">{bookingDetails.duration}</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setBookingDetails(prev => ({
                              ...prev, 
                              duration: prev.duration + 1
                            }))}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <span className="text-sm text-gray-500">
                            {service.id === 'offline-date' ? 'hours' : 'days'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {selectedServices.length > 0 && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Schedule & Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Select Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label>Preferred Time</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {selectedServices.includes('offline-date') && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="location">Meeting Location</Label>
                          <Input 
                            id="location"
                            placeholder="e.g., Mall Central Park, Jakarta"
                            value={bookingDetails.location}
                            onChange={(e) => setBookingDetails(prev => ({
                              ...prev, 
                              location: e.target.value
                            }))}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="date-plan">Date Plan</Label>
                          <Textarea 
                            id="date-plan"
                            placeholder="e.g., Let's go to sushi restaurant, then watch a movie, and end with coffee"
                            value={bookingDetails.datePlan}
                            onChange={(e) => setBookingDetails(prev => ({
                              ...prev, 
                              datePlan: e.target.value
                            }))}
                            rows={3}
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="special-requests">Special Requests (Optional)</Label>
                      <Textarea 
                        id="special-requests"
                        placeholder="Any special requests or preferences..."
                        value={bookingDetails.specialRequests}
                        onChange={(e) => setBookingDetails(prev => ({
                          ...prev, 
                          specialRequests: e.target.value
                        }))}
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedServices.map((serviceId) => {
                        const service = services.find(s => s.id === serviceId)!;
                        const serviceTotal = service.id === 'offline-date' && bookingDetails.duration > 3
                          ? service.price + ((bookingDetails.duration - 3) * service.additionalHourly!)
                          : service.price * (service.multiDay ? bookingDetails.duration : 1);
                        
                        return (
                          <div key={serviceId} className="flex justify-between">
                            <span>
                              {service.name} 
                              {service.multiDay && ` × ${bookingDetails.duration} ${service.id === 'offline-date' ? 'hours' : 'days'}`}
                            </span>
                            <span>Rp {serviceTotal.toLocaleString()}</span>
                          </div>
                        );
                      })}
                      
                      {selectedServices.includes('offline-date') && (
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Transport (20%)</span>
                          <span>Rp {Math.round(services.find(s => s.id === 'offline-date')!.price * 0.2).toLocaleString()}</span>
                        </div>
                      )}
                      
                      <div className="border-t pt-2">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>Rp {costs.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Platform Fee (10%)</span>
                          <span>Rp {costs.platformFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                          <span>Total</span>
                          <span>Rp {costs.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full mt-6" 
                      size="lg"
                      onClick={handleBooking}
                      disabled={!selectedDate}
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Proceed to Payment
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
