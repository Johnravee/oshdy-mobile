// File: lib/api/auth.ts
import { supabase } from '@/lib/supabase';

export const insertUserToProfiles = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.error('Error fetching user:', error);
    return;
  }

  const { id, email, user_metadata } = user;

  // Check if the user already exists in the profiles table
  const { data: existingProfiles, error: fetchError } = await supabase
    .from('profiles')
    .select('auth_id')
    .eq('auth_id', id)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows found
    console.error('Error checking existing profile:', fetchError.message);
    return;
  }

  if (existingProfiles) {
    console.log('User already exists in profiles, skipping insert.');
    return;
  }

  // Insert only if user does not exist
  const { error: insertError } = await supabase.from('profiles').insert([
    {
      auth_id: id,
      email: email,
      name: user_metadata?.name || '',
    },
  ]);

  if (insertError) {
    console.error('Insert error:', insertError.message);
  } else {
    console.log('User inserted successfully');
  }
};
