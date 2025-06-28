
import { supabase } from '@/integrations/supabase/client';

export interface UserData {
  id: string;
  email: string;
  name: string;
  phone: string;
  user_type: 'user' | 'companion' | 'admin';
  verification_status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  ktp_number?: string;
  ktp_image?: string;
  age?: number;
  city?: string;
  bio?: string;
  has_profile: boolean;
  auth_verified: boolean;
}

export interface TransactionData {
  id: string;
  user_id: string;
  companion_id: string;
  amount: number;
  status: string;
  created_at: string;
  service_type?: string;
  duration?: number;
}

export const newAdminService = {
  async getAllUsers(): Promise<{ users: UserData[], error: string | null }> {
    try {
      console.log('🔍 Fetching all users from Auth and Profiles...');

      // Get users from profiles table
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profileError) {
        console.error('❌ Profile fetch error:', profileError);
        throw profileError;
      }

      console.log('✅ Profiles fetched:', profiles?.length || 0);

      // Get Auth users via admin function
      let authUsers: any[] = [];
      try {
        const { data: authData, error: authError } = await supabase.functions.invoke('admin-get-users', {
          body: {}
        });

        if (authError) {
          console.warn('⚠️ Auth function error:', authError);
        } else if (authData?.success) {
          authUsers = authData.users || [];
          console.log('✅ Auth users fetched:', authUsers.length);
        }
      } catch (error) {
        console.warn('⚠️ Auth function failed:', error);
      }

      // Merge users from both sources
      const userMap = new Map<string, UserData>();

      // Add profile users
      profiles?.forEach(profile => {
        userMap.set(profile.id, {
          id: profile.id,
          email: profile.email || '',
          name: profile.name || profile.full_name || 'Unknown',
          phone: profile.phone || '',
          user_type: (profile.user_type as 'user' | 'companion' | 'admin') || 'user',
          verification_status: (profile.verification_status as 'pending' | 'verified' | 'rejected') || 'pending',
          created_at: profile.created_at,
          ktp_number: (profile as any).ktp_number,
          ktp_image: (profile as any).ktp_image,
          age: profile.age,
          city: profile.city,
          bio: profile.bio,
          has_profile: true,
          auth_verified: true
        });
      });

      // Add auth-only users
      authUsers.forEach(authUser => {
        if (!userMap.has(authUser.id)) {
          userMap.set(authUser.id, {
            id: authUser.id,
            email: authUser.email || '',
            name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Unknown',
            phone: authUser.user_metadata?.phone || '',
            user_type: (authUser.user_metadata?.user_type as 'user' | 'companion' | 'admin') || 'user',
            verification_status: 'pending',
            created_at: authUser.created_at,
            has_profile: false,
            auth_verified: !!authUser.email_confirmed_at
          });
        }
      });

      const users = Array.from(userMap.values());
      console.log('✅ Total users merged:', users.length);

      return { users, error: null };
    } catch (error: any) {
      console.error('❌ Error fetching users:', error);
      return { users: [], error: error.message };
    }
  },

  async getAllTransactions(): Promise<{ transactions: TransactionData[], error: string | null }> {
    try {
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select(`
          *,
          profiles!transactions_user_id_fkey(name, email),
          companion:profiles!transactions_companion_id_fkey(name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { 
        transactions: transactions || [], 
        error: null 
      };
    } catch (error: any) {
      console.error('❌ Error fetching transactions:', error);
      return { transactions: [], error: error.message };
    }
  },

  async approveUser(userId: string, userData: Partial<UserData>): Promise<{ success: boolean, error?: string }> {
    try {
      console.log('🔄 Approving user:', userId);

      // First, try to get existing profile to see what fields are available
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Prepare the upsert data with only the fields that exist in the database
      const upsertData: any = {
        id: userId,
        email: userData.email,
        name: userData.name,
        full_name: userData.name,
        phone: userData.phone,
        user_type: userData.user_type,
        status: 'active',
        city: userData.city,
        age: userData.age,
        bio: userData.bio,
        updated_at: new Date().toISOString()
      };

      // Add KTP fields if they exist in the schema
      if (userData.ktp_number) {
        upsertData.ktp_number = userData.ktp_number;
      }
      if (userData.ktp_image) {
        upsertData.ktp_image = userData.ktp_image;
      }

      // Update or create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(upsertData, { onConflict: 'id' });

      if (profileError) throw profileError;

      // Send approval notification
      try {
        await supabase.functions.invoke('send-approval-notification', {
          body: { userId, approved: true }
        });
      } catch (notificationError) {
        console.warn('⚠️ Failed to send notification:', notificationError);
      }

      console.log('✅ User approved successfully');
      return { success: true };
    } catch (error: any) {
      console.error('❌ Error approving user:', error);
      return { success: false, error: error.message };
    }
  },

  async rejectUser(userId: string, reason?: string): Promise<{ success: boolean, error?: string }> {
    try {
      console.log('🔄 Rejecting user:', userId);

      // Prepare the upsert data
      const upsertData: any = {
        id: userId,
        status: 'suspended',
        updated_at: new Date().toISOString()
      };

      // Add rejection reason if the field exists
      if (reason) {
        upsertData.rejection_reason = reason;
      }

      const { error } = await supabase
        .from('profiles')
        .upsert(upsertData, { onConflict: 'id' });

      if (error) throw error;

      // Send rejection notification
      try {
        await supabase.functions.invoke('send-approval-notification', {
          body: { userId, approved: false }
        });
      } catch (notificationError) {
        console.warn('⚠️ Failed to send notification:', notificationError);
      }

      console.log('✅ User rejected successfully');
      return { success: true };
    } catch (error: any) {
      console.error('❌ Error rejecting user:', error);
      return { success: false, error: error.message };
    }
  }
};
