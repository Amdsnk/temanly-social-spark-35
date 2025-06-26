
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Camera, Shield, Bell, Lock, CreditCard, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileSettingsProps {
  userType: 'user' | 'companion' | 'admin';
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ userType }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: '',
    location: '',
    birthDate: '',
    gender: '',
    profileImage: ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showOnlineStatus: true,
    allowMessages: true,
    showLastSeen: false
  });

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
        className: "bg-green-50 border-green-200"
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    toast({
      title: "Password Change",
      description: "Password change functionality will be implemented soon.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Image */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              {profile.profileImage ? (
                <img 
                  src={profile.profileImage} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover" 
                />
              ) : (
                <Camera className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div>
              <Button variant="outline" size="sm">Change Photo</Button>
              <p className="text-sm text-gray-500 mt-1">JPG, PNG max 5MB</p>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({...prev, name: e.target.value}))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile(prev => ({...prev, email: e.target.value}))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile(prev => ({...prev, phone: e.target.value}))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profile.location}
                onChange={(e) => setProfile(prev => ({...prev, location: e.target.value}))}
                placeholder="City, Country"
              />
            </div>
          </div>

          {userType === 'companion' && (
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile(prev => ({...prev, bio: e.target.value}))}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>
          )}

          <Button onClick={handleProfileUpdate} disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Profile'}
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security & Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Verification</p>
              <p className="text-sm text-gray-500">Verify your email address</p>
            </div>
            <Badge className={user?.verified ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}>
              {user?.verified ? 'Verified' : 'Pending'}
            </Badge>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Change Password</p>
              <p className="text-sm text-gray-500">Update your account password</p>
            </div>
            <Button variant="outline" onClick={handlePasswordChange}>
              Change
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-gray-500">Add an extra layer of security</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive updates via email</p>
            </div>
            <Switch 
              checked={notifications.emailNotifications}
              onCheckedChange={(checked) => setNotifications(prev => ({...prev, emailNotifications: checked}))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-gray-500">Get notified on your device</p>
            </div>
            <Switch 
              checked={notifications.pushNotifications}
              onCheckedChange={(checked) => setNotifications(prev => ({...prev, pushNotifications: checked}))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">SMS Notifications</p>
              <p className="text-sm text-gray-500">Receive important updates via SMS</p>
            </div>
            <Switch 
              checked={notifications.smsNotifications}
              onCheckedChange={(checked) => setNotifications(prev => ({...prev, smsNotifications: checked}))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Marketing Emails</p>
              <p className="text-sm text-gray-500">Receive promotional content</p>
            </div>
            <Switch 
              checked={notifications.marketingEmails}
              onCheckedChange={(checked) => setNotifications(prev => ({...prev, marketingEmails: checked}))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Profile Visibility</p>
              <p className="text-sm text-gray-500">Make your profile visible to others</p>
            </div>
            <Switch 
              checked={privacy.profileVisible}
              onCheckedChange={(checked) => setPrivacy(prev => ({...prev, profileVisible: checked}))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Show Online Status</p>
              <p className="text-sm text-gray-500">Let others see when you're online</p>
            </div>
            <Switch 
              checked={privacy.showOnlineStatus}
              onCheckedChange={(checked) => setPrivacy(prev => ({...prev, showOnlineStatus: checked}))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Allow Messages</p>
              <p className="text-sm text-gray-500">Receive messages from other users</p>
            </div>
            <Switch 
              checked={privacy.allowMessages}
              onCheckedChange={(checked) => setPrivacy(prev => ({...prev, allowMessages: checked}))}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
