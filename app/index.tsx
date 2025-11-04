import { Redirect } from "expo-router";
import Login from "./login";
import { useAuthContext } from "@/context/AuthContext";
import { useProfileContext } from "@/context/ProfileContext";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
    const { session, init } = useAuthContext();
    const { profile, profileLoading } = useProfileContext();

    // Wait until both auth and profile are settled to avoid routing flicker
    if (init || profileLoading) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator />
            </View>
        );
    }

    if (!session) return <Login />;

    const profileComplete = Boolean(profile?.name && profile?.contact_number && profile?.address);
    return profileComplete ? (
        <Redirect href={'/(app)/(tabs)/dashboard'} />
    ) : (
        <Redirect href={'/(app)/onboarding'} />
    );
}