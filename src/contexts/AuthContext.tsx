
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
    // Check current session on app load
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          console.log('Found existing session for user:', session.user.id);
          await fetchUserProfile(session.user.id);
        } else {
          console.log('No existing session found');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        setIsLoading(false);
      }
    };

    getSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
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
                email: authUser.user.email,
                name: authUser.user.user_metadata?.full_name || 'User',
                full_name: authUser.user.user_metadata?.full_name || 'User',
                phone: authUser.user.user_metadata?.phone || '',
                user_type: 'user',
                verification_status: 'verified',
                status: 'active'
              });
            
            if (!insertError) {
              await fetchUserProfile(userId);
              return;
            }
          }
        }
        throw error;
      }

      console.log('Profile data:', data);

      setUser({
        id: data.id,
        name: data.name || data.full_name || 'User',
        email: data.email,
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

  const signup = async (userData: SignupData): Promise<{ needsVerification: boolean }> => {
    try {
      console.log('Starting signup process for:', userData.email);
      
      // Sign up with Supabase Auth
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
        
        // Create profile in database
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            email: userData.email,
            name: userData.name,
            full_name: userData.name,
            phone: userData.phone,
            user_type: userData.user_type || 'user',
            verification_status: 'verified',
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw profileError;
        }

        console.log('Profile created successfully');

        toast({
          title: "Registrasi Berhasil!",
          description: "Akun Anda telah dibuat dan siap digunakan.",
          className: "bg-green-50 border-green-200"
        });

        return { needsVerification: false };
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
        // fetchUserProfile will be called automatically by the auth state change listener
        
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
      await supabase.auth.signOut();
      setUser(null);
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
