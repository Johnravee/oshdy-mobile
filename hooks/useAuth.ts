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
import { logError, logInfo, logSuccess } from "@/utils/logger";

WebBrowser.maybeCompleteAuthSession();

const redirectTo = makeRedirectUri({ scheme: "myapp" });

const createSessionFromUrl = async (url: string) => {
  logInfo("🔁 Parsing redirect URL to extract tokens...");

  const { params, errorCode } = QueryParams.getQueryParams(url);
  if (errorCode) throw new Error(errorCode);

  const { access_token, refresh_token } = params;
  if (!access_token || !refresh_token) {
    logError("❌ Missing tokens from redirect URL", null);
    return null;
  }

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) {
    logError("❌ Failed to set session from tokens", error.message);
    throw error;
  }

  logSuccess("✅ Session successfully created from redirect URL");
  return data.session;
};

export const performOAuth = async (provider: 'google' | 'twitter' | 'notion') => {
  try {
    logInfo(`🌐 Starting OAuth flow with provider: ${provider}`);

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
      logSuccess("🔁 OAuth session completed, processing callback URL");
      await createSessionFromUrl(res.url);
    } else {
      logInfo("⚠️ OAuth session cancelled or dismissed");
    }
  } catch (error) {
    logError("❌ OAuth flow failed", error);
    throw error;
  }
};

export const sendMagicLink = async (email: string) => {
  try {
    logInfo(`📧 Sending magic link to: ${email}`);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) throw error;

    logSuccess("✅ Magic link sent successfully");
  } catch (error) {
    logError("❌ Error sending magic link", error);
    throw error;
  }
};

export const useAuth = () => {
  const router = useRouter();
  const url = Linking.useURL();

  useEffect(() => {
    if (url?.includes("access_token")) {
      logInfo("🔁 Detected deep link with auth tokens. Creating session...");

      createSessionFromUrl(url)
        .then(async (session) => {
          if (!session) {
            logError("❌ No session could be created from URL", null);
            return;
          }

          const auth_id = session.user.id;
          logInfo(`👤 Checking profile for auth_id: ${auth_id}`);

          const { data: profile, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("auth_id", auth_id)
            .single();

          if (error || !profile) {
            logInfo("👤 Profile not found → Redirecting to onboarding");
            router.replace("/(app)/onboarding");
          } else {
            logSuccess("👤 Profile found → Redirecting to dashboard");
            router.replace("/(app)/dashboard");
          }
        })
        .catch((err) => {
          logError("❌ Error during deep link session creation", err.message);
        });
    }
  }, [url]);

  return {
    sendMagicLink,
    performOAuth,
  };
};
