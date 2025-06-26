

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';

const formSchema = z.object({
  email: z.string().email({
    message: "Format email tidak valid.",
  }),
  password: z.string().min(1, {
    message: "Password harus diisi.",
  }),
});

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User already authenticated, redirecting to dashboard');
      setIsLoading(false); // Reset loading state before navigation
      
      // Navigate based on user type
      if (user.user_type === 'companion') {
        navigate('/talent-dashboard');
      } else if (user.user_type === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user-dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isLoading) return; // Prevent multiple submissions
    
    setIsLoading(true);
    setError(null);
    
    console.log('Login attempt started for:', values.email);
    
    try {
      await login(values.email, values.password);
      console.log('Login successful');
      // Navigation will be handled by the useEffect above
      // Don't set loading to false here, let the useEffect handle it
    } catch (error: any) {
      console.error('Login failed with error:', error);
      
      let errorMessage = 'Login gagal. Silakan coba lagi.';
      
      if (error?.message) {
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email atau password salah. Silakan periksa kembali.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email belum terverifikasi. Silakan cek email Anda.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Terlalu banyak percobaan login. Silakan tunggu sebentar.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      
      toast({
        title: "Login Gagal",
        description: errorMessage,
        variant: "destructive",
      });
      
      setIsLoading(false); // Reset loading state on error
    }
  };

  const handleResetPassword = () => {
    // TODO: Implement password reset functionality
    toast({
      title: "Reset Password",
      description: "Fitur reset password akan segera tersedia.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      <MainHeader />
      
      <div className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Masuk ke Akun</h1>
            <p className="text-gray-600">Masuk untuk melanjutkan ke dashboard Anda</p>
          </div>

          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-center text-xl text-gray-800">
                Selamat Datang Kembali
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                          <Mail className="w-4 h-4" />
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            type="email"
                            placeholder="contoh@email.com" 
                            className="h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                            autoComplete="email"
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                          <Lock className="w-4 h-4" />
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            type="password"
                            placeholder="Masukkan password Anda" 
                            className="h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                            autoComplete="current-password"
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200"
                  >
                    {isLoading ? 'Masuk...' : 'Masuk'}
                  </Button>
                </form>
              </Form>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Lupa password?{' '}
                  <button 
                    onClick={handleResetPassword}
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                    type="button"
                  >
                    Reset password
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Belum punya akun?{' '}
              <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                Daftar di sini
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;

