
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
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        verified: data.verification_status === 'verified',
        user_type: data.user_type,
        verification_status: data.verification_status
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupData): Promise<{ needsVerification: boolean }> => {
    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            user_type: userData.user_type || 'user',
            verification_status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (profileError) throw profileError;

        toast({
          title: "Registrasi Berhasil!",
          description: "Akun Anda telah dibuat. Menunggu verifikasi dari admin.",
        });

        return { needsVerification: true };
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await fetchUserProfile(data.user.id);
        
        toast({
          title: "Login berhasil!",
          description: "Selamat datang kembali di Temanly.",
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
