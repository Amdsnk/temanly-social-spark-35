
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
    script.onload = () => setSnapLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const processPayment = async () => {
    if (!snapLoaded) {
      console.error('Midtrans Snap not loaded');
      return;
    }

    setLoading(true);
    
    try {
      // Create transaction via Supabase edge function
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          booking_data: bookingData,
          amount: bookingData.total,
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to create payment');
      }

      const { token } = data;

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
      onError(error);
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
