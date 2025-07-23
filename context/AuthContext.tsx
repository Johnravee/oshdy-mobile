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
import { logError, logInfo, logSuccess } from "@/utils/logger";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [init, setInit] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      logInfo("🔑 AuthProvider → Initializing auth session...");

      const { data, error } = await supabase.auth.getSession();
      if (error) {
        logError("🔑 AuthProvider → Failed to get session", error.message);
        setInit(false);
        return;
      }

      const currentSession = data.session ?? null;
      setSession(currentSession);

      if (currentSession) {
        logSuccess("🔑 AuthProvider → Session restored", currentSession.user);
      } else {
        logInfo("🔑 AuthProvider → No existing session");
      }

      setInit(false);
    };

    initialize();

    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession ?? null);
      logInfo(`🔁 AuthProvider → Auth state changed: ${event}`);

      if (newSession) {
        logSuccess("✅ New session established", newSession.user);
      } else {
        logInfo("🚪 Session ended or signed out");
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
      logInfo("🧹 AuthProvider → Auth listener unsubscribed");
    };
  }, []);

  const logout = async () => {
    logInfo("🚪 Logging out...");
    await supabase.auth.signOut();
    setSession(null);
    logSuccess("✅ Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ session, init, logout }}>
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
