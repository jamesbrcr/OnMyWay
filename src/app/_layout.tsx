import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="(ride)/create" options={{ title: "Create Ride" }} />
      <Stack.Screen name="(ride)/invite" options={{ title: "Invite Friends" }} />
      <Stack.Screen name="(ride)/map" options={{ title: "Ride Map" }} />
      <Stack.Screen name="(ride)/join" options={{ title: "Join Ride" }} />
    </Stack>
  );
}
