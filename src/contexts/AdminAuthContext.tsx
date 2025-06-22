
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
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
      // Enhanced admin verification with additional security checks
      const { data, error } = await supabase
        .from('profiles')
        .select('user_type, verification_status, email')
        .eq('id', userId)
        .eq('user_type', 'admin')
        .eq('verification_status', 'verified')
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } else {
        // Updated security: verify admin email addresses
        const isValidAdminEmail = data?.email === 'temanly.admin@gmail.com' || 
                                 data?.email?.endsWith('@temanly.com');
        
        setIsAdmin(data?.user_type === 'admin' && isValidAdminEmail);
        
        if (!isValidAdminEmail && data?.user_type === 'admin') {
          console.warn('Invalid admin email detected');
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
      // Updated security: check if email is valid admin email
      const isValidAdminEmail = email === 'temanly.admin@gmail.com' || 
                               email.endsWith('@temanly.com');
      
      if (!isValidAdminEmail) {
        return { error: 'Invalid admin credentials' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      // Double-check admin status after successful login
      if (data.user) {
        await checkAdminStatus(data.user.id);
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setUser(null);
  };

  const setupAdmin = async () => {
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
