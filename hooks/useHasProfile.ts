/**
 * @file useHasProfile.ts
 * @description
 * Custom hook to determine if the current authenticated user has an existing profile.
 *
 * @returns {{
 *   hasProfile: boolean | null,
 *   hasProfileLoading: boolean
 * }}
 */

import { useEffect, useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { checkHasProfile } from '@/lib/api/checkHasProfile';
import { logInfo, logSuccess } from '@/utils/logger';

export const useHasProfile = () => {
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [hasProfileLoading, setHasProfileLoading] = useState<boolean>(false);
  const { session } = useAuthContext();

  useEffect(() => {
    const check = async () => {
      const userId = session?.user?.id;

      if (!userId) {
        logInfo('👤 No session user ID. Skipping profile check.');
        return;
      }

      setHasProfileLoading(true);
      logInfo(`🔎 Checking if profile exists for user: ${userId}`);

      const exists = await checkHasProfile(userId);
      setHasProfile(exists);

      logSuccess(`✅ Profile ${exists ? 'found' : 'not found'} for user: ${userId}`);
      setHasProfileLoading(false);
    };

    check();
  }, [session?.user?.id]);

  return { hasProfile, hasProfileLoading };
};
