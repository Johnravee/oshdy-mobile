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


// Create context
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Provider component
export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuthContext();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user.id) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("auth_id", session.user.id)
          .single();

        if (error) throw error;

        setProfile(data as ProfileType);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session?.user.id]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, loading, error }}>
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
