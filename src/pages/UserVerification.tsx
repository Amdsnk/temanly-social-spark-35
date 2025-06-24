
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Shield, Check, Phone, Mail, IdCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';

const UserVerification = () => {
  const [formData, setFormData] = useState({
    ktpFile: null as File | null,
    emailVerified: false,
    whatsappCode: '',
    whatsappVerified: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleKtpUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, ktpFile: file }));
      toast({
        title: "KTP uploaded successfully",
        description: `File ${file.name} has been selected for verification.`,
      });
    }
  };

  const handleEmailVerification = async () => {
    setIsLoading(true);
    // Simulate email verification
    setTimeout(() => {
      setFormData(prev => ({ ...prev, emailVerified: true }));
      toast({
        title: "Email Verified",
        description: "Your email has been successfully verified.",
      });
      setIsLoading(false);
    }, 2000);
  };

  const handleWhatsappVerification = async () => {
    if (!formData.whatsappCode) {
      toast({
        title: "Enter verification code",
        description: "Please enter the WhatsApp verification code.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    // Simulate WhatsApp verification
    setTimeout(() => {
      setFormData(prev => ({ ...prev, whatsappVerified: true }));
      toast({
        title: "WhatsApp Verified",
        description: "Your WhatsApp number has been verified.",
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleSubmitVerification = async () => {
    if (!formData.ktpFile || !formData.emailVerified || !formData.whatsappVerified) {
      toast({
        title: "Complete all verification steps",
        description: "Please complete KTP upload, email, and WhatsApp verification.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    // Simulate verification submission
    setTimeout(() => {
      toast({
        title: "Verification Submitted",
        description: "Your verification documents have been submitted for review. You will be notified within 24 hours.",
      });
      setIsLoading(false);
    }, 2000);
  };

  const allVerified = formData.ktpFile && formData.emailVerified && formData.whatsappVerified;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="User Verification" 
        subtitle="Complete your identity verification to access all services"
        backTo="/user-dashboard"
      />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Identity Verification
            </CardTitle>
            <p className="text-gray-600">
              Complete these steps to access Offline Date and Party Buddy services
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            
            {/* KTP Upload */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <IdCard className="w-5 h-5" />
                <h3 className="font-semibold">1. KTP/ID Card Upload</h3>
                {formData.ktpFile && <Check className="w-5 h-5 text-green-600" />}
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Upload your KTP/ID Card</p>
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
                  Choose File
                </Button>
                {formData.ktpFile && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ File selected: {formData.ktpFile.name}
                  </p>
                )}
              </div>
            </div>

            {/* Email Verification */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <h3 className="font-semibold">2. Email Verification</h3>
                {formData.emailVerified && <Check className="w-5 h-5 text-green-600" />}
              </div>
              
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-gray-600 mb-3">
                  Email: {user?.email}
                </p>
                <Button 
                  onClick={handleEmailVerification}
                  disabled={formData.emailVerified || isLoading}
                  className="w-full"
                >
                  {formData.emailVerified ? 'Email Verified ✓' : 'Verify Email'}
                </Button>
              </div>
            </div>

            {/* WhatsApp Verification */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <h3 className="font-semibold">3. WhatsApp Verification</h3>
                {formData.whatsappVerified && <Check className="w-5 h-5 text-green-600" />}
              </div>
              
              <div className="p-4 border rounded-lg space-y-3">
                <p className="text-sm text-gray-600">
                  WhatsApp: {user?.phone || 'Not provided'}
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter verification code"
                    value={formData.whatsappCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsappCode: e.target.value }))}
                    disabled={formData.whatsappVerified}
                  />
                  <Button 
                    onClick={handleWhatsappVerification}
                    disabled={formData.whatsappVerified || isLoading}
                  >
                    {formData.whatsappVerified ? 'Verified ✓' : 'Verify'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t">
              <Button 
                onClick={handleSubmitVerification}
                disabled={!allVerified || isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Submitting...' : 'Submit for Verification'}
              </Button>
              
              {allVerified && (
                <p className="text-sm text-green-600 text-center mt-2">
                  All verification steps completed! Ready to submit.
                </p>
              )}
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserVerification;
