
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LogOut, Shield, TrendingUp, CreditCard, Settings, Users, DollarSign, Star, Activity, UserCog } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import UserApprovalManagement from '@/components/admin/UserApprovalManagement';
import PaymentManagement from '@/components/admin/PaymentManagement';
import TransactionManagement from '@/components/admin/TransactionManagement';
import FinancialOverview from '@/components/admin/FinancialOverview';
import TalentLevelManagement from '@/components/admin/TalentLevelManagement';
import ServiceAnalytics from '@/components/admin/ServiceAnalytics';
import RealTimeActivityMonitor from '@/components/admin/RealTimeActivityMonitor';
import SystemStats from '@/components/admin/SystemStats';
import UserManagement from '@/components/admin/UserManagement';

const AdminDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7days');
  const { signOut } = useAdminAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Temanly Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Production Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">7 Days</SelectItem>
                  <SelectItem value="30days">30 Days</SelectItem>
                  <SelectItem value="90days">90 Days</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Real-Time System Statistics */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Live System Overview</h2>
          <SystemStats />
        </div>

        <Tabs defaultValue="monitor" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-2 h-auto p-2 bg-muted">
            <TabsTrigger value="monitor" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Live Monitor
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <UserCog className="w-4 h-4" />
              All Users
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Financial
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="approvals" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Approvals
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="talents" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Talents
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monitor">
            <RealTimeActivityMonitor />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="financial">
            <FinancialOverview />
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionManagement />
          </TabsContent>

          <TabsContent value="approvals">
            <UserApprovalManagement />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentManagement />
          </TabsContent>

          <TabsContent value="talents">
            <TalentLevelManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <ServiceAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
