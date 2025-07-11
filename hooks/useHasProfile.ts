import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/context/AuthContext';

/**
 * Hook to check if the current authenticated user has a profile.
 * 
 * @returns hasProfile - boolean indicating if profile exists
 * @returns hasProfileLoading - loading state
 * @returns error - error message if any
 */

export const useHasProfile = () => {
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [hasProfileLoading, setHasProfileLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuthContext();

  useEffect(() => {
    const checkProfile = async () => {
      if (!session?.user?.id) return;

      setHasProfileLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('profiles')
        .select('auth_id')
        .eq('auth_id', session.user.id)
        .maybeSingle();

      if (error) {
        setError(error.message);
        setHasProfile(null);
      } else {
        setHasProfile(!!data);
        console.log("Profile check result:", data);
      }

      setHasProfileLoading(false);
    };

    checkProfile();
  }, [session?.user?.id]);

  return { hasProfile, hasProfileLoading, error };
};
