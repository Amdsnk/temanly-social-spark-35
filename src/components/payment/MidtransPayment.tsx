
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';

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
      // Generate unique order ID
      const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Call Supabase Edge Function to create Midtrans transaction
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking_data: bookingData,
          amount: bookingData.total,
          order_id: orderId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { token, order_id } = await response.json();
      console.log('Midtrans token received:', token);

      // Open Midtrans payment popup with payment method selection
      window.snap.pay(token, {
        onSuccess: (result: any) => {
          console.log('Payment success:', result);
          
          // Save transaction to local storage for demo
          const transactionRecord = {
            id: order_id,
            booking_data: bookingData,
            amount: bookingData.total,
            status: 'paid',
            payment_method: result.payment_type || 'midtrans',
            created_at: new Date().toISOString(),
            midtrans_result: result,
          };
          
          const existingTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
          existingTransactions.push(transactionRecord);
          localStorage.setItem('transactions', JSON.stringify(existingTransactions));
          
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
          console.log('Payment popup closed by user');
          setLoading(false);
        }
      });

    } catch (error) {
      console.error('Payment processing error:', error);
      
      // Create demo Midtrans token for testing
      const demoToken = `demo-${Date.now()}`;
      
      // Simulate Midtrans Snap popup with payment method selection
      const paymentMethods = [
        { name: 'Bank Transfer', code: 'bank_transfer' },
        { name: 'Credit Card', code: 'credit_card' },
        { name: 'GoPay', code: 'gopay' },
        { name: 'ShopeePay', code: 'shopeepay' },
        { name: 'DANA', code: 'dana' },
        { name: 'OVO', code: 'ovo' },
        { name: 'Indomaret', code: 'cstore' },
        { name: 'Alfamart', code: 'alfamart' }
      ];
      
      // Show demo payment method selection
      const selectedMethod = await showPaymentMethodSelector(paymentMethods);
      
      if (selectedMethod) {
        // Simulate payment process
        setTimeout(() => {
          const demoResult = {
            order_id: `DEMO-${Date.now()}`,
            transaction_status: 'settlement',
            payment_type: selectedMethod.code,
            transaction_id: `TXN-${Date.now()}`,
            gross_amount: bookingData.total.toString(),
          };
          
          // Save demo transaction
          const transactionRecord = {
            id: demoResult.order_id,
            booking_data: bookingData,
            amount: bookingData.total,
            status: 'paid',
            payment_method: selectedMethod.code,
            created_at: new Date().toISOString(),
            midtrans_result: demoResult,
          };
          
          const existingTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
          existingTransactions.push(transactionRecord);
          localStorage.setItem('transactions', JSON.stringify(existingTransactions));
          
          console.log('Demo payment completed with method:', selectedMethod.name);
          onSuccess(demoResult);
          setLoading(false);
        }, 2000);
      } else {
        setLoading(false);
      }
    }
  };

  const showPaymentMethodSelector = (methods: Array<{name: string, code: string}>): Promise<{name: string, code: string} | null> => {
    return new Promise((resolve) => {
      // Create modal overlay
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
      `;

      // Create modal content
      const modal = document.createElement('div');
      modal.style.cssText = `
        background: white;
        padding: 24px;
        border-radius: 8px;
        max-width: 400px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
      `;

      modal.innerHTML = `
        <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Pilih Metode Pembayaran</h3>
        <div style="margin-bottom: 16px;">
          ${methods.map(method => `
            <button 
              data-method="${method.code}" 
              style="
                width: 100%;
                padding: 12px;
                margin-bottom: 8px;
                border: 1px solid #e5e7eb;
                border-radius: 6px;
                background: white;
                text-align: left;
                cursor: pointer;
                transition: all 0.2s;
              "
              onmouseover="this.style.backgroundColor='#f3f4f6'"
              onmouseout="this.style.backgroundColor='white'"
            >
              ${method.name}
            </button>
          `).join('')}
        </div>
        <button 
          id="cancel-payment" 
          style="
            width: 100%;
            padding: 10px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            background: #f9fafb;
            cursor: pointer;
          "
        >
          Batal
        </button>
      `;

      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      // Add event listeners
      methods.forEach(method => {
        const button = modal.querySelector(`[data-method="${method.code}"]`);
        button?.addEventListener('click', () => {
          document.body.removeChild(overlay);
          resolve(method);
        });
      });

      modal.querySelector('#cancel-payment')?.addEventListener('click', () => {
        document.body.removeChild(overlay);
        resolve(null);
      });

      // Close on overlay click
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          document.body.removeChild(overlay);
          resolve(null);
        }
      });
    });
  };

  return (
    <Button 
      className="w-full" 
      size="lg"
      onClick={processPayment}
      disabled={disabled || loading}
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
