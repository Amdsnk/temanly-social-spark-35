
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
      console.log('🔍 AdminUserService: Starting comprehensive data fetch...');
      
      // Get all users from Supabase Auth using admin function
      const { data: authData, error: functionError } = await supabase.functions.invoke('admin-get-users', {
        body: {}
      });

      let authUsers: any[] = [];
      let profileUsers: any[] = [];

      // Try to get Auth users via function
      if (functionError || !authData?.success) {
        console.warn('⚠️ Admin function failed, falling back to profiles only:', functionError);
        console.log('Auth function response:', authData);
      } else {
        authUsers = authData.users || [];
        console.log('✅ Auth users fetched via function:', authUsers.length);
        console.log('🔍 Raw Auth users sample:', authUsers.slice(0, 2));
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
      console.log('🔍 Raw Profile users sample:', profileUsers.slice(0, 2));

      // Merge and deduplicate users
      const mergedUsers = this.mergeAuthAndProfileUsers(authUsers, profileUsers);
      
      console.log('✅ Total merged users:', mergedUsers.length);
      console.log('🔍 Sample merged users:', mergedUsers.slice(0, 2));
      
      return { users: mergedUsers, error: null };

    } catch (error: any) {
      console.error('❌ AdminUserService error:', error);
      return { users: [], error: error.message };
    }
  },

  mergeAuthAndProfileUsers(authUsers: any[], profileUsers: any[]): AdminUser[] {
    const userMap = new Map<string, AdminUser>();
    
    console.log('🔄 Starting merge process...');
    console.log('Auth users to merge:', authUsers.length);
    console.log('Profile users to merge:', profileUsers.length);

    // Add profile users first
    profileUsers.forEach(profile => {
      console.log('📝 Processing profile user:', {
        id: profile.id.slice(0, 8),
        email: profile.email,
        verification_status: profile.verification_status,
        user_type: profile.user_type
      });
      
      userMap.set(profile.id, {
        id: profile.id,
        email: profile.email || '',
        name: profile.name || profile.full_name || 'No name',
        full_name: profile.full_name,
        phone: profile.phone,
        user_type: profile.user_type || 'user',
        verification_status: profile.verification_status || 'pending',
        status: profile.status || 'active',
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        has_profile: true,
        auth_only: false
      });
    });

    // Add or merge auth users
    authUsers.forEach(authUser => {
      console.log('🔐 Processing auth user:', {
        id: authUser.id.slice(0, 8),
        email: authUser.email,
        user_metadata: authUser.user_metadata,
        email_confirmed_at: authUser.email_confirmed_at
      });
      
      const existingUser = userMap.get(authUser.id);
      
      if (existingUser) {
        // Update existing profile user with auth data
        console.log('🔄 Merging with existing profile user');
        existingUser.email = authUser.email || existingUser.email;
        existingUser.created_at = authUser.created_at || existingUser.created_at;
        existingUser.auth_only = false; // Has both auth and profile
      } else {
        // Add auth-only user
        console.log('➕ Adding auth-only user');
        const userType = authUser.user_metadata?.user_type || 'user';
        const verificationStatus = authUser.email_confirmed_at ? 'verified' : 'pending';
        
        console.log('Auth user metadata:', authUser.user_metadata);
        console.log('Determined user_type:', userType);
        console.log('Determined verification_status:', verificationStatus);
        
        userMap.set(authUser.id, {
          id: authUser.id,
          email: authUser.email || '',
          name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
          full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name,
          phone: authUser.user_metadata?.phone,
          user_type: userType as any,
          verification_status: verificationStatus as any,
          status: 'active',
          created_at: authUser.created_at,
          has_profile: false,
          auth_only: true
        });
      }
    });

    const finalUsers = Array.from(userMap.values()).sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    console.log('🎯 Final user breakdown:');
    const breakdown = finalUsers.reduce((acc: any, user) => {
      acc[user.verification_status] = (acc[user.verification_status] || 0) + 1;
      return acc;
    }, {});
    console.log('Status breakdown:', breakdown);
    
    return finalUsers;
  },

  async createMissingProfiles(authOnlyUsers: AdminUser[]): Promise<void> {
    if (authOnlyUsers.length === 0) return;

    console.log('🔧 Creating missing profiles for', authOnlyUsers.length, 'users');
    
    try {
      const profilesData = authOnlyUsers.map(user => {
        console.log('📝 Preparing profile data for user:', {
          id: user.id.slice(0, 8),
          email: user.email,
          user_type: user.user_type,
          verification_status: user.verification_status
        });
        
        return {
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
        };
      });

      console.log('🚀 Inserting profiles:', profilesData);

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
