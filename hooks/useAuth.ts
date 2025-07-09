import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { supabase } from "@/lib/supabase";
import { router, useRouter } from "expo-router";
import { useEffect } from "react";

WebBrowser.maybeCompleteAuthSession();

const redirectTo = makeRedirectUri({
  scheme: "myapp",
  path: "dashboard"
});

const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;

  if (!access_token) return;

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) throw error;

  return data.session;
};

export const performOAuth = async (provider: 'google') => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      skipBrowserRedirect: true,
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

    if (session?.user?.id) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("auth_id", session.user.id)
        .maybeSingle();

      if (profile) {
        router.replace("/(app)/dashboard");
      } else {
        router.replace("/(app)/userdetails");
      }
    }
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

    console.log("Magic link sent!");
    console.log("Redirected to:", redirectTo);
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
          if (session?.user?.id) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("auth_id", session.user.id)
              .maybeSingle();

            if (profile) {
              router.replace("/(app)/dashboard");
            } else {
              router.replace("/(app)/userdetails");
            }
          }
        })
        .catch((err) => console.error("Auth error:", err));
    }
  }, [url]);

  return {
    sendMagicLink,
    performOAuth,
  };
};
