
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { setupDefaultAdmin } from '@/utils/adminSetup';

interface AdminAuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  setupAdmin: () => Promise<{ success: boolean; message?: string; credentials?: any; error?: string }>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', session?.user?.email);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('Checking admin status for user:', userId);
      
      // Get user profile from database
      const { data, error } = await supabase
        .from('profiles')
        .select('user_type, verification_status, email')
        .eq('id', userId)
        .single();

      console.log('Profile data:', data);
      console.log('Profile error:', error);

      if (error) {
        console.error('Error checking admin status:', error);
        // If profile doesn't exist, try to get email from auth user
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email === 'temanly.admin@gmail.com') {
          console.log('Default admin email detected, allowing access');
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        // Check if user is admin with valid email
        const isValidAdminEmail = data?.email === 'temanly.admin@gmail.com' || 
                                 data?.email?.endsWith('@temanly.com');
        
        const isVerifiedAdmin = data?.user_type === 'admin' && 
                               data?.verification_status === 'verified' && 
                               isValidAdminEmail;
        
        console.log('Is valid admin email:', isValidAdminEmail);
        console.log('Is verified admin:', isVerifiedAdmin);
        
        setIsAdmin(isVerifiedAdmin);
        
        if (!isValidAdminEmail && data?.user_type === 'admin') {
          console.warn('Invalid admin email detected:', data?.email);
        }
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with email:', email);
      
      // Simplified email validation - allow the default admin email
      if (email !== 'temanly.admin@gmail.com' && !email.endsWith('@temanly.com')) {
        console.log('Invalid admin email format');
        return { error: 'Invalid admin credentials' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Sign in response:', { data: data?.user?.email, error });

      if (error) {
        console.error('Sign in error:', error);
        return { error: error.message };
      }

      // Admin status will be checked automatically by the auth state change listener
      return {};
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    console.log('Signing out');
    await supabase.auth.signOut();
    setIsAdmin(false);
    setUser(null);
  };

  const setupAdmin = async () => {
    console.log('Setting up default admin');
    return await setupDefaultAdmin();
  };

  const value = {
    user,
    isAdmin,
    loading,
    signIn,
    signOut,
    setupAdmin,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
