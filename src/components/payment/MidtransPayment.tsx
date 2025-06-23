
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    snap: any;
  }
}

interface MidtransPaymentProps {
  bookingData: {
    talent: string;
    service: string;
    date: Date;
    time: string;
    message: string;
    total: number;
  };
  onSuccess: (result: any) => void;
  onPending: (result: any) => void;
  onError: (result: any) => void;
  disabled?: boolean;
}

const MidtransPayment: React.FC<MidtransPaymentProps> = ({
  bookingData,
  onSuccess,
  onPending,
  onError,
  disabled = false
}) => {
  const [loading, setLoading] = React.useState(false);
  const [snapLoaded, setSnapLoaded] = React.useState(false);

  useEffect(() => {
    // Load Midtrans Snap script
    const script = document.createElement('script');
    script.src = 'https://app.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', 'Mid-client-t14R0G6XRLw9MLZj');
    script.onload = () => {
      console.log('Midtrans Snap script loaded successfully');
      setSnapLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load Midtrans Snap script');
    };
    document.head.appendChild(script);

    return () => {
      // Check if script still exists before removing
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const processPayment = async () => {
    if (!snapLoaded) {
      console.error('Midtrans Snap not loaded');
      onError({ message: 'Payment system not ready. Please refresh and try again.' });
      return;
    }

    setLoading(true);
    console.log('Starting payment process with booking data:', bookingData);
    
    try {
      // Create transaction via Supabase edge function
      console.log('Calling create-payment edge function...');
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          booking_data: bookingData,
          amount: bookingData.total,
        },
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to create payment');
      }

      if (!data || !data.token) {
        console.error('No payment token received:', data);
        throw new Error('Payment token not received from server');
      }

      const { token } = data;
      console.log('Payment token received, opening Midtrans popup...');

      // Open Midtrans payment popup
      window.snap.pay(token, {
        onSuccess: (result: any) => {
          console.log('Payment success:', result);
          onSuccess(result);
          setLoading(false);
        },
        onPending: (result: any) => {
          console.log('Payment pending:', result);
          onPending(result);
          setLoading(false);
        },
        onError: (result: any) => {
          console.log('Payment error:', result);
          onError(result);
          setLoading(false);
        },
        onClose: () => {
          console.log('Payment popup closed');
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Payment processing error:', error);
      
      // Provide more specific error messages
      let errorMessage = 'There was an error processing your payment. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to send a request to the Edge Function')) {
          errorMessage = 'Unable to connect to payment service. Please check your internet connection and try again.';
        } else if (error.message.includes('not configured')) {
          errorMessage = 'Payment system is not properly configured. Please contact support.';
        } else {
          errorMessage = error.message;
        }
      }
      
      onError({ message: errorMessage });
      setLoading(false);
    }
  };

  return (
    <Button 
      className="w-full" 
      size="lg"
      onClick={processPayment}
      disabled={disabled || loading || !snapLoaded}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing Payment...
        </>
      ) : !snapLoaded ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Loading Payment System...
        </>
      ) : (
        <>
          <CreditCard className="w-4 h-4 mr-2" />
          Pay Now - Rp {bookingData.total.toLocaleString()}
        </>
      )}
    </Button>
  );
};

export default MidtransPayment;
