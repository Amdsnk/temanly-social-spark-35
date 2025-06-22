
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Shield, Settings } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useToast } from '@/hooks/use-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [settingUp, setSettingUp] = useState(false);
  const { signIn, setupAdmin } = useAdminAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: "Login Failed",
        description: error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Login Successful",
        description: "Welcome to Temanly Admin Dashboard"
      });
    }

    setLoading(false);
  };

  const handleSetupAdmin = async () => {
    setSettingUp(true);
    
    const result = await setupAdmin();
    
    if (result.success) {
      toast({
        title: "Admin Setup Complete",
        description: result.message,
      });
      
      if (result.credentials) {
        setEmail(result.credentials.email);
        setPassword(result.credentials.password);
        toast({
          title: "Default Credentials Created",
          description: `Email: ${result.credentials.email}`,
          duration: 10000,
        });
      }
    } else {
      toast({
        title: "Setup Failed",
        description: result.error || "Failed to setup admin account",
        variant: "destructive"
      });
    }
    
    setSettingUp(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Shield className="w-12 h-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Temanly Admin</CardTitle>
          <p className="text-gray-600">Super Admin Dashboard Access</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="temanly.admin@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In as Admin'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">First time setup</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleSetupAdmin}
            disabled={settingUp}
          >
            {settingUp ? (
              'Setting up...'
            ) : (
              <>
                <Settings className="w-4 h-4 mr-2" />
                Setup Default Admin
              </>
            )}
          </Button>

          <div className="text-xs text-gray-500 text-center">
            Admin access restricted to authorized email addresses only
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
