import { Redirect, Slot } from "expo-router"
import { useSessionContext } from "@/context/AuthContext";

export default function AppLayout() {
  const { session } = useSessionContext();
  return session ? <Slot /> : <Redirect href={'/login'} />
}