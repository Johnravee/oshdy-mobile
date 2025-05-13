import { Redirect, Slot } from "expo-router"
import { useAuthContext } from "@/context/AuthContext";

export default function AppLayout() {
  const { session} = useAuthContext();
  return session ? <Slot /> : <Redirect href={'/login'} />
}