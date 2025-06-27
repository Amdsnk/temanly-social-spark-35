
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const FinancialOverview = () => {
  const [timeframe, setTimeframe] = useState('30days');

  // Mock financial data - replace with real Supabase queries
  const financialStats = {
    totalRevenue: 156000000, // IDR 156M
    monthlyGrowth: 18.5,
    platformFees: 31200000, // 20% of revenue
    talentEarnings: 124800000, // 80% of revenue
    pendingPayouts: 8500000,
    completedPayouts: 116300000,
    refunds: 2400000,
    chargebacks: 650000,
    averageTransactionValue: 175000,
    transactionCount: 892,
    topServices: [
      { service: 'Chat', revenue: 65000000, transactions: 456, growth: 25 },
      { service: 'Video Call', revenue: 45000000, transactions: 234, growth: 15 },
      { service: 'Offline Date', revenue: 32000000, transactions: 156, growth: -5 },
      { service: 'Call', revenue: 14000000, transactions: 46, growth: 8 }
    ],
    monthlyTrend: [
      { month: 'Jan', revenue: 98000000, fees: 19600000 },
      { month: 'Feb', revenue: 112000000, fees: 22400000 },
      { month: 'Mar', revenue: 125000000, fees: 25000000 },
      { month: 'Apr', revenue: 139000000, fees: 27800000 },
      { month: 'May', revenue: 147000000, fees: 29400000 },
      { month: 'Jun', revenue: 156000000, fees: 31200000 }
    ]
  };

  const formatCurrency = (amount: number) => {
    return `Rp ${(amount / 1000000).toFixed(1)}M`;
  };

  const formatGrowth = (growth: number) => {
    const isPositive = growth > 0;
    return (
      <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        <span className="text-xs font-medium">{Math.abs(growth)}%</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(financialStats.totalRevenue)}
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">Bulan ini</p>
              {formatGrowth(financialStats.monthlyGrowth)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Fees</CardTitle>
            <Wallet className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(financialStats.platformFees)}
            </div>
            <p className="text-xs text-muted-foreground">
              {((financialStats.platformFees / financialStats.totalRevenue) * 100).toFixed(1)}% dari total revenue
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Talent Earnings</CardTitle>
            <PiggyBank className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(financialStats.talentEarnings)}
            </div>
            <p className="text-xs text-muted-foreground">
              Dibayar ke {financialStats.transactionCount} transaksi
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <CreditCard className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(financialStats.pendingPayouts)}
            </div>
            <p className="text-xs text-muted-foreground">
              Menunggu pembayaran
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Service Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Service Performance & Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {financialStats.topServices.map((service, index) => (
              <div key={service.service} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold">{service.service}</h4>
                    <p className="text-sm text-gray-600">{service.transactions} transaksi</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{formatCurrency(service.revenue)}</div>
                  {formatGrowth(service.growth)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Health Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Completed Payouts</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-600">Healthy</Badge>
                  <span className="font-semibold">{formatCurrency(financialStats.completedPayouts)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Refunds</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-100 text-yellow-600">Monitor</Badge>
                  <span className="font-semibold">{formatCurrency(financialStats.refunds)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Chargebacks</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-100 text-red-600">Watch</Badge>
                  <span className="font-semibold">{formatCurrency(financialStats.chargebacks)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Average Transaction Value</span>
                <span className="font-semibold">Rp {financialStats.averageTransactionValue.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Transactions</span>
                <span className="font-semibold">{financialStats.transactionCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Success Rate</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-600">97.8%</Badge>
                  <span className="text-sm text-green-600">Excellent</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-4">
            {financialStats.monthlyTrend.map((month) => (
              <div key={month.month} className="text-center">
                <div className="text-xs text-gray-600 mb-2">{month.month}</div>
                <div className="bg-blue-100 rounded-lg p-3">
                  <div className="text-sm font-bold text-blue-600">
                    {formatCurrency(month.revenue)}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Fee: {formatCurrency(month.fees)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialOverview;
