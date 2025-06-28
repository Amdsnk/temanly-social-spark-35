
import { supabase } from '@/integrations/supabase/client';

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  full_name: string | null;
  phone: string | null;
  user_type: 'user' | 'companion' | 'admin';
  verification_status: 'pending' | 'verified' | 'rejected';
  status: string;
  created_at: string;
  updated_at?: string;
  has_profile: boolean;
  auth_only: boolean;
}

export const adminUserService = {
  async getAllUsers(): Promise<{ users: AdminUser[], error: string | null }> {
    try {
      console.log('🔍 AdminUserService: Fetching all users from Auth and Profiles...');
      
      // Get all users from Supabase Auth using admin function
      const { data: authData, error: functionError } = await supabase.functions.invoke('admin-get-users', {
        body: {}
      });

      let authUsers: any[] = [];
      let profileUsers: any[] = [];

      // Try to get Auth users via function, fallback to profiles only if it fails
      if (functionError || !authData?.success) {
        console.warn('⚠️ Admin function failed, falling back to profiles only:', functionError);
      } else {
        authUsers = authData.users || [];
        console.log('✅ Auth users fetched via function:', authUsers.length);
      }

      // Always get profiles data
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profileError) {
        console.error('❌ Error fetching profiles:', profileError);
        throw profileError;
      }

      profileUsers = profiles || [];
      console.log('✅ Profile users fetched:', profileUsers.length);

      // Merge and deduplicate users
      const mergedUsers = this.mergeAuthAndProfileUsers(authUsers, profileUsers);
      
      console.log('✅ Total merged users:', mergedUsers.length);
      return { users: mergedUsers, error: null };

    } catch (error: any) {
      console.error('❌ AdminUserService error:', error);
      return { users: [], error: error.message };
    }
  },

  mergeAuthAndProfileUsers(authUsers: any[], profileUsers: any[]): AdminUser[] {
    const userMap = new Map<string, AdminUser>();

    // Add profile users first
    profileUsers.forEach(profile => {
      userMap.set(profile.id, {
        id: profile.id,
        email: profile.email || '',
        name: profile.name || profile.full_name || 'No name',
        full_name: profile.full_name,
        phone: profile.phone,
        user_type: profile.user_type || 'user',
        verification_status: profile.verification_status || 'verified',
        status: profile.status || 'active',
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        has_profile: true,
        auth_only: false
      });
    });

    // Add or merge auth users
    authUsers.forEach(authUser => {
      const existingUser = userMap.get(authUser.id);
      
      if (existingUser) {
        // Update existing profile user with auth data
        existingUser.email = authUser.email || existingUser.email;
        existingUser.created_at = authUser.created_at || existingUser.created_at;
      } else {
        // Add auth-only user
        userMap.set(authUser.id, {
          id: authUser.id,
          email: authUser.email || '',
          name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
          full_name: authUser.user_metadata?.full_name,
          phone: authUser.user_metadata?.phone,
          user_type: (authUser.user_metadata?.user_type as any) || 'user',
          verification_status: authUser.email_confirmed_at ? 'verified' : 'pending',
          status: 'active',
          created_at: authUser.created_at,
          has_profile: false,
          auth_only: true
        });
      }
    });

    return Array.from(userMap.values()).sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  async createMissingProfiles(authOnlyUsers: AdminUser[]): Promise<void> {
    if (authOnlyUsers.length === 0) return;

    console.log('🔧 Creating missing profiles for', authOnlyUsers.length, 'users');
    
    try {
      const profilesData = authOnlyUsers.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name || user.email?.split('@')[0] || 'User',
        full_name: user.full_name || user.name,
        phone: user.phone,
        user_type: user.user_type,
        verification_status: user.verification_status,
        status: user.verification_status === 'verified' ? 'active' as const : 'pending' as const,
        created_at: user.created_at,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('profiles')
        .upsert(profilesData, { onConflict: 'id' });

      if (error) {
        console.error('❌ Error creating missing profiles:', error);
        throw error;
      }

      console.log('✅ Successfully created missing profiles');
    } catch (error) {
      console.error('❌ Failed to create missing profiles:', error);
      throw error;
    }
  }
};
