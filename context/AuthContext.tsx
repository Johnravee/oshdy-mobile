/**
 * @file AuthContext.tsx
 * @description Provides global authentication context using Supabase.
 * Manages session state and exposes `logout`, `session`, and `init` values.
 *
 * @context AuthContext - Holds auth state and methods for use across the app.
 * @provider AuthProvider - Wraps app components to supply auth context.
 * @hook useAuthContext - Custom hook to access authentication context.
 *
 * @note Automatically listens to auth state changes (login/logout).
 * @author John Rave Mimay
 * @created 2025-06-15
 */

import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType } from "@/types/auth-types";




const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [init, setInit] = useState(true);

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

      setInit(false);
    };

    initialize();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);

    
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);



  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{ session, init, logout }}
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
