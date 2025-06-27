
import { supabase } from '@/integrations/supabase/client';

export const createAdminUser = async (email: string, password: string, name: string) => {
  try {
    // Create admin user in auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true
    });

    if (authError) {
      console.error('Error creating admin auth:', authError);
      return { success: false, error: authError.message };
    }

    if (authData.user) {
      // Create admin profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: email,
          name: name,
          user_type: 'admin',
          verification_status: 'verified',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Error creating admin profile:', profileError);
        return { success: false, error: profileError.message };
      }

      console.log('Admin user created successfully');
      return { 
        success: true, 
        message: 'Admin user created successfully',
        userId: authData.user.id
      };
    }

    return { success: false, error: 'Failed to create admin user' };
  } catch (error) {
    console.error('Error in createAdminUser:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
};

export const checkAdminExists = async (email: string) => {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email, name')
      .eq('email', email)
      .eq('user_type', 'admin')
      .single();

    return { exists: !!profile, profile };
  } catch (error) {
    console.error('Error checking admin:', error);
    return { exists: false, profile: null };
  }
};
