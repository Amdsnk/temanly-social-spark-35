
import { supabase } from '@/integrations/supabase/client';

export const setupDefaultAdmin = async () => {
  const defaultAdminEmail = 'admin@temanly.com';
  const defaultAdminPassword = 'TemanlyAdmin2024!';

  try {
    // Check if admin already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', defaultAdminEmail)
      .eq('user_type', 'admin')
      .single();

    if (existingProfile) {
      console.log('Default admin already exists');
      return { success: true, message: 'Default admin already exists' };
    }

    // Create admin user in auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: defaultAdminEmail,
      password: defaultAdminPassword,
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
          email: defaultAdminEmail,
          name: 'Super Admin',
          user_type: 'admin',
          verification_status: 'verified',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Error creating admin profile:', profileError);
        return { success: false, error: profileError.message };
      }

      console.log('Default admin created successfully');
      return { 
        success: true, 
        message: 'Default admin created',
        credentials: {
          email: defaultAdminEmail,
          password: defaultAdminPassword
        }
      };
    }

    return { success: false, error: 'Failed to create admin user' };
  } catch (error) {
    console.error('Error in setupDefaultAdmin:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
};
