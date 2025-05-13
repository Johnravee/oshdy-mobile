import { Redirect, Slot } from "expo-router"
import Login from "./login"
import { useAuthContext } from "@/context/AuthContext"
export default function Index() {
    const { session } = useAuthContext();
    return session ? <Redirect href={'/(app)/dashboard'} /> : <Login />
}