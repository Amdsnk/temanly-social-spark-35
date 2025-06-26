
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download, Filter, Eye } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'payment' | 'withdrawal' | 'commission' | 'refund';
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'processing';
  description: string;
  date: string;
  reference?: string;
}

interface TransactionHistoryProps {
  userType: 'user' | 'companion' | 'admin';
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ userType }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Mock transaction data - would come from API
  const transactions: Transaction[] = [
    {
      id: 'TXN001',
      type: 'payment',
      amount: 75000,
      status: 'completed',
      description: 'Video Call with Sarah M.',
      date: '2024-01-15',
      reference: 'ORD001'
    },
    {
      id: 'TXN002',
      type: 'commission',
      amount: 50000,
      status: 'completed',
      description: 'Commission from Chat Service',
      date: '2024-01-14',
      reference: 'ORD002'
    },
    {
      id: 'TXN003',
      type: 'withdrawal',
      amount: 200000,
      status: 'processing',
      description: 'Withdrawal to Bank Account',
      date: '2024-01-13'
    },
    {
      id: 'TXN004',
      type: 'refund',
      amount: 25000,
      status: 'completed',
      description: 'Refund for cancelled service',
      date: '2024-01-12'
    }
  ];

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'payment':
        return 'bg-red-100 text-red-600';
      case 'commission':
        return 'bg-green-100 text-green-600';
      case 'withdrawal':
        return 'bg-blue-100 text-blue-600';
      case 'refund':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-600';
      case 'pending':
        return 'bg-yellow-100 text-yellow-600';
      case 'processing':
        return 'bg-blue-100 text-blue-600';
      case 'failed':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>Transaction History</CardTitle>
            <p className="text-sm text-gray-600">Manage and track all your transactions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="payment">Payment</SelectItem>
              <SelectItem value="commission">Commission</SelectItem>
              <SelectItem value="withdrawal">Withdrawal</SelectItem>
              <SelectItem value="refund">Refund</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transaction Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>
                    <Badge className={getTransactionTypeColor(transaction.type)}>
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className="font-semibold">
                    {transaction.type === 'payment' || transaction.type === 'withdrawal' ? '-' : '+'}
                    Rp {transaction.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No transactions found matching your criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
