import { Redirect, Slot } from "expo-router"
import Login from "./login"
import { useSessionContext } from "@/context/AuthContext"
export default function Index() {
    const { session } = useSessionContext();
    return session ? <Redirect href={'/(app)/dashboard'} /> : <Login />
}