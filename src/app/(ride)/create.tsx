// app/(ride)/create.tsx
import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { useRouter } from "expo-router";
import { useRideStore } from "../../lib/rideStore";

export default function CreateRide() {
  const [destination, setDestination] = useState("");
  const createRide = useRideStore((s) => s.createRide);
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>Set your destination</Text>
      <TextInput
        placeholder="e.g., Fiserv Forum, 1111 Vel R. Phillips Ave"
        value={destination}
        onChangeText={setDestination}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 12,
        }}
      />
      <Button
        title="Create ride"
        disabled={!destination.trim()}
        onPress={() => {
          createRide(destination.trim());
          router.push("./invite");
        }}
      />
    </View>
  );
}
