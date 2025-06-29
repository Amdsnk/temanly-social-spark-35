
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  verified: boolean;
  user_type: 'user' | 'companion' | 'admin';
  verification_status: 'pending' | 'verified' | 'rejected';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<{ needsVerification: boolean }>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  user_type?: 'user' | 'companion';
  additionalData?: {
    age?: number;
    location?: string;
    bio?: string;
    zodiac?: string;
    loveLanguage?: string;
    services?: string[];
    availableServices?: string[];
    rentLoverDetails?: {
      price: number;
      inclusions: string[];
      description: string;
    };
    hourlyRate?: number;
    experienceYears?: number;
    availability?: {
      offlineDate: {
        weekdays: string[];
        timeSlots: string[];
      };
      partyBuddy: {
        available: boolean;
        weekends: string[];
      };
      general: string[];
    } | string[];
    dateInterests?: string[];
    languages?: string[];
    specialties?: string[];
    transportationMode?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    hasIdCard?: boolean;
    hasProfilePhoto?: boolean;
    interests?: string[];
    registrationTimestamp?: string;
    formVersion?: string;
    completionStatus?: string;
    businessModel?: string;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          if (mounted) {
            setIsLoading(false);
          }
          return;
        }

        if (session?.user && mounted) {
          console.log('Found existing session for user:', session.user.id);
          await fetchUserProfile(session.user.id);
        } else if (mounted) {
          console.log('No existing session found');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session?.user) {
        // Defer profile fetching to avoid deadlocks
        setTimeout(() => {
          if (mounted) {
            fetchUserProfile(session.user.id);
          }
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsLoading(false);
      }
    });

    // Initialize auth
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        
        // If profile doesn't exist, create a basic one
        if (error.code === 'PGRST116') {
          const { data: authUser } = await supabase.auth.getUser();
          if (authUser.user) {
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: userId,
                email: authUser.user.email || '',
                name: authUser.user.user_metadata?.full_name || 'User',
                full_name: authUser.user.user_metadata?.full_name || 'User',
                phone: authUser.user.user_metadata?.phone || '',
                user_type: 'user',
                verification_status: 'verified',
                status: 'active'
              });
            
            if (!insertError) {
              // Retry fetching the profile
              setTimeout(() => fetchUserProfile(userId), 100);
              return;
            }
          }
        }
        
        // Set loading to false even if profile fetch fails
        setIsLoading(false);
        return;
      }

      console.log('Profile data:', data);

      setUser({
        id: data.id,
        name: data.name || data.full_name || 'User',
        email: data.email || '',
        phone: data.phone,
        verified: data.verification_status === 'verified',
        user_type: data.user_type || 'user',
        verification_status: data.verification_status || 'verified'
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkExistingUser = async (email: string, phone: string) => {
    try {
      // Check if email or phone exists in profiles table
      const { data: profilesData, error: profileError } = await supabase
        .from('profiles')
        .select('email, phone')
        .or(`email.eq.${email},phone.eq.${phone}`);

      if (profileError) {
        console.error('Error checking existing users:', profileError);
        return { exists: false };
      }

      if (profilesData && profilesData.length > 0) {
        const existingProfile = profilesData[0];
        if (existingProfile.email === email) {
          return { exists: true, type: 'email' };
        }
        if (existingProfile.phone === phone) {
          return { exists: true, type: 'phone' };
        }
      }

      return { exists: false };
    } catch (error) {
      console.error('Error checking existing users:', error);
      return { exists: false };
    }
  };

  const signup = async (userData: SignupData): Promise<{ needsVerification: boolean }> => {
    try {
      console.log('Starting comprehensive signup process for:', userData.email);
      
      // Check if user already exists
      const existingUser = await checkExistingUser(userData.email, userData.phone);
      
      if (existingUser.exists) {
        const message = existingUser.type === 'email' 
          ? 'Email sudah terdaftar. Silakan gunakan email lain atau login jika Anda sudah memiliki akun.'
          : 'Nomor WhatsApp sudah terdaftar. Silakan gunakan nomor lain atau login jika Anda sudah memiliki akun.';
          
        toast({
          title: "Pendaftaran Gagal",
          description: message,
          variant: "destructive"
        });
        throw new Error(message);
      }
      
      // For talent registration, we'll use a comprehensive approach
      if (userData.user_type === 'companion') {
        console.log('Creating comprehensive talent user with detailed data');
        
        // Prepare comprehensive metadata
        const userMetadata = {
          full_name: userData.name,
          user_type: userData.user_type,
          phone: userData.phone,
          // Include all additional data in metadata for easy access
          ...userData.additionalData
        };
        
        // First, create the auth user with comprehensive metadata
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: userMetadata
          }
        });

        if (authError) {
          console.error('Auth signup error:', authError);
          throw authError;
        }

        if (authData.user) {
          console.log('Talent user created in auth with comprehensive data:', authData.user.id);
          
          // Create comprehensive profile with all data structured properly
          try {
            console.log('Creating comprehensive talent profile directly...');
            
            // Create comprehensive profile data with proper structure for admin review
            const profileData = {
              id: authData.user.id,
              email: userData.email,
              name: userData.name,
              full_name: userData.name,
              phone: userData.phone,
              user_type: 'companion' as Database['public']['Enums']['user_type'],
              verification_status: 'pending' as Database['public']['Enums']['verification_status'],
              status: 'pending' as Database['public']['Enums']['user_status'],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              // Add all talent-specific data for admin review
              age: userData.additionalData?.age,
              location: userData.additionalData?.location,
              bio: userData.additionalData?.bio,
              hourly_rate: userData.additionalData?.hourlyRate,
              // Store comprehensive registration data in profile_data for admin review
              profile_data: JSON.stringify({
                // Personal Info
                age: userData.additionalData?.age,
                location: userData.additionalData?.location,
                bio: userData.additionalData?.bio,
                
                // Service Info
                services: userData.additionalData?.services || [],
                hourlyRate: userData.additionalData?.hourlyRate,
                experienceYears: userData.additionalData?.experienceYears || 0,
                
                // Skills & Languages
                languages: userData.additionalData?.languages || ['Bahasa Indonesia'],
                specialties: userData.additionalData?.specialties || [],
                interests: userData.additionalData?.interests || [],
                
                // Availability & Transportation
                availability: userData.additionalData?.availability || [],
                transportationMode: userData.additionalData?.transportationMode,
                
                // Emergency Contact
                emergencyContact: userData.additionalData?.emergencyContact,
                emergencyPhone: userData.additionalData?.emergencyPhone,
                
                // Document Status
                hasIdCard: userData.additionalData?.hasIdCard || false,
                hasProfilePhoto: userData.additionalData?.hasProfilePhoto || false,
                
                // Registration metadata
                registrationTimestamp: new Date().toISOString(),
                completionStatus: 'complete',
                dataVersion: '1.0'
              })
            };

            console.log('Profile data being inserted:', profileData);

            const { error: profileError } = await supabase
              .from('profiles')
              .insert(profileData);

            if (profileError) {
              console.error('Direct comprehensive profile creation failed:', profileError);
              // Try using the edge function as fallback
              console.log('Attempting profile creation via edge function...');
              
              const { error: functionError } = await supabase.functions.invoke('create-talent-profile', {
                body: {
                  userId: authData.user.id,
                  email: userData.email,
                  name: userData.name,
                  phone: userData.phone,
                  userType: 'companion',
                  comprehensiveData: userData.additionalData
                }
              });

              if (functionError) {
                console.error('Function also failed:', functionError);
                console.log('Profile creation failed but auth user exists. Admin will need to manually create profile.');
              }
            } else {
              console.log('Direct comprehensive profile creation succeeded');
            }

          } catch (profileError) {
            console.error('Profile creation exception:', profileError);
            console.log('Profile creation failed but auth user exists with comprehensive metadata.');
          }

          toast({
            title: "Registrasi Talent Berhasil!",
            description: "Data lengkap Anda telah diterima dan sedang menunggu verifikasi admin. Kami akan menghubungi Anda dalam 1-2 hari kerja.",
            className: "bg-green-50 border-green-200"
          });

          return { needsVerification: true };
        }
      } else {
        // Regular user signup
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              full_name: userData.name,
              user_type: userData.user_type || 'user',
              phone: userData.phone
            }
          }
        });

        if (authError) {
          console.error('Auth signup error:', authError);
          throw authError;
        }

        if (authData.user) {
          console.log('User created in auth:', authData.user.id);
          
          // Create profile in database with properly typed values
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: authData.user.id,
              email: userData.email,
              name: userData.name,
              full_name: userData.name,
              phone: userData.phone,
              user_type: (userData.user_type || 'user') as Database['public']['Enums']['user_type'],
              verification_status: 'verified' as Database['public']['Enums']['verification_status'],
              status: 'active' as Database['public']['Enums']['user_status'],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (profileError) {
            console.error('Profile creation error:', profileError);
            throw profileError;
          }

          console.log('User profile created successfully');

          toast({
            title: "Registrasi Berhasil!",
            description: "Akun Anda telah dibuat dan siap digunakan.",
            className: "bg-green-50 border-green-200"
          });

          return { needsVerification: false };
        }
      }

      throw new Error('User creation failed');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Registrasi Gagal",
        description: error.message || "Terjadi kesalahan saat mendaftar.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      
      // Clear any existing auth state first
      try {
        await supabase.auth.signOut();
      } catch (err) {
        // Ignore signout errors
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      if (data.user) {
        console.log('Login successful for user:', data.user.id);
        
        toast({
          title: "Login berhasil!",
          description: "Selamat datang kembali di Temanly.",
          className: "bg-green-50 border-green-200"
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login gagal",
        description: error.message || "Email atau password salah.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out user');
      setUser(null);
      await supabase.auth.signOut();
      localStorage.removeItem('bookings');
      localStorage.removeItem('transactions');
      
      toast({
        title: "Logout berhasil",
        description: "Anda telah keluar dari akun.",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
