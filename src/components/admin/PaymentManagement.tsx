
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Eye, CheckCircle, XCircle, AlertTriangle, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';
import PaymentDetailModal from './PaymentDetailModal';

type PaymentStatus = Database['public']['Enums']['payment_status'];

interface Transaction {
  id: string;
  amount: number;
  service: string;
  payment_method: string;
  status: PaymentStatus;
  companion_earnings: number;
  platform_fee: number;
  created_at: string;
  user_id: string;
  companion_id: string;
  booking_id: string;
  profiles_user: {
    name: string;
    email: string;
  } | null;
  profiles_companion: {
    name: string;
    email: string;
  } | null;
}

const PaymentManagement = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<Transaction | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactions();
    setupRealTimeUpdates();
  }, [filter]);

  const fetchTransactions = async () => {
    try {
      let query = supabase
        .from('transactions')
        .select(`
          *,
          profiles_user:profiles!user_id(name, email),
          profiles_companion:profiles!companion_id(name, email)
        `)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter as PaymentStatus);
      }

      const { data, error } = await query;
      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeUpdates = () => {
    const channel = supabase
      .channel('transactions-admin')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        () => fetchTransactions()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const updateTransactionStatus = async (transactionId: string, newStatus: PaymentStatus) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', transactionId);

      if (error) throw error;

      setTransactions(prev => 
        prev.map(t => 
          t.id === transactionId 
            ? { ...t, status: newStatus }
            : t
        )
      );

      toast({
        title: "Payment Updated",
        description: `Payment has been ${newStatus === 'paid' ? 'approved' : 'rejected'} successfully`,
        variant: newStatus === 'paid' ? 'default' : 'destructive'
      });

      // Close modal after action
      setModalOpen(false);
      setSelectedPayment(null);
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewDetails = (payment: Transaction) => {
    setSelectedPayment(payment);
    setModalOpen(true);
  };

  const handleApprovePayment = (paymentId: string) => {
    updateTransactionStatus(paymentId, 'paid');
  };

  const handleRejectPayment = (paymentId: string) => {
    updateTransactionStatus(paymentId, 'failed');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-600', icon: AlertTriangle },
      paid: { color: 'bg-green-100 text-green-600', icon: CheckCircle },
      failed: { color: 'bg-red-100 text-red-600', icon: XCircle },
      refunded: { color: 'bg-gray-100 text-gray-600', icon: XCircle },
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

  const totalStats = {
    totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
    totalCommission: transactions.reduce((sum, t) => sum + (t.platform_fee || 0), 0),
    totalTalentEarning: transactions.reduce((sum, t) => sum + (t.companion_earnings || 0), 0),
    pendingVerification: transactions.filter(t => t.status === 'pending_verification').length
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading transactions...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <CreditCard className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                Rp {totalStats.totalAmount.toLocaleString('id-ID')}
              </div>
              <p className="text-xs text-muted-foreground">
                {transactions.length} transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Fees</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                Rp {totalStats.totalCommission.toLocaleString('id-ID')}
              </div>
              <p className="text-xs text-muted-foreground">
                Commission earned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Talent Earnings</CardTitle>
              <CreditCard className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                Rp {totalStats.totalTalentEarning.toLocaleString('id-ID')}
              </div>
              <p className="text-xs text-muted-foreground">
                Paid to talents
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {totalStats.pendingVerification}
              </div>
              <p className="text-xs text-muted-foreground">
                Need review
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Payment Management
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
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No transactions found for the selected filter.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Talent</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Platform Fee</TableHead>
                    <TableHead>Talent Earnings</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-sm">
                        {transaction.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.profiles_user?.name || 'Unknown'}</div>
                          <div className="text-xs text-gray-500">{transaction.profiles_user?.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.profiles_companion?.name || 'Unknown'}</div>
                          <div className="text-xs text-gray-500">{transaction.profiles_companion?.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{transaction.service}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        Rp {transaction.amount.toLocaleString('id-ID')}
                      </TableCell>
                      <TableCell className="text-green-600">
                        Rp {(transaction.platform_fee || 0).toLocaleString('id-ID')}
                      </TableCell>
                      <TableCell className="text-purple-600">
                        Rp {(transaction.companion_earnings || 0).toLocaleString('id-ID')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{transaction.payment_method}</Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(transaction.status)}
                      </TableCell>
                      <TableCell>
                        {new Date(transaction.created_at).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(transaction)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            Detail
                          </Button>
                          {transaction.status === 'pending_verification' && (
                            <Button
                              size="sm"
                              className="bg-green-500 hover:bg-green-600"
                              onClick={() => handleViewDetails(transaction)}
                              disabled={actionLoading}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verify
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <PaymentDetailModal
        payment={selectedPayment}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedPayment(null);
        }}
        onApprove={handleApprovePayment}
        onReject={handleRejectPayment}
        loading={actionLoading}
      />
    </>
  );
};

export default PaymentManagement;
