
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";


WebBrowser.maybeCompleteAuthSession(); // required for web only
const redirectTo = makeRedirectUri({
  scheme : 'oshdy.catering'
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

export const performOAuth = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
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


export  const useAuth  = () => {
  const router = useRouter()
  // Handle linking into app from email app.

  // This is for the development
  const url = Linking.useURL();
  if (url?.includes('access_token')){
    createSessionFromUrl(url).then(()=>{
      router.replace('/(dashboard)/dashboard')
    })
  }

  console.log("Url redirection path :", redirectTo);
  console.log('Captured path :', url);
  
  
  return {
    sendMagicLink,
    performOAuth
  }
}