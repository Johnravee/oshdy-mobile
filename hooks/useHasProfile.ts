import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/context/AuthContext';
import { logInfo, logSuccess, logError } from '@/utils/logger';

/**
 * Hook to check if the current authenticated user has a profile.
 * 
 * @returns hasProfile - boolean indicating if profile exists
 * @returns hasProfileLoading - loading state
 */

export const useHasProfile = () => {
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [hasProfileLoading, setHasProfileLoading] = useState<boolean>(false);
  const { session } = useAuthContext();

  useEffect(() => {
    const checkProfile = async () => {
      if (!session?.user?.id) {
        logInfo('👤 No session user ID. Skipping profile check.');
        return;
      }

      setHasProfileLoading(true);
      logInfo(`🔎 Checking if profile exists for user: ${session.user.id}`);

      const { data, error } = await supabase
        .from('profiles')
        .select('auth_id')
        .eq('auth_id', session.user.id)
        .maybeSingle();

      if (error) {
        logError('❌ Failed to check profile:', error.message);
        setHasProfile(null);
      } else {
        setHasProfile(!!data);
        logSuccess(`✅ Profile ${data ? 'found' : 'not found'} for user: ${session.user.id}`);
      }

      setHasProfileLoading(false);
    };

    checkProfile();
  }, [session?.user?.id]);

  return { hasProfile, hasProfileLoading };
};
