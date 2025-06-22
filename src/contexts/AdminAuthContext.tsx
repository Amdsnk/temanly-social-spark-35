
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminAuthContextType {
  isAdmin: boolean;
  loading: boolean;
  signInWithPasscode: (passcode: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Admin credentials
const ADMIN_PASSCODE = "TEMANLY2024ADMIN";

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already logged in from localStorage
    const adminLoggedIn = localStorage.getItem('temanly_admin_logged_in');
    if (adminLoggedIn === 'true') {
      setIsAdmin(true);
    }
    setLoading(false);
  }, []);

  const signInWithPasscode = async (passcode: string) => {
    try {
      console.log('Attempting to sign in with passcode');
      
      if (passcode !== ADMIN_PASSCODE) {
        console.log('Invalid passcode');
        return { error: 'Invalid admin passcode' };
      }

      console.log('Passcode validated successfully');
      setIsAdmin(true);
      localStorage.setItem('temanly_admin_logged_in', 'true');
      
      return {};
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    console.log('Signing out');
    setIsAdmin(false);
    localStorage.removeItem('temanly_admin_logged_in');
  };

  const value = {
    isAdmin,
    loading,
    signInWithPasscode,
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
