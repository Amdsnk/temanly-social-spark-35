
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
  // Additional profile fields
  age?: number | null;
  location?: string | null;
  bio?: string | null;
  hourly_rate?: number | null;
  profile_data?: string | null;
  // Additional fields for comprehensive user management
  rating?: number | null;
  total_bookings?: number;
  total_earnings?: number;
  raw_user_meta_data?: any;
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
        console.warn('⚠️ Admin function failed:', {
          functionError: functionError?.message,
          authDataSuccess: authData?.success,
          authDataError: authData?.error
        });
        console.log('🔍 Full auth function response:', authData);
      } else {
        authUsers = authData.users || [];
        console.log('✅ Auth users fetched via function:', authUsers.length);
        
        // Enhanced logging of Auth users
        authUsers.forEach((user, index) => {
          console.log(`🔐 Auth User ${index + 1}:`, {
            id: user.id.slice(0, 8) + '...',
            email: user.email,
            email_confirmed: !!user.email_confirmed_at,
            user_metadata: user.user_metadata,
            created_at: user.created_at
          });
        });
      }

      // Always get profiles data
      console.log('📊 Fetching profiles data...');
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
      
      // Enhanced logging of Profile users
      profileUsers.forEach((user, index) => {
        console.log(`👤 Profile User ${index + 1}:`, {
          id: user.id.slice(0, 8) + '...',
          email: user.email,
          user_type: user.user_type,
          verification_status: user.verification_status,
          status: user.status,
          age: user.age,
          location: user.location,
          hourly_rate: user.hourly_rate,
          profile_data: user.profile_data ? 'Has data' : 'No data',
          created_at: user.created_at
        });
      });

      // Merge and deduplicate users
      const mergedUsers = this.mergeAuthAndProfileUsers(authUsers, profileUsers);
      
      console.log('🎯 Final merged results:');
      console.log('Total merged users:', mergedUsers.length);
      
      // Status breakdown
      const statusBreakdown = mergedUsers.reduce((acc: any, user) => {
        acc[user.verification_status] = (acc[user.verification_status] || 0) + 1;
        return acc;
      }, {});
      console.log('📊 Verification status breakdown:', statusBreakdown);
      
      // Type breakdown
      const typeBreakdown = mergedUsers.reduce((acc: any, user) => {
        acc[user.user_type] = (acc[user.user_type] || 0) + 1;
        return acc;
      }, {});
      console.log('📊 User type breakdown:', typeBreakdown);
      
      // Auth vs Profile breakdown
      const sourceBreakdown = mergedUsers.reduce((acc: any, user) => {
        if (user.auth_only) acc.authOnly++;
        else if (user.has_profile) acc.hasProfile++;
        return acc;
      }, { authOnly: 0, hasProfile: 0 });
      console.log('📊 Source breakdown:', sourceBreakdown);
      
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
    profileUsers.forEach((profile, index) => {
      console.log(`📝 Processing profile user ${index + 1}:`, {
        id: profile.id.slice(0, 8) + '...',
        email: profile.email,
        verification_status: profile.verification_status,
        user_type: profile.user_type,
        status: profile.status,
        age: profile.age,
        location: profile.location,
        hourly_rate: profile.hourly_rate,
        has_profile_data: !!profile.profile_data
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
        auth_only: false,
        // Include additional profile fields
        age: profile.age,
        location: profile.location,
        bio: profile.bio,
        hourly_rate: profile.hourly_rate,
        profile_data: profile.profile_data
      });
    });

    // Add or merge auth users
    authUsers.forEach((authUser, index) => {
      console.log(`🔐 Processing auth user ${index + 1}:`, {
        id: authUser.id.slice(0, 8) + '...',
        email: authUser.email,
        email_confirmed: !!authUser.email_confirmed_at,
        user_metadata: authUser.user_metadata
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
        
        // Determine user type from metadata or default to user
        const userType = authUser.user_metadata?.user_type || 'user';
        
        // Determine verification status based on email confirmation
        // For new auth-only users, they should be pending by default
        const verificationStatus = 'pending'; // Default to pending for approval workflow
        
        console.log('🔍 Auth user metadata analysis:', {
          user_metadata: authUser.user_metadata,
          app_metadata: authUser.app_metadata,
          email_confirmed_at: authUser.email_confirmed_at,
          determined_user_type: userType,
          determined_verification_status: verificationStatus
        });
        
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
          auth_only: true,
          // Auth-only users don't have these fields yet
          age: null,
          location: null,
          bio: null,
          hourly_rate: null,
          profile_data: null
        });
      }
    });

    const finalUsers = Array.from(userMap.values()).sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    console.log('🎯 Final user breakdown by verification status:');
    const finalBreakdown = finalUsers.reduce((acc: any, user) => {
      acc[user.verification_status] = (acc[user.verification_status] || 0) + 1;
      return acc;
    }, {});
    console.log('Final status breakdown:', finalBreakdown);
    
    console.log('🎯 Final users summary:');
    finalUsers.forEach((user, index) => {
      if (index < 5) { // Show first 5 users
        console.log(`Final User ${index + 1}:`, {
          id: user.id.slice(0, 8) + '...',
          email: user.email,
          user_type: user.user_type,
          verification_status: user.verification_status,
          auth_only: user.auth_only,
          has_profile: user.has_profile,
          has_profile_data: !!user.profile_data
        });
      }
    });
    
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
