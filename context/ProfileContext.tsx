/**
 * @file ProfileContext.tsx
 * @description
 * Provides the Profile context for managing and accessing the authenticated user's profile data
 * throughout the React Native app. It fetches the profile based on the authenticated session
 * and exposes `profile`, `loading`, `error`, and `setProfile` through context.
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ProfileType, ProfileContextType } from "@/types/profile-types";
import { useAuthContext } from "./AuthContext";
import { logError, logInfo, logSuccess } from "@/utils/logger";

// Create context
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Provider component
export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const { session } = useAuthContext();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user.id) {
        setProfile(null);
        setProfileLoading(false);
        logInfo("👤 fetchProfile → No session found");
        return;
      }

      setProfileLoading(true);
      logInfo("👤 fetchProfile → Fetching profile for auth_id:", session.user.id);

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("auth_id", session.user.id)
          .maybeSingle();

        if (error) {
            setProfile(null);
            logInfo("👤 fetchProfile → No profile found for auth_id:", session.user.id);
        } else {
          setProfile(data as ProfileType);
          logSuccess("👤 fetchProfile → Profile fetched", data);
        }
      } catch (err) {
        logError("👤 fetchProfile → Unexpected error", err);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [session?.user.id]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, profileLoading }}>
      {children}
    </ProfileContext.Provider>
  );
};

// Hook to consume the context
export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfileContext must be used within a ProfileProvider");
  }
  return context;
};
