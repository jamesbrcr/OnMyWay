// app/(ride)/join.tsx
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Button, Alert } from "react-native";
import { useRideStore } from "../../lib/rideStore";

export default function Join() {
  const params = useLocalSearchParams<{ rideId?: string; dest?: string }>();
  const { ride, addPickup } = useRideStore();
  const router = useRouter();

  const shareLocation = () => {
    // MVP: add a fake pickup (you’ll replace with real GPS later)
    addPickup({
      id: Math.random().toString(36).slice(2),
      name: "Friend",
      lat: 43.0731,
      lng: -89.4012, // Madison-ish
    });
    Alert.alert("Shared", "Your pickup location has been added.");
  };

  return (
    <View style={{ flex: 1, padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>Join Ride</Text>
      <Text>Ride ID: {params.rideId}</Text>
      <Text>Destination: {params.dest}</Text>

      <Button title="Share my location" onPress={shareLocation} />
      <Button title="Go to driver map" onPress={() => router.push("./map")} />
    </View>
  );
}
