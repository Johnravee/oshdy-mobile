/**
 * @file auth.ts
 * Handles Supabase auth in Expo: Google OAuth, magic link login, and session from deep link.
 *
 * @exports performOAuth - Start Google login.
 * @exports sendMagicLink - Send login email.
 * @exports useAuth - Hook to handle redirect and set session, then check if profile exists.
 *
 * @created 2025-06-15
 */

import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { useEffect } from "react";

WebBrowser.maybeCompleteAuthSession();

const redirectTo = makeRedirectUri({
  scheme: "myapp",
});

const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;

  if (!access_token || !refresh_token) return null;

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) throw error;

  return data.session;
};

export const performOAuth = async (provider: 'google' | 'twitter' | 'notion') => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      skipBrowserRedirect: false,
    },
  });

  if (error) throw error;

  const res = await WebBrowser.openAuthSessionAsync(
    data?.url ?? "",
    redirectTo
  );

  if (res.type === "success") {
    const { url } = res;
    const session = await createSessionFromUrl(url);
    // Optional: you can navigate here too, but we handle it in useAuth
  }
};

export const sendMagicLink = async (email: string) => {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) throw error;
    console.log("Magic link sent!");
  } catch (error) {
    console.error("Error sending magic link:", error);
    throw error;
  }
};

export const useAuth = () => {
  const router = useRouter();
  const url = Linking.useURL();

  useEffect(() => {
    if (url?.includes("access_token")) {
      createSessionFromUrl(url)
        .then(async (session) => {
          if (!session) {
            console.error("No session created from URL");
            return;
          }

          const auth_id = session.user.id;

          // ✅ Check if user profile exists
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("auth_id", auth_id)
            .single();

          if (error || !profile) {
            console.warn("Profile not found. Redirecting to profile setup...");
            router.replace("/(app)/onboarding");
          } else {
            router.replace("/(app)/dashboard");
          }
        })
        .catch((err) => {
          console.error("Auth error:", err);
        });
    }
  }, [url]);

  return {
    sendMagicLink,
    performOAuth,
  };
};
