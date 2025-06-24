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
import { toast } from "@/components/ui/use-toast";
import { sendEmailVerification, sendWhatsAppVerification, verifyWhatsAppCode } from '@/services/verificationService';
import { useAuth } from '@/contexts/AuthContext';

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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendEmailVerification = async () => {
    if (!formData.email) {
      toast({
        title: "Error",
        description: "Mohon masukkan email terlebih dahulu",
        variant: "destructive"
      });
      return;
    }

    setIsEmailSending(true);
    const result = await sendEmailVerification(formData.email);
    
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
    if (!formData.phone) {
      toast({
        title: "Error",
        description: "Mohon masukkan nomor WhatsApp terlebih dahulu",
        variant: "destructive"
      });
      return;
    }

    setIsWhatsappSending(true);
    const result = await sendWhatsAppVerification(formData.phone);
    
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

    const result = await verifyWhatsAppCode(formData.phone, whatsappCode, expectedWhatsappCode);
    
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
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Daftar Akun Baru</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap</FormLabel>
                <FormControl>
                  <Input placeholder="Nama Lengkap" {...field} onChange={handleInputChange} />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} onChange={handleInputChange} type="email" />
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
                <FormLabel>Nomor WhatsApp</FormLabel>
                <FormControl>
                  <Input placeholder="Nomor WhatsApp" {...field} onChange={handleInputChange} type="tel" />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" {...field} onChange={handleInputChange} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Daftar</Button>
        </form>
      </Form>

      <div className="mt-6">
        {!isEmailSent ? (
          <Button 
            onClick={handleSendEmailVerification} 
            disabled={isEmailSending}
            className="w-full"
          >
            {isEmailSending ? "Mengirim Email..." : "Kirim Kode Verifikasi Email"}
          </Button>
        ) : (
          <p className="text-green-500 text-center">Email verifikasi telah dikirim!</p>
        )}
      </div>

      <div className="mt-4">
        {!isWhatsappSent ? (
          <Button 
            onClick={handleSendWhatsappVerification} 
            disabled={isWhatsappSending}
            className="w-full"
          >
            {isWhatsappSending ? "Mengirim Kode..." : "Kirim Kode Verifikasi WhatsApp"}
          </Button>
        ) : !isWhatsappVerified ? (
          <div className="space-y-2">
            <Input 
              type="text" 
              placeholder="Masukkan kode verifikasi WhatsApp" 
              value={whatsappCode}
              onChange={(e) => setWhatsappCode(e.target.value)}
            />
            <Button onClick={handleVerifyWhatsapp} className="w-full">
              Verifikasi WhatsApp
            </Button>
          </div>
        ) : (
          <p className="text-green-500 text-center">Nomor WhatsApp telah terverifikasi!</p>
        )}
      </div>
    </div>
  );
};

export default Signup;
