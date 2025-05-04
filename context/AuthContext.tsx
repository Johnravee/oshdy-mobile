import { supabase } from "@/lib/supabase"; // Make sure this path is correct
import { Session } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";

// Define the context type
type AuthContextType = {
  session: Session | null;
  loading: boolean;
  logout: () => Promise<void>;
};

// Create the context with an initial value of undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session when the app loads
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session", error);
      }
      setSession(session ?? null);
      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null);
    });

    // Cleanup listener on unmount
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
    <AuthContext.Provider value={{ session, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useSessionContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 