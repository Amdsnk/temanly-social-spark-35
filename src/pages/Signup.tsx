
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { toast } from "@/components/ui/use-toast";
import { sendEmailVerification, sendWhatsAppVerification, verifyWhatsAppCode } from '@/services/verificationService';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, MessageSquare, Shield, User, Lock } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Nama harus minimal 2 karakter.",
  }),
  email: z.string().email({
    message: "Format email tidak valid.",
  }),
  phone: z.string().min(10, {
    message: "Nomor WhatsApp harus minimal 10 angka.",
  }),
  password: z.string().min(8, {
    message: "Password harus minimal 8 karakter.",
  }),
});

const Signup = () => {
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isWhatsappSending, setIsWhatsappSending] = useState(false);
  const [isWhatsappSent, setIsWhatsappSent] = useState(false);
  const [isWhatsappVerified, setIsWhatsappVerified] = useState(false);
  const [whatsappCode, setWhatsappCode] = useState('');
  const [expectedWhatsappCode, setExpectedWhatsappCode] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const watchedValues = form.watch();

  const handleSendEmailVerification = async () => {
    if (!watchedValues.email) {
      toast({
        title: "Error",
        description: "Mohon masukkan email terlebih dahulu",
        variant: "destructive"
      });
      return;
    }

    setIsEmailSending(true);
    const result = await sendEmailVerification(watchedValues.email);
    
    if (result.success) {
      setIsEmailSent(true);
      toast({
        title: "Email Terkirim",
        description: result.message,
        className: "bg-green-50 border-green-200"
      });
    } else {
      toast({
        title: "Gagal Mengirim Email",
        description: result.message,
        variant: "destructive"
      });
    }
    setIsEmailSending(false);
  };

  const handleSendWhatsappVerification = async () => {
    if (!watchedValues.phone) {
      toast({
        title: "Error",
        description: "Mohon masukkan nomor WhatsApp terlebih dahulu",
        variant: "destructive"
      });
      return;
    }

    setIsWhatsappSending(true);
    const result = await sendWhatsAppVerification(watchedValues.phone);
    
    if (result.success) {
      setIsWhatsappSent(true);
      if (result.code) {
        setExpectedWhatsappCode(result.code);
      }
      toast({
        title: "Kode WhatsApp Terkirim",
        description: result.message,
        className: "bg-green-50 border-green-200"
      });
    } else {
      toast({
        title: "Gagal Mengirim Kode WhatsApp",
        description: result.message,
        variant: "destructive"
      });
    }
    setIsWhatsappSending(false);
  };

  const handleVerifyWhatsapp = async () => {
    if (!whatsappCode) {
      toast({
        title: "Error",
        description: "Mohon masukkan kode verifikasi",
        variant: "destructive"
      });
      return;
    }

    const result = await verifyWhatsAppCode(watchedValues.phone, whatsappCode, expectedWhatsappCode);
    
    if (result.success) {
      setIsWhatsappVerified(true);
      toast({
        title: "WhatsApp Terverifikasi",
        description: result.message,
        className: "bg-green-50 border-green-200"
      });
    } else {
      toast({
        title: "Verifikasi Gagal",
        description: result.message,
        variant: "destructive"
      });
    }
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast({
      title: "Success",
      description: "Pendaftaran berhasil!",
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="container mx-auto max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Daftar Akun Baru</h1>
          <p className="text-gray-600">Bergabunglah dengan komunitas kami</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-center text-xl text-gray-800">Informasi Pribadi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                        <User className="w-4 h-4" />
                        Nama Lengkap
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Masukkan nama lengkap Anda" 
                          {...field} 
                          className="h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
                          placeholder="contoh@email.com" 
                          {...field} 
                          type="email"
                          className="h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                        <MessageSquare className="w-4 h-4" />
                        Nomor WhatsApp
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="08123456789" 
                          {...field} 
                          type="tel"
                          className="h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
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
                          placeholder="Minimal 8 karakter" 
                          {...field} 
                          type="password"
                          className="h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Daftar Sekarang
                </Button>
              </form>
            </Form>

            <div className="space-y-4 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 text-center">Verifikasi Akun</h3>
              
              {/* Email Verification */}
              <Card className="border border-blue-100 bg-blue-50/30">
                <CardContent className="p-4">
                  {!isEmailSent ? (
                    <Button 
                      onClick={handleSendEmailVerification} 
                      disabled={isEmailSending || !watchedValues.email}
                      variant="outline"
                      className="w-full h-11 border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      {isEmailSending ? "Mengirim Email..." : "Kirim Verifikasi Email"}
                    </Button>
                  ) : (
                    <div className="flex items-center justify-center py-2">
                      <div className="flex items-center gap-2 text-green-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium">Email verifikasi telah dikirim!</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* WhatsApp Verification */}
              <Card className="border border-green-100 bg-green-50/30">
                <CardContent className="p-4 space-y-3">
                  {!isWhatsappSent ? (
                    <Button 
                      onClick={handleSendWhatsappVerification} 
                      disabled={isWhatsappSending || !watchedValues.phone}
                      variant="outline"
                      className="w-full h-11 border-green-200 text-green-700 hover:bg-green-50"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      {isWhatsappSending ? "Mengirim Kode..." : "Kirim Kode WhatsApp"}
                    </Button>
                  ) : !isWhatsappVerified ? (
                    <div className="space-y-3">
                      <Input 
                        type="text" 
                        placeholder="Masukkan 6 digit kode verifikasi" 
                        value={whatsappCode}
                        onChange={(e) => setWhatsappCode(e.target.value)}
                        className="h-11 text-center text-lg font-mono tracking-wider"
                        maxLength={6}
                      />
                      <Button 
                        onClick={handleVerifyWhatsapp} 
                        className="w-full h-11 bg-green-600 hover:bg-green-700"
                      >
                        Verifikasi WhatsApp
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-2">
                      <div className="flex items-center gap-2 text-green-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium">WhatsApp telah terverifikasi!</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Sudah punya akun?{' '}
            <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
              Masuk di sini
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
