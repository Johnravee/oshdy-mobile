import { supabase } from "@/lib/supabase"; // Make sure this path is correct
import { Session } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";

// Define the context type
type AuthContextType = {
  session: Session | null;
  loading: boolean;
  logout: () => Promise<void>;
  profile: ProfileType | null;
  setProfile: React.Dispatch<React.SetStateAction<ProfileType | null>>;
};

type ProfileType = {
  auth_id: string;
  email: string;
  name: string;
  contact_number?: string;
  address?: string;
};

// Create the context with an initial value of undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileType | null>(null);

  useEffect(() => {
    const getSessionAndProfile = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error fetching session", sessionError);
        setLoading(false);
        return;
      }

      setSession(session ?? null);

      if (session?.user) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("auth_id", session.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile", profileError.message);
        } else {
          console.log( "profile data", profileData);
          setProfile(profileData);
        }
      }

      setLoading(false);
    };

    getSessionAndProfile();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);


  // Logout function
  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null); // Reset session after logout
  };

  // Return the context provider with session, loading, and logout values
  return (
    <AuthContext.Provider value={{ session, loading, logout, profile, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 