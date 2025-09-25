import { View, Text, Pressable } from "react-native";
import { Link, useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 16 }}>
      <Text style={{ fontSize: 18 }}>James Crowe is here.</Text>

      {/* Link components (easy) */}
      <Link href="/create" style={{ textDecorationLine: "underline" }}>Create a ride →</Link>
      <Link href="/invite" style={{ textDecorationLine: "underline" }}>Invite friends →</Link>
      <Link href="/map" style={{ textDecorationLine: "underline" }}>Open map →</Link>

      {/* Or programmatic navigation */}
      <Pressable onPress={() => router.push("/create")} style={{ padding: 12 }}>
        <Text>Start a ride</Text>
      </Pressable>
    </View>
  );
}
