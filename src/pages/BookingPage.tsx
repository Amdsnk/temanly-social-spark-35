
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Star } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import MidtransPayment from '@/components/payment/MidtransPayment';
import MultiServiceSelector from '@/components/MultiServiceSelector';
import ServiceRestrictionNotice from '@/components/ServiceRestrictionNotice';
import VerificationStatus from '@/components/VerificationStatus';
import { useAuth } from '@/contexts/AuthContext';
import { calculateTotalPrice, getServiceRestrictions, hasRestrictedServices } from '@/utils/serviceCalculations';

interface ServiceSelection {
  id: string;
  duration: number;
  durationUnit: string;
  datePlan?: string;
  location?: string;
}

const BookingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedServices, setSelectedServices] = useState<ServiceSelection[]>([]);
  const [bookingForm, setBookingForm] = useState({
    message: '',
  });

  // Mock talent data
  const talent = {
    name: 'Sarah Jakarta',
    rating: 4.9,
    reviews: 127,
    image: '/placeholder.svg',
    level: 'Elite Talent',
    bio: 'Friendly and outgoing person who loves meeting new people!',
    isOnline: true
  };

  const isVerified = user?.verified || false;
  const restrictedServices = getServiceRestrictions(isVerified);
  const hasRestricted = hasRestrictedServices(selectedServices, isVerified);
  
  const totalPrice = calculateTotalPrice(selectedServices);
  const platformFee = Math.round(totalPrice * 0.1);
  const finalTotal = totalPrice + platformFee;

  const handlePaymentSuccess = (result: any) => {
    console.log('Payment successful:', result);
    
    // Save booking to local storage for demo
    const bookingRecord = {
      id: `BOOKING-${Date.now()}`,
      talent: talent.name,
      services: selectedServices,
      date: selectedDate?.toISOString(),
      message: bookingForm.message,
      total: finalTotal,
      status: 'confirmed',
      payment_status: 'paid',
      transaction_id: result.order_id || result.transaction_id,
      created_at: new Date().toISOString(),
    };
    
    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    existingBookings.push(bookingRecord);
    localStorage.setItem('bookings', JSON.stringify(existingBookings));
    
    toast({
      title: "Payment Successful! 🎉",
      description: `Your booking with ${talent.name} has been confirmed. Transaction ID: ${result.order_id || result.transaction_id}`,
    });
    
    // Redirect after 2 seconds
    setTimeout(() => {
      navigate('/user-dashboard');
    }, 2000);
  };

  const handlePaymentPending = (result: any) => {
    console.log('Payment pending:', result);
    
    // Save pending booking
    const bookingRecord = {
      id: `BOOKING-${Date.now()}`,
      talent: talent.name,
      services: selectedServices,
      date: selectedDate?.toISOString(),
      message: bookingForm.message,
      total: finalTotal,
      status: 'pending',
      payment_status: 'pending',
      transaction_id: result.order_id || result.transaction_id,
      created_at: new Date().toISOString(),
    };
    
    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    existingBookings.push(bookingRecord);
    localStorage.setItem('bookings', JSON.stringify(existingBookings));
    
    let pendingMessage = "Your payment is being processed. You will receive a notification once completed.";
    
    // Special message for bank transfer
    if (result.payment_type === 'bank_transfer' && result.va_number) {
      pendingMessage = `Please complete your bank transfer payment. Virtual Account: ${result.va_number}. Your booking will be confirmed once payment is received.`;
    }
    
    toast({
      title: "Payment Pending ⏳",
      description: pendingMessage,
      variant: "default"
    });
  };

  const handlePaymentError = (result: any) => {
    console.error('Payment failed:', result);
    
    let errorMessage = "There was an error processing your payment. Please try again.";
    
    if (result && result.message) {
      errorMessage = result.message;
    } else if (typeof result === 'string') {
      errorMessage = result;
    }
    
    toast({
      title: "Payment Failed ❌",
      description: errorMessage,
      variant: "destructive"
    });
  };

  const bookingData = {
    talent: talent.name,
    services: selectedServices,
    date: selectedDate!,
    message: bookingForm.message,
    total: finalTotal
  };

  const isFormValid = selectedServices.length > 0 && selectedDate && !hasRestricted;

  if (hasRestricted) {
    toast({
      title: "Verification Required",
      description: "Some selected services require user verification.",
      variant: "destructive"
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Book Talent" 
        subtitle="Complete your booking details"
        backTo="/talents"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Talent Profile */}
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
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{talent.rating}</span>
                    <span className="text-gray-500">({talent.reviews} reviews)</span>
                  </div>
                  <Badge className="mt-2 bg-blue-100 text-blue-600">{talent.level}</Badge>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <div className={`w-3 h-3 rounded-full ${talent.isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-sm text-gray-600">{talent.isOnline ? 'Online' : 'Offline'}</span>
                  </div>
                  
                  {/* User Verification Status */}
                  <div className="mt-3">
                    <VerificationStatus user={user} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">About</h3>
                    <p className="text-sm text-gray-600">{talent.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Service Restriction Notice */}
            <ServiceRestrictionNotice 
              isVerified={isVerified}
              restrictedServices={restrictedServices}
            />
            
            {/* Multi Service Selection */}
            <MultiServiceSelector
              selectedServices={selectedServices}
              onServiceChange={setSelectedServices}
              isVerified={isVerified}
            />

            {/* Date Selection */}
            {selectedServices.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Date</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            )}

            {/* Message */}
            {selectedServices.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Special Message (Optional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea 
                    placeholder="Any special requests or message for the talent..."
                    value={bookingForm.message}
                    onChange={(e) => setBookingForm(prev => ({
                      ...prev, 
                      message: e.target.value
                    }))}
                    rows={3}
                  />
                </CardContent>
              </Card>
            )}

            {/* Order Summary & Payment */}
            {selectedServices.length > 0 && totalPrice > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary & Payment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {selectedServices.map((service, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>
                            {service.id.replace('-', ' ')} ({service.duration} {service.durationUnit})
                          </span>
                          <span>Rp {calculateTotalPrice([service]).toLocaleString()}</span>
                        </div>
                      ))}
                      
                      <div className="border-t pt-2">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>Rp {totalPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Platform Fee (10%)</span>
                          <span>Rp {platformFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                          <span>Total</span>
                          <span>Rp {finalTotal.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Midtrans Payment Component */}
                    <div className="mt-6">
                      <MidtransPayment
                        bookingData={bookingData}
                        onSuccess={handlePaymentSuccess}
                        onPending={handlePaymentPending}
                        onError={handlePaymentError}
                        disabled={!isFormValid}
                      />
                    </div>

                    {/* Payment Security Notice */}
                    <div className="text-xs text-gray-500 text-center mt-4 p-3 bg-gray-50 rounded-lg">
                      🔒 Pembayaran aman diproses oleh Midtrans
                      <br />
                      Mendukung transfer bank, e-wallet, kartu kredit & debit
                      <br />
                      <span className="text-blue-600">Mode Demo: Menggunakan localStorage untuk penyimpanan data</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
