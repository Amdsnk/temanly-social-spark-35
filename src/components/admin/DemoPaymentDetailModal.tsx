
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CheckCircle, XCircle, User, Calendar, CreditCard, DollarSign, MapPin, Star } from 'lucide-react';

interface DemoTransaction {
  id: string;
  orderId: string;
  user: string;
  talent: string;
  service: string;
  amount: number;
  talentEarning: number;
  platformCommission: number;
  appFee: number;
  payment_method: string;
  status: 'pending' | 'pending_verification' | 'paid' | 'failed' | 'refunded';
  created_at: string;
  city: string;
  talentLevel: 'Fresh' | 'Elite' | 'VIP';
}

interface DemoPaymentDetailModalProps {
  payment: DemoTransaction | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (paymentId: string) => void;
  onReject: (paymentId: string) => void;
  loading?: boolean;
}

const DemoPaymentDetailModal: React.FC<DemoPaymentDetailModalProps> = ({
  payment,
  isOpen,
  onClose,
  onApprove,
  onReject,
  loading = false
}) => {
  if (!payment) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_verification':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTalentCommissionRate = (level: string) => {
    switch (level) {
      case 'Fresh': return '20%';
      case 'Elite': return '18%';
      case 'VIP': return '15%';
      default: return '20%';
    }
  };

  const handleApprove = () => {
    onApprove(payment.id);
    onClose();
  };

  const handleReject = () => {
    onReject(payment.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Demo: Payment Verification Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              {getStatusIcon(payment.status)}
              <span className="font-medium">Status Pembayaran</span>
            </div>
            <Badge variant="outline" className="capitalize">
              {payment.status.replace('_', ' ')}
            </Badge>
          </div>

          {/* Order Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-600">Order ID</h4>
              <p className="font-mono text-lg font-bold text-blue-600">{payment.orderId}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-600">Service</h4>
              <Badge variant="secondary" className="text-sm">{payment.service}</Badge>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-600">Lokasi</h4>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{payment.city}</span>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-600">Tanggal Transaksi</h4>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(payment.created_at).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* User & Talent Information */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <User className="w-4 h-4" />
                Informasi User
              </h4>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-medium">{payment.user}</p>
                <p className="text-sm text-gray-600">Customer</p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Star className="w-4 h-4" />
                Informasi Talent
              </h4>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="font-medium">{payment.talent}</p>
                <Badge variant="outline" className="mt-1">
                  {payment.talentLevel} Level (Komisi: {getTalentCommissionRate(payment.talentLevel)})
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Financial Breakdown */}
          <div className="space-y-4">
            <h4 className="font-semibold">Rincian Keuangan</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h5 className="text-sm font-medium text-green-700">Total Pembayaran</h5>
                <p className="text-2xl font-bold text-green-800">
                  Rp {payment.amount.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h5 className="text-sm font-medium text-blue-700">Pendapatan Talent</h5>
                <p className="text-2xl font-bold text-blue-800">
                  Rp {payment.talentEarning.toLocaleString('id-ID')}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  ~{((payment.talentEarning / payment.amount) * 100).toFixed(0)}% dari total
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h5 className="text-sm font-medium text-purple-700">Komisi Platform</h5>
                <p className="text-2xl font-bold text-purple-800">
                  Rp {payment.platformCommission.toLocaleString('id-ID')}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  ~{((payment.platformCommission / payment.amount) * 100).toFixed(0)}% dari total
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h5 className="text-sm font-medium text-orange-700">App Fee (10%)</h5>
                <p className="text-2xl font-bold text-orange-800">
                  Rp {payment.appFee.toLocaleString('id-ID')}
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  ~{((payment.appFee / payment.amount) * 100).toFixed(0)}% dari total
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Method */}
          <div className="space-y-3">
            <h4 className="font-semibold">Metode Pembayaran</h4>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <CreditCard className="w-5 h-5" />
              <span className="font-medium">{payment.payment_method}</span>
            </div>
          </div>

          {/* Verification Warning */}
          {payment.status === 'pending_verification' && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <h5 className="font-medium text-yellow-800">⚠️ Konfirmasi Verifikasi Pembayaran</h5>
                  <div className="text-yellow-700 mt-2 space-y-1">
                    <p><strong>Yang akan diverifikasi:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Pembayaran sebesar <strong>Rp {payment.amount.toLocaleString('id-ID')}</strong></li>
                      <li>Transfer ke talent <strong>{payment.talent}</strong>: <strong>Rp {payment.talentEarning.toLocaleString('id-ID')}</strong></li>
                      <li>Komisi platform: <strong>Rp {payment.platformCommission.toLocaleString('id-ID')}</strong></li>
                      <li>Order <strong>{payment.orderId}</strong> akan aktif</li>
                      <li>Notifikasi WhatsApp akan dikirim ke user dan talent</li>
                    </ul>
                    <p className="mt-3 font-medium">
                      ⚠️ <strong>Perhatian:</strong> Setelah disetujui, pembayaran tidak dapat dibatalkan!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {payment.status === 'pending_verification' && (
          <DialogFooter className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Tolak Pembayaran
            </Button>
            <Button
              onClick={handleApprove}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Ya, Setujui Pembayaran
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DemoPaymentDetailModal;
