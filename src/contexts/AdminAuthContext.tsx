
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminAuthContextType {
  isAdmin: boolean;
  loading: boolean;
  signInWithCredentials: (username: string, email: string, passcode: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Check if user is admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .eq('user_type', 'admin')
          .single();

        if (profile) {
          setIsAdmin(true);
        }
      }
    } catch (error) {
      console.error('Error checking admin auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithCredentials = async (username: string, email: string, passcode: string) => {
    try {
      console.log('Attempting admin sign in');
      
      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: passcode,
      });

      if (authError) {
        console.log('Auth error:', authError.message);
        return { error: authError.message };
      }

      if (authData.user) {
        // Verify user is admin
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('user_type, name')
          .eq('id', authData.user.id)
          .eq('user_type', 'admin')
          .single();

        if (profileError || !profile) {
          await supabase.auth.signOut();
          return { error: 'Access denied. Admin privileges required.' };
        }

        console.log('Admin authenticated successfully');
        setIsAdmin(true);
        return {};
      }

      return { error: 'Authentication failed' };
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    console.log('Admin signing out');
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  const value = {
    isAdmin,
    loading,
    signInWithCredentials,
    signOut,
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
