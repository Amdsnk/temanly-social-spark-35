
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Eye, CheckCircle, XCircle, AlertTriangle, RefreshCw, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

const DemoPaymentManagement = () => {
  const [transactions, setTransactions] = useState<DemoTransaction[]>([
    {
      id: 'pay_001',
      orderId: 'TEM001',
      user: 'Ahmad Rizki',
      talent: 'Sarah M.',
      service: 'Chat',
      amount: 27500,
      talentEarning: 20000,
      platformCommission: 5000,
      appFee: 2500,
      payment_method: 'GoPay',
      status: 'pending_verification',
      created_at: '2024-01-15T10:30:00Z',
      city: 'Jakarta',
      talentLevel: 'Fresh'
    },
    {
      id: 'pay_002',
      orderId: 'TEM002',
      user: 'Budi Santoso',
      talent: 'Maya A.',
      service: 'Video Call',
      amount: 71500,
      talentEarning: 53300,
      platformCommission: 11700,
      appFee: 6500,
      payment_method: 'OVO',
      status: 'paid',
      created_at: '2024-01-15T09:15:00Z',
      city: 'Bandung',
      talentLevel: 'Elite'
    },
    {
      id: 'pay_003',
      orderId: 'TEM003',
      user: 'Dewi Lestari',
      talent: 'Andi K.',
      service: 'Offline Date',
      amount: 313500,
      talentEarning: 242250,
      platformCommission: 42750,
      appFee: 28500,
      payment_method: 'DANA',
      status: 'pending',
      created_at: '2024-01-15T08:45:00Z',
      city: 'Surabaya',
      talentLevel: 'VIP'
    },
    {
      id: 'pay_004',
      orderId: 'TEM004',
      user: 'Eka Putra',
      talent: 'Luna S.',
      service: 'Rent a Lover',
      amount: 93500,
      talentEarning: 68000,
      platformCommission: 17000,
      appFee: 8500,
      payment_method: 'ShopeePay',
      status: 'failed',
      created_at: '2024-01-15T07:20:00Z',
      city: 'Medan',
      talentLevel: 'Fresh'
    },
    {
      id: 'pay_005',
      orderId: 'TEM005',
      user: 'Fani Wijaya',
      talent: 'Rico P.',
      service: 'Party Buddy',
      amount: 1100000,
      talentEarning: 850000,
      platformCommission: 150000,
      appFee: 100000,
      payment_method: 'Bank Transfer',
      status: 'pending_verification',
      created_at: '2024-01-14T22:00:00Z',
      city: 'Jakarta',
      talentLevel: 'VIP'
    }
  ]);

  const [filter, setFilter] = useState<string>('all');
  const { toast } = useToast();

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(t => t.status === filter);

  const updateTransactionStatus = (transactionId: string, newStatus: 'paid' | 'failed' | 'refunded') => {
    setTransactions(prev => 
      prev.map(t => 
        t.id === transactionId 
          ? { ...t, status: newStatus }
          : t
      )
    );

    const transaction = transactions.find(t => t.id === transactionId);
    toast({
      title: "Demo: Payment Status Updated",
      description: `Transaction ${transaction?.orderId} status changed to ${newStatus}`,
      duration: 3000
    });

    // Simulate WhatsApp notification
    if (newStatus === 'paid') {
      setTimeout(() => {
        toast({
          title: "Demo: WhatsApp Notifications Sent",
          description: `Notifications sent to both ${transaction?.user} and ${transaction?.talent}`,
          duration: 3000
        });
      }, 1000);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-600', icon: AlertTriangle },
      paid: { color: 'bg-green-100 text-green-600', icon: CheckCircle },
      failed: { color: 'bg-red-100 text-red-600', icon: XCircle },
      refunded: { color: 'bg-gray-100 text-gray-600', icon: RefreshCw },
      pending_verification: { color: 'bg-blue-100 text-blue-600', icon: Eye }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config?.icon || AlertTriangle;
    
    return (
      <Badge className={config?.color || 'bg-gray-100 text-gray-600'}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getTalentCommissionRate = (level: string) => {
    switch (level) {
      case 'Fresh': return '20%';
      case 'Elite': return '18%';
      case 'VIP': return '15%';
      default: return '20%';
    }
  };

  const totalStats = {
    totalAmount: filteredTransactions.reduce((sum, t) => sum + t.amount, 0),
    totalCommission: filteredTransactions.reduce((sum, t) => sum + t.platformCommission, 0),
    totalAppFee: filteredTransactions.reduce((sum, t) => sum + t.appFee, 0),
    totalTalentEarning: filteredTransactions.reduce((sum, t) => sum + t.talentEarning, 0)
  };

  return (
    <div className="space-y-6">
      {/* Demo Payment Flow Explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Demo: Temanly Payment Flow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-blue-800 mb-2">Payment Flow Process:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
              <li>Order made → Payment completed → Payment verified</li>
              <li>Both talent and user get WhatsApp notifications</li>
              <li>Talent contacts user → Order executed → Order completed</li>
              <li>WhatsApp notifications sent with review links</li>
              <li>Reviews verified by admin before display</li>
            </ol>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded">
              <div className="text-2xl font-bold text-green-600">
                Rp {totalStats.totalAmount.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Transactions</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded">
              <div className="text-2xl font-bold text-blue-600">
                Rp {totalStats.totalTalentEarning.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Talent Earnings</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded">
              <div className="text-2xl font-bold text-purple-600">
                Rp {totalStats.totalCommission.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Platform Commission</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded">
              <div className="text-2xl font-bold text-orange-600">
                Rp {totalStats.totalAppFee.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">App Fee (10%)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Payment Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Demo Payment Management
            </CardTitle>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="pending_verification">Pending Verification</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Talent (Level)</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Talent Earning</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>App Fee</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.orderId}</TableCell>
                  <TableCell>{transaction.user}</TableCell>
                  <TableCell>
                    <div>
                      <div>{transaction.talent}</div>
                      <Badge variant="outline" className="text-xs">
                        {transaction.talentLevel} ({getTalentCommissionRate(transaction.talentLevel)})
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{transaction.service}</Badge>
                  </TableCell>
                  <TableCell>{transaction.city}</TableCell>
                  <TableCell className="font-semibold">
                    Rp {transaction.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-green-600">
                    Rp {transaction.talentEarning.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-purple-600">
                    Rp {transaction.platformCommission.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-orange-600">
                    Rp {transaction.appFee.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{transaction.payment_method}</Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(transaction.status)}
                  </TableCell>
                  <TableCell>
                    {transaction.status === 'pending_verification' && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-xs px-2 py-1"
                          onClick={() => updateTransactionStatus(transaction.id, 'paid')}
                        >
                          Verify
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="text-xs px-2 py-1"
                          onClick={() => updateTransactionStatus(transaction.id, 'failed')}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                    {transaction.status === 'failed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs px-2 py-1"
                        onClick={() => updateTransactionStatus(transaction.id, 'refunded')}
                      >
                        Refund
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoPaymentManagement;
