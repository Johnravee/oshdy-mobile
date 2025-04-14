import { Stack } from 'expo-router';
import '../global.css'; // Make sure this path is correct

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="(onboarding)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(auth)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(dashboard)"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
