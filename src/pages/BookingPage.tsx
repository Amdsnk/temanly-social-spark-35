import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import { supabase } from '@/integrations/supabase/client';

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
  const [searchParams] = useSearchParams();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedServices, setSelectedServices] = useState<ServiceSelection[]>([]);
  const [bookingForm, setBookingForm] = useState({
    message: '',
  });

  // Get talent ID from URL params and generate a proper UUID for companion_id
  const talentParam = searchParams.get('talent');
  
  // Mock talent data - in production this would come from the database
  // For now, we'll use a UUID format for companion_id instead of just "1"
  const talent = {
    id: talentParam || '1',
    // Use a proper UUID format for companion_id to avoid database errors
    companion_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', // Mock UUID for now
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

  const handlePaymentSuccess = async (result: any) => {
    console.log('Payment successful:', result);
    
    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Create booking record in Supabase with correct field names and UUID companion_id
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          companion_id: talent.companion_id, // Use proper UUID instead of talent.id
          customer_name: user.name || 'Customer',
          customer_email: user.email || 'customer@example.com',
          customer_phone: user.phone || '08123456789',
          service_name: selectedServices.map(s => s.id).join(', '),
          date: selectedDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
          time: '00:00',
          duration: selectedServices.reduce((total, service) => total + service.duration, 0),
          total_price: finalTotal,
          payment_status: 'paid',
          booking_status: 'confirmed',
          notes: bookingForm.message,
          payment_reference: result.order_id || result.transaction_id,
        })
        .select()
        .single();

      if (bookingError) {
        console.error('Error creating booking:', bookingError);
        // Redirect to payment status page with error info
        const params = new URLSearchParams({
          status: 'success',
          orderId: result.order_id || result.transaction_id || '',
          amount: finalTotal.toString(),
          service: selectedServices.map(s => s.id).join(', '),
          talent: talent.name,
          message: 'Payment successful but booking data could not be saved. Please contact support.'
        });
        navigate(`/payment-status?${params.toString()}`);
        return;
      }

      // Redirect to success page
      const params = new URLSearchParams({
        status: 'success',
        orderId: booking.id,
        amount: finalTotal.toString(),
        service: selectedServices.map(s => s.id).join(', '),
        talent: talent.name
      });
      navigate(`/payment-status?${params.toString()}`);

    } catch (error) {
      console.error('Error saving booking:', error);
      // Redirect to payment status page with error info
      const params = new URLSearchParams({
        status: 'success',
        orderId: result.order_id || result.transaction_id || '',
        amount: finalTotal.toString(),
        service: selectedServices.map(s => s.id).join(', '),
        talent: talent.name,
        message: 'Payment successful but there was an error saving your booking. Please contact support.'
      });
      navigate(`/payment-status?${params.toString()}`);
    }
  };

  const handlePaymentPending = async (result: any) => {
    console.log('Payment pending:', result);
    
    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Create pending booking record with correct field names and UUID companion_id
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          companion_id: talent.companion_id, // Use proper UUID instead of talent.id
          customer_name: user.name || 'Customer',
          customer_email: user.email || 'customer@example.com',
          customer_phone: user.phone || '08123456789',
          service_name: selectedServices.map(s => s.id).join(', '),
          date: selectedDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
          time: '00:00',
          duration: selectedServices.reduce((total, service) => total + service.duration, 0),
          total_price: finalTotal,
          payment_status: 'pending',
          booking_status: 'pending',
          notes: bookingForm.message,
          payment_reference: result.order_id || result.transaction_id,
        })
        .select()
        .single();

      let pendingMessage = "Your payment is being processed. You will receive a notification once completed.";
      
      // Special message for bank transfer
      if (result.payment_type === 'bank_transfer') {
        pendingMessage = "Please complete your bank transfer payment. Your booking will be confirmed once payment is received.";
      }

      // Redirect to pending status page
      const params = new URLSearchParams({
        status: 'pending',
        orderId: booking?.id || result.order_id || result.transaction_id || '',
        amount: finalTotal.toString(),
        service: selectedServices.map(s => s.id).join(', '),
        talent: talent.name,
        message: pendingMessage
      });
      navigate(`/payment-status?${params.toString()}`);

    } catch (error) {
      console.error('Error saving pending booking:', error);
      // Redirect to pending status page with error info
      const params = new URLSearchParams({
        status: 'pending',
        orderId: result.order_id || result.transaction_id || '',
        amount: finalTotal.toString(),
        service: selectedServices.map(s => s.id).join(', '),
        talent: talent.name,
        message: 'Payment is being processed but there was an error saving your booking. Please contact support.'
      });
      navigate(`/payment-status?${params.toString()}`);
    }
  };

  const handlePaymentError = (result: any) => {
    console.error('Payment failed:', result);
    
    let errorMessage = "There was an error processing your payment. Please try again.";
    
    if (result && result.message) {
      errorMessage = result.message;
    } else if (typeof result === 'string') {
      errorMessage = result;
    }
    
    // Redirect to failed status page
    const params = new URLSearchParams({
      status: 'failed',
      amount: finalTotal.toString(),
      service: selectedServices.map(s => s.id).join(', '),
      talent: talent.name,
      message: errorMessage
    });
    navigate(`/payment-status?${params.toString()}`);
  };

  const bookingData = {
    talent: talent.name,
    service: selectedServices.map(s => s.id).join(', '),
    services: selectedServices,
    date: selectedDate!,
    time: '00:00',
    message: bookingForm.message,
    total: finalTotal
  };

  const isFormValid = selectedServices.length > 0 && selectedDate && !hasRestricted && user?.id;

  if (!user?.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Login Required</h2>
            <p className="text-gray-600 mb-4">You need to be logged in to make a booking.</p>
            <Button onClick={() => navigate('/login')} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
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
                      Data tersimpan aman di database terenkripsi
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
