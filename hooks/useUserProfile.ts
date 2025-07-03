import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ProfileType } from "@/context/AuthContext";

export const useProfile = (authId: string | null) => {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!authId) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("auth_id", authId)
        .single();

      if (!error) {
        setProfile(data);
      } else {
        console.error("Profile Checking Error:", error.message);
      }

      setProfileLoading(false);
    };

    fetchProfile();
  }, [authId]);

  return { profile, profileLoading };
};
