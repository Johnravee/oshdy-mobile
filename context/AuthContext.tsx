import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";

// Types
export type ProfileType = {
  auth_id: string;
  email: string;
  name: string;
  contact_number?: string;
  address?: string;
  id: number;
};

export type PGMDataType = {
  packages: any[];
  grazing: any[];
  menu: any[];
};

interface AuthContextType {
  session: Session | null;
  init: boolean;
  logout: () => Promise<void>;
  profile: ProfileType | null;
  setProfile: React.Dispatch<React.SetStateAction<ProfileType | null>>;
  pgmData: PGMDataType;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [init, setInit] = useState(true);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [pgmData, setPGMData] = useState<PGMDataType>({ packages: [], grazing: [], menu: [] });

  useEffect(() => {
    const initialize = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session Error:", error.message);
        setInit(false);
        return;
      }

      const currentSession = data.session ?? null;
      setSession(currentSession);

      if (currentSession?.user) {
        await fetchProfile(currentSession.user.id);
      }

      await fetchPGMData();
      setInit(false);
    };

    initialize();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);

      if (newSession?.user) {
        fetchProfile(newSession.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (authId: string) => {
    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_id", authId)
      .single();

    if (error) {
      console.error("Profile Error:", error.message);
    } else {
      setProfile(profileData);
      console.log("✅ Profile Data Loaded:", profileData);
    }
  };

  const fetchPGMData = async () => {
    const { data, error } = await supabase.rpc("get_pgm_data");
    if (error) {
      console.error("PGM Data Error:", error.message);
    } else {
      setPGMData({
        packages: data?.packages || [],
        grazing: data?.grazing || [],
        menu: data?.menu || [],
      });
      
      
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{ session, init, logout, profile, setProfile, pgmData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
