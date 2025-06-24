
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import MainHeader from '@/components/MainHeader';
import { useToast } from '@/hooks/use-toast';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  
  const { signup, login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Handle login
      setIsLoading(true);
      try {
        await login(formData.email, formData.password);
        navigate('/user-dashboard');
      } catch (error) {
        // Error handled in AuthContext
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Handle signup
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Password tidak sama",
        variant: "destructive"
      });
      return;
    }

    if (!formData.agreeTerms) {
      toast({
        title: "Error", 
        description: "Harap setujui syarat dan ketentuan",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await signup({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        user_type: 'user'
      });

      if (result.needsVerification) {
        // Show success message and redirect to waiting page
        toast({
          title: "Pendaftaran Berhasil!",
          description: "Akun Anda menunggu persetujuan admin. Anda akan dihubungi melalui WhatsApp.",
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          agreeTerms: false
        });
      }
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50">
      <MainHeader />
      
      <div className="flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center space-y-4">
              <img 
                src="/lovable-uploads/2b715270-d5ae-4f6c-be60-2dfaf1662139.png" 
                alt="Temanly Logo"
                className="h-12 mx-auto"
              />
              <CardTitle className="text-2xl">
                {isLogin ? 'Masuk ke Temanly' : 'Daftar Temanly'}
              </CardTitle>
              <p className="text-gray-600">
                {isLogin 
                  ? 'Selamat datang kembali! Silakan masuk ke akun Anda.' 
                  : 'Bergabunglah dengan komunitas Temanly sekarang!'
                }
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="masukkan@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor WhatsApp</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="08123456789"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={isLogin ? "Masukkan password" : "Minimal 8 karakter"}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      minLength={isLogin ? 1 : 8}
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

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Masukkan ulang password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Lupa password?</span>
                  </div>
                )}

                {!isLogin && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeTerms: checked === true }))}
                    />
                    <Label htmlFor="terms" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Saya setuju dengan{' '}
                      <Link to="/terms" className="text-blue-600 hover:underline">
                        Syarat & Ketentuan
                      </Link>
                      {' '}dan{' '}
                      <Link to="/privacy" className="text-blue-600 hover:underline">
                        Kebijakan Privasi
                      </Link>
                    </Label>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-pink-500 hover:bg-pink-600"
                  disabled={isLoading}
                >
                  {isLoading 
                    ? (isLogin ? 'Memproses...' : 'Mendaftar...') 
                    : (isLogin ? 'Masuk' : 'Daftar Sekarang')
                  }
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-gray-600">
                  {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
                </span>
                <Button 
                  variant="link" 
                  className="text-blue-600 hover:underline font-medium p-0 h-auto"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Daftar sekarang' : 'Masuk di sini'}
                </Button>
              </div>

              {!isLogin && (
                <div className="mt-4 text-center">
                  <Link to="/talent-register" className="text-pink-600 hover:underline text-sm">
                    Ingin jadi Talent? Daftar di sini
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Signup;
