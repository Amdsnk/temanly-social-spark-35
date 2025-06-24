
import React, { useState } from 'react';
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
import { toast } from "@/components/ui/use-toast";
import { Mail, MessageSquare, Shield, User, Lock, Upload, Check, AlertCircle } from 'lucide-react';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';
import { sendEmailVerification, sendWhatsAppVerification, verifyWhatsAppCode, verifyEmailToken } from '@/services/verificationService';

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
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Verification states
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [expectedEmailCode, setExpectedEmailCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  
  const [isWhatsappSending, setIsWhatsappSending] = useState(false);
  const [isWhatsappSent, setIsWhatsappSent] = useState(false);
  const [whatsappCode, setWhatsappCode] = useState('');
  const [expectedWhatsappCode, setExpectedWhatsappCode] = useState('');
  const [isWhatsappVerified, setIsWhatsappVerified] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // KTP Upload Handler
  const handleKtpUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File Terlalu Besar",
          description: "Ukuran file KTP maksimal 5MB",
          variant: "destructive"
        });
        return;
      }
      setKtpFile(file);
      toast({
        title: "KTP Berhasil Diupload",
        description: `File ${file.name} telah dipilih`,
        className: "bg-green-50 border-green-200"
      });
    }
  };

  // Email Verification
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
    try {
      const result = await sendEmailVerification(watchedValues.email);
      
      if (result.success) {
        setIsEmailSent(true);
        toast({
          title: "Email Verifikasi Terkirim",
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
    } catch (error) {
      toast({
        title: "Gagal Mengirim Email",
        description: "Terjadi kesalahan saat mengirim email verifikasi",
        variant: "destructive"
      });
    } finally {
      setIsEmailSending(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!emailVerificationCode) {
      toast({
        title: "Error",
        description: "Mohon masukkan kode verifikasi email",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await verifyEmailToken(watchedValues.email, emailVerificationCode);
      
      if (result.success) {
        setIsEmailVerified(true);
        toast({
          title: "Email Terverifikasi",
          description: result.message,
          className: "bg-green-50 border-green-200"
        });
      } else {
        toast({
          title: "Kode Salah",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Verifikasi Gagal",
        description: "Terjadi kesalahan saat memverifikasi email",
        variant: "destructive"
      });
    }
  };

  // WhatsApp Verification
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
    try {
      const result = await sendWhatsAppVerification(watchedValues.phone);
      
      if (result.success) {
        setIsWhatsappSent(true);
        setExpectedWhatsappCode(result.code || '');
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
    } catch (error) {
      toast({
        title: "Gagal Mengirim Kode WhatsApp",
        description: "Terjadi kesalahan saat mengirim kode WhatsApp",
        variant: "destructive"
      });
    } finally {
      setIsWhatsappSending(false);
    }
  };

  const handleVerifyWhatsapp = async () => {
    if (!whatsappCode) {
      toast({
        title: "Error",
        description: "Mohon masukkan kode verifikasi WhatsApp",
        variant: "destructive"
      });
      return;
    }

    try {
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
          title: "Kode Salah",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Verifikasi Gagal",
        description: "Terjadi kesalahan saat memverifikasi WhatsApp",
        variant: "destructive"
      });
    }
  };

  // Final Registration
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!ktpFile || !isEmailVerified || !isWhatsappVerified) {
      toast({
        title: "Verifikasi Belum Lengkap",
        description: "Mohon lengkapi semua verifikasi (KTP, Email, WhatsApp)",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate registration process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Pendaftaran Berhasil!",
        description: "Akun Anda telah berhasil dibuat dan diverifikasi",
        className: "bg-green-50 border-green-200"
      });
      
      // Redirect to dashboard or login
      setTimeout(() => {
        navigate('/user-dashboard');
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Pendaftaran Gagal",
        description: "Terjadi kesalahan saat mendaftar. Silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAllVerified = ktpFile && isEmailVerified && isWhatsappVerified;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      <MainHeader />
      
      <div className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Daftar Akun Baru</h1>
            <p className="text-gray-600">Lengkapi data dan verifikasi untuk bergabung</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                1
              </div>
              <div className={`w-16 h-1 ${currentStep > 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                2
              </div>
              <div className={`w-16 h-1 ${currentStep > 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                3
              </div>
            </div>
          </div>

          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-center text-xl text-gray-800">
                {currentStep === 1 && "Data Pribadi"}
                {currentStep === 2 && "Verifikasi Identitas"}
                {currentStep === 3 && "Selesaikan Pendaftaran"}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Step 1: Personal Data */}
              {currentStep === 1 && (
                <Form {...form}>
                  <form className="space-y-5">
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
                              {...field}
                              placeholder="Masukkan nama lengkap Anda" 
                              className="h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                              autoComplete="name"
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
                              {...field}
                              type="email"
                              placeholder="contoh@email.com" 
                              className="h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                              autoComplete="email"
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
                              {...field}
                              type="tel"
                              placeholder="08123456789" 
                              className="h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                              autoComplete="tel"
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
                              placeholder="Minimal 8 karakter" 
                              className="h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                              autoComplete="new-password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="button"
                      onClick={() => {
                        form.handleSubmit(() => setCurrentStep(2))();
                      }}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200"
                    >
                      Lanjut ke Verifikasi
                    </Button>
                  </form>
                </Form>
              )}

              {/* Step 2: Verification */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  {/* KTP Upload */}
                  <Card className="border border-orange-100 bg-orange-50/30">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Upload className="w-5 h-5 text-orange-600" />
                        <h3 className="font-semibold text-gray-800">Upload KTP/ID Card</h3>
                        {ktpFile && <Check className="w-5 h-5 text-green-600" />}
                      </div>
                      
                      <div className="border-2 border-dashed border-orange-200 rounded-lg p-6 text-center">
                        <Upload className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">Upload foto KTP/ID Card Anda</p>
                        <p className="text-sm text-gray-500 mb-4">Format: JPG, PNG, PDF (Maks. 5MB)</p>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleKtpUpload}
                          className="hidden"
                          id="ktp-upload"
                        />
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => document.getElementById('ktp-upload')?.click()}
                          className="border-orange-200 text-orange-700 hover:bg-orange-50"
                        >
                          Pilih File
                        </Button>
                        {ktpFile && (
                          <p className="text-sm text-green-600 mt-2">
                            ✓ File terpilih: {ktpFile.name}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Email Verification */}
                  <Card className="border border-blue-100 bg-blue-50/30">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-800">Verifikasi Email</h3>
                        {isEmailVerified && <Check className="w-5 h-5 text-green-600" />}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">Email: {watchedValues.email}</p>
                      
                      {!isEmailSent ? (
                        <Button 
                          onClick={handleSendEmailVerification} 
                          disabled={isEmailSending || !watchedValues.email}
                          className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                        >
                          {isEmailSending ? "Mengirim..." : "Kirim Kode Verifikasi"}
                        </Button>
                      ) : !isEmailVerified ? (
                        <div className="space-y-3">
                          <Input 
                            type="text" 
                            placeholder="Masukkan kode verifikasi dari email" 
                            value={emailVerificationCode}
                            onChange={(e) => setEmailVerificationCode(e.target.value)}
                            className="h-11 text-center text-lg font-mono tracking-wider"
                          />
                          <Button 
                            onClick={handleVerifyEmail} 
                            className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                          >
                            Verifikasi Email
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center py-2">
                          <div className="flex items-center gap-2 text-green-700">
                            <Check className="w-5 h-5" />
                            <span className="font-medium">Email telah terverifikasi!</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* WhatsApp Verification */}
                  <Card className="border border-green-100 bg-green-50/30">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <MessageSquare className="w-5 h-5 text-green-600" />
                        <h3 className="font-semibold text-gray-800">Verifikasi WhatsApp</h3>
                        {isWhatsappVerified && <Check className="w-5 h-5 text-green-600" />}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">WhatsApp: {watchedValues.phone}</p>
                      
                      {!isWhatsappSent ? (
                        <Button 
                          onClick={handleSendWhatsappVerification} 
                          disabled={isWhatsappSending || !watchedValues.phone}
                          className="w-full h-11 bg-green-600 hover:bg-green-700"
                        >
                          {isWhatsappSending ? "Mengirim..." : "Kirim Kode WhatsApp"}
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
                            <Check className="w-5 h-5" />
                            <span className="font-medium">WhatsApp telah terverifikasi!</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <div className="flex gap-4">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 h-12"
                    >
                      Kembali
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      disabled={!isAllVerified}
                      className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                    >
                      Lanjut
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Final Registration */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Verifikasi Selesai!</h3>
                    <p className="text-gray-600">Semua data dan verifikasi telah lengkap</p>
                  </div>

                  {/* Verification Summary */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <span className="text-sm">KTP/ID Card</span>
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <span className="text-sm">Email ({watchedValues.email})</span>
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <span className="text-sm">WhatsApp ({watchedValues.phone})</span>
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="flex-1 h-12"
                    >
                      Kembali
                    </Button>
                    <Button 
                      type="button"
                      onClick={form.handleSubmit(handleSubmit)}
                      disabled={isSubmitting}
                      className="flex-1 h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold"
                    >
                      {isSubmitting ? "Mendaftarkan..." : "Selesaikan Pendaftaran"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Signup;
