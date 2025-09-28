// app/index.tsx
import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { View, TextInput, Platform } from "react-native";
import MapView from "react-native-maps";
import { Stack, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRideStore } from "@/lib/rideStore"; // or "../../lib/rideStore" if not using @/


export default function WhereTo() {
  const [destination, setDestination] = useState("");
  const createRide = useRideStore((s) => s.createRide);

  const onStart = async () => {
    const dest = destination.trim();
    if (!dest) return;
  
    const rideId = createRide(dest); // now returns id
  
    // Persist to DB (idempotent)
    const { error } = await supabase.from("rides").upsert({ id: rideId, destination: dest });
    if (error) {
      console.warn("Failed to save ride:", error.message);
      // optional: show a toast, and/or revert local state
      return;
    }
  
    router.push("/onmyway");
  };

  return (
    <View style={{ flex: 1 }}>
      {/* No header on this screen */}
      <Stack.Screen options={{ headerShown: false }} />

      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 43.0731,    // Madison placeholder
          longitude: -89.4012,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
      />

      {/* Top overlay search bar (safe area) */}
      <SafeAreaView
        edges={["top"]}
        pointerEvents="box-none"
        style={{ position: "absolute", top: 0, left: 0, right: 0 }}
      >
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <TextInput
            placeholder="Where to?"
            placeholderTextColor="#6B7280"
            value={destination}
            onChangeText={setDestination}
            returnKeyType="go"
            onSubmitEditing={onStart}
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing" // iOS convenience
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: Platform.OS === "ios" ? 12 : 10,
              borderWidth: 1,
              borderColor: "#e5e7eb",
              fontSize: 18,
              
              // subtle shadow
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 2,
            }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

