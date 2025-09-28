// app/(ride)/onmyway.tsx
import React from "react";
import { View, Text, Pressable, Share } from "react-native";
import MapView from "react-native-maps";
import { Stack, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Linking from "expo-linking";
import { useRideStore } from "@/lib/rideStore"; // use "../../lib/rideStore" if not using @/

export default function OnMyWay() {
  const { ride, reset } = useRideStore();

  // TODO: wire these up to real routing/ETA later
  const timeLeftMin = 14;
  const distanceMi = 5.2;
  const pickupsCount = ride.pickups.length;

  const inviteFriends = async () => {
    if (!ride.id) return;
    const url = Linking.createURL("/join", {
      queryParams: { rideId: ride.id, dest: ride.destination ?? "" },
    });
    await Share.share({ message: `Join my ride: ${url}` });
  };

  const cancelTrip = () => {
    reset();
    router.replace("/"); // back to Where to? page
  };

  return (
    <View style={{ flex: 1 }}>
      {/* No header */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* Map */}
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 43.0731, // Madison placeholder
          longitude: -89.4012,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
      />

      {/* Top overlay: title + destination */}
      <SafeAreaView
        edges={["top"]}
        pointerEvents="box-none"
        style={{ position: "absolute", top: 0, left: 0, right: 0 }}
      >
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <Text style={{ fontSize: 24, fontWeight: "700" }}>On my way!</Text>
          <Text
            numberOfLines={1}
            style={{ marginTop: 4, fontSize: 14, opacity: 0.7 }}
          >
            {ride.destination ?? "No destination"}
          </Text>
        </View>
      </SafeAreaView>

      {/* Bottom overlay: stats + actions */}
      <SafeAreaView
        edges={["bottom"]}
        pointerEvents="box-none"
        style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}
      >
        <View style={{ padding: 16 }}>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              padding: 16,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
              elevation: 3,
              gap: 12,
            }}
          >
            {/* Stats row */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <View>
                <Text style={{ fontSize: 12, opacity: 0.6 }}>
                  Time · Distance
                </Text>
                <Text style={{ fontSize: 16, fontWeight: "600" }}>
                  {timeLeftMin} min · {distanceMi.toFixed(1)} mi
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={{ fontSize: 12, opacity: 0.6 }}>Pickups</Text>
                <Text style={{ fontSize: 16, fontWeight: "600" }}>
                  {pickupsCount}
                </Text>
              </View>
            </View>

            {/* Actions */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Pressable
                onPress={inviteFriends}
                style={({ pressed }) => ({
                  flex: 1,
                  backgroundColor: "#111827",
                  borderRadius: 10,
                  paddingVertical: 12,
                  alignItems: "center",
                  opacity: pressed ? 0.85 : 1,
                })}
              >
                <Text style={{ color: "white", fontWeight: "700" }}>Invite</Text>
              </Pressable>

              <Pressable
                onPress={cancelTrip}
                style={({ pressed }) => ({
                  flex: 1,
                  backgroundColor: "#ef4444",
                  borderRadius: 10,
                  paddingVertical: 12,
                  alignItems: "center",
                  opacity: pressed ? 0.85 : 1,
                })}
              >
                <Text style={{ color: "white", fontWeight: "700" }}>
                  Cancel trip
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
