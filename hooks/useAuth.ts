
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { supabase } from "@/lib/supabase";
import { router, useRouter } from "expo-router";
import { useEffect } from "react";


WebBrowser.maybeCompleteAuthSession(); // required for web only
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

 console.log('User authenticated successfully!');
 
  
  if (error) throw error;
  return data.session;
};

export const performOAuth = async (provider : 'google') => {
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
    await createSessionFromUrl(url);
    router.replace('/(app)/userdetails')
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
    console.log('redirected to:', redirectTo);
  } catch (error) {
    console.error('Error sending magic link:', error);
    throw error; 
  }
};


export const useAuth = () => {
  const router = useRouter();
  const url = Linking.useURL();

  useEffect(() => {
    if (url?.includes('access_token')) {
      createSessionFromUrl(url)
        .then(() => {
          console.log("Redirecting to dashboard...");
          router.replace('/(app)/userdetails')
        })
        .catch(err => console.error('Auth error:', err));
    }
  }, [url]);

  console.log("Redirect URI used:", redirectTo);
  console.log("Captured deep link:", url);

  return {
    sendMagicLink,
    performOAuth
  };
};