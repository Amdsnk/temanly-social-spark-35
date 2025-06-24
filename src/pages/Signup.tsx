import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Upload, Shield, Check, Phone, Mail, IdCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import MainHeader from '@/components/MainHeader';
import { useToast } from '@/hooks/use-toast';
import { sendEmailVerification, sendWhatsAppVerification, verifyWhatsAppCode } from '@/services/verificationService';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Basic Info, 2: Verification
  const [verificationLoading, setVerificationLoading] = useState({
    email: false,
    whatsapp: false
  });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [verificationData, setVerificationData] = useState({
    ktpFile: null as File | null,
    emailVerified: false,
    emailToken: '',
    whatsappCode: '',
    whatsappVerified: false,
    demoVerificationCode: '' // For demo purposes
  });
  
  const { signup, login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBasicInfoSubmit = async (e: React.FormEvent) => {
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

    // Validate signup form
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

    // Move to verification step
    setCurrentStep(2);
  };

  const handleKtpUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVerificationData(prev => ({ ...prev, ktpFile: file }));
      toast({
        title: "KTP berhasil diunggah",
        description: `File ${file.name} telah dipilih untuk verifikasi.`,
      });
    }
  };

  const handleEmailVerification = async () => {
    setVerificationLoading(prev => ({ ...prev, email: true }));
    
    try {
      const result = await sendEmailVerification(formData.email);
      
      if (result.success) {
        toast({
          title: "Email Verifikasi Dikirim",
          description: result.message,
        });
        
        // For demo purposes, auto-verify after 2 seconds
        setTimeout(() => {
          setVerificationData(prev => ({ ...prev, emailVerified: true }));
          toast({
            title: "Email Terverifikasi",
            description: `Email ${formData.email} telah berhasil diverifikasi.`,
          });
        }, 2000);
      } else {
        toast({
          title: "Gagal Mengirim Email",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengirim email verifikasi",
        variant: "destructive"
      });
    } finally {
      setVerificationLoading(prev => ({ ...prev, email: false }));
    }
  };

  const handleSendWhatsAppCode = async () => {
    setVerificationLoading(prev => ({ ...prev, whatsapp: true }));
    
    try {
      const result = await sendWhatsAppVerification(formData.phone);
      
      if (result.success) {
        toast({
          title: "Kode WhatsApp Dikirim",
          description: result.message,
        });
        
        // Store demo code if available
        if (result.code) {
          setVerificationData(prev => ({ ...prev, demoVerificationCode: result.code }));
        }
      } else {
        toast({
          title: "Gagal Mengirim Kode",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengirim kode WhatsApp",
        variant: "destructive"
      });
    } finally {
      setVerificationLoading(prev => ({ ...prev, whatsapp: false }));
    }
  };

  const handleWhatsappVerification = async () => {
    if (!verificationData.whatsappCode) {
      toast({
        title: "Masukkan kode verifikasi",
        description: "Silakan masukkan kode verifikasi WhatsApp.",
        variant: "destructive"
      });
      return;
    }

    setVerificationLoading(prev => ({ ...prev, whatsapp: true }));
    
    try {
      const result = await verifyWhatsAppCode(formData.phone, verificationData.whatsappCode);
      
      if (result.success) {
        setVerificationData(prev => ({ ...prev, whatsappVerified: true }));
        toast({
          title: "WhatsApp Terverifikasi",
          description: result.message,
        });
      } else {
        toast({
          title: "Verifikasi Gagal",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memverifikasi kode WhatsApp",
        variant: "destructive"
      });
    } finally {
      setVerificationLoading(prev => ({ ...prev, whatsapp: false }));
    }
  };

  const handleCompleteRegistration = async () => {
    if (!verificationData.ktpFile || !verificationData.emailVerified || !verificationData.whatsappVerified) {
      toast({
        title: "Lengkapi semua verifikasi",
        description: "Harap selesaikan upload KTP, verifikasi email, dan verifikasi WhatsApp.",
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
        toast({
          title: "Pendaftaran Berhasil!",
          description: `Halo ${formData.name}! Akun Anda telah terdaftar dengan dokumen verifikasi. Tim kami akan menghubungi Anda melalui WhatsApp di ${formData.phone}.`,
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
        setVerificationData({
          ktpFile: null,
          emailVerified: false,
          emailToken: '',
          whatsappCode: '',
          whatsappVerified: false,
          demoVerificationCode: ''
        });
        setCurrentStep(1);
      }
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const allVerified = verificationData.ktpFile && verificationData.emailVerified && verificationData.whatsappVerified;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50">
      <MainHeader />
      
      <div className="flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">          
          <Card className="shadow-lg">
            <CardHeader className="text-center space-y-4">
              <img 
                src="/lovable-uploads/2b715270-d5ae-4f6c-be60-2dfaf1662139.png" 
                alt="Temanly Logo"
                className="h-12 mx-auto"
              />
              <CardTitle className="text-2xl">
                {isLogin ? 'Masuk ke Temanly' : (currentStep === 1 ? 'Daftar Temanly' : 'Verifikasi Identitas')}
              </CardTitle>
              <p className="text-gray-600">
                {isLogin 
                  ? 'Selamat datang kembali! Silakan masuk ke akun Anda.' 
                  : currentStep === 1
                    ? 'Bergabunglah dengan komunitas Temanly sekarang!'
                    : `Halo ${formData.name}! Lengkapi verifikasi untuk mengakses semua layanan.`
                }
              </p>
              
              {!isLogin && currentStep === 2 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-yellow-800 font-medium mb-2">
                    <Shield className="w-4 h-4" />
                    Data Pendaftar
                  </div>
                  <div className="text-sm text-yellow-700 space-y-1">
                    <p><strong>Nama:</strong> {formData.name}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>WhatsApp:</strong> {formData.phone}</p>
                  </div>
                </div>
              )}
            </CardHeader>
            
            <CardContent>
              {/* Step 1: Basic Registration Form */}
              {(isLogin || currentStep === 1) && (
                <form onSubmit={handleBasicInfoSubmit} className="space-y-4">
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
                      ? (isLogin ? 'Memproses...' : 'Memproses...') 
                      : (isLogin ? 'Masuk' : 'Lanjut ke Verifikasi')
                    }
                  </Button>
                </form>
              )}

              {/* Step 2: Verification Form */}
              {!isLogin && currentStep === 2 && (
                <div className="space-y-6">
                  
                  {/* KTP Upload */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <IdCard className="w-5 h-5" />
                      <h3 className="font-semibold">1. Upload KTP/ID Card</h3>
                      {verificationData.ktpFile && <Check className="w-5 h-5 text-green-600" />}
                    </div>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Upload KTP/ID Card Anda</p>
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
                      >
                        Pilih File
                      </Button>
                      {verificationData.ktpFile && (
                        <p className="text-sm text-green-600 mt-2">
                          ✓ File terpilih: {verificationData.ktpFile.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email Verification */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      <h3 className="font-semibold">2. Verifikasi Email</h3>
                      {verificationData.emailVerified && <Check className="w-5 h-5 text-green-600" />}
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-gray-600 mb-3">
                        Email: {formData.email}
                      </p>
                      <Button 
                        onClick={handleEmailVerification}
                        disabled={verificationData.emailVerified || verificationLoading.email}
                        className="w-full"
                        type="button"
                      >
                        {verificationLoading.email 
                          ? 'Mengirim...' 
                          : verificationData.emailVerified 
                            ? 'Email Terverifikasi ✓' 
                            : 'Kirim Email Verifikasi'
                        }
                      </Button>
                    </div>
                  </div>

                  {/* WhatsApp Verification */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Phone className="w-5 h-5" />
                      <h3 className="font-semibold">3. Verifikasi WhatsApp</h3>
                      {verificationData.whatsappVerified && <Check className="w-5 h-5 text-green-600" />}
                    </div>
                    
                    <div className="p-4 border rounded-lg space-y-3">
                      <p className="text-sm text-gray-600">
                        WhatsApp: {formData.phone}
                      </p>
                      
                      {!verificationData.whatsappVerified && (
                        <Button 
                          onClick={handleSendWhatsAppCode}
                          disabled={verificationLoading.whatsapp}
                          className="w-full mb-3"
                          type="button"
                        >
                          {verificationLoading.whatsapp ? 'Mengirim...' : 'Kirim Kode Verifikasi'}
                        </Button>
                      )}
                      
                      {verificationData.demoVerificationCode && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                          <p className="text-sm text-blue-700">
                            <strong>Demo Mode:</strong> Kode verifikasi Anda: <code className="bg-blue-100 px-2 py-1 rounded">{verificationData.demoVerificationCode}</code>
                          </p>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Input
                          placeholder="Masukkan kode verifikasi"
                          value={verificationData.whatsappCode}
                          onChange={(e) => setVerificationData(prev => ({ ...prev, whatsappCode: e.target.value }))}
                          disabled={verificationData.whatsappVerified}
                        />
                        <Button 
                          onClick={handleWhatsappVerification}
                          disabled={verificationData.whatsappVerified || verificationLoading.whatsapp}
                          type="button"
                        >
                          {verificationLoading.whatsapp 
                            ? 'Verifying...' 
                            : verificationData.whatsappVerified 
                              ? 'Verified ✓' 
                              : 'Verifikasi'
                          }
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Complete Registration */}
                  <div className="pt-4 border-t space-y-4">
                    <Button 
                      onClick={handleCompleteRegistration}
                      disabled={!allVerified || isLoading}
                      className="w-full bg-pink-500 hover:bg-pink-600"
                      size="lg"
                      type="button"
                    >
                      {isLoading ? 'Mendaftarkan...' : 'Selesaikan Pendaftaran'}
                    </Button>
                    
                    <Button 
                      onClick={() => setCurrentStep(1)}
                      variant="outline"
                      className="w-full"
                      type="button"
                    >
                      Kembali ke Data Pribadi
                    </Button>
                    
                    {allVerified && (
                      <p className="text-sm text-green-600 text-center">
                        Semua langkah verifikasi selesai! Siap untuk mendaftar.
                      </p>
                    )}
                  </div>

                </div>
              )}

              {/* Toggle Login/Signup */}
              <div className="mt-6 text-center text-sm">
                <span className="text-gray-600">
                  {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
                </span>
                <Button 
                  variant="link" 
                  className="text-blue-600 hover:underline font-medium p-0 h-auto"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setCurrentStep(1);
                  }}
                  type="button"
                >
                  {isLogin ? 'Daftar sekarang' : 'Masuk di sini'}
                </Button>
              </div>

              {!isLogin && currentStep === 1 && (
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
