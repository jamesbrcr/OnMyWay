// app/(ride)/join.tsx
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, Alert, Share } from "react-native";
import MapView from "react-native-maps";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Linking from "expo-linking";
import * as Location from "expo-location";
import { useRideStore } from "@/lib/rideStore"; // or "../../lib/rideStore"

export default function JoinRide() {
  const params = useLocalSearchParams<{ rideId?: string; dest?: string }>();
  const { ride, attachRide, addPickup, removePickup, reset } = useRideStore();
  const [joined, setJoined] = useState(false);
  const myPickupIdRef = useRef<string | null>(null);

  // Attach to the ride from the link
  useEffect(() => {
    const rid = String(params.rideId || "");
    const dest = String(params.dest || "");
    if (!rid || !dest) return;
    if (ride.id !== rid) attachRide(rid, dest);
  }, [params.rideId, params.dest]);

  // Join: request location and add a pickup once
  useEffect(() => {
    const join = async () => {
      if (!ride.id || joined) return;
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "Location permission is required to join this ride.");
        return;
      }
      const pos = await Location.getCurrentPositionAsync({});
      const newId = Math.random().toString(36).slice(2);
      myPickupIdRef.current = newId;
      addPickup({
        id: newId,
        name: "Guest",
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
      setJoined(true);
    };
    join();
  }, [ride.id, joined]);

  const inviteFriends = async () => {
    if (!ride.id) return;
    const url = Linking.createURL("/join", {
      queryParams: { rideId: ride.id, dest: ride.destination ?? "" },
    });
    await Share.share({ message: `Join my ride: ${url}` });
  };

  const leaveRide = () => {
    const myId = myPickupIdRef.current;
    if (myId) removePickup(myId);
    reset(); // clear local ride state on this device
    router.replace("/"); // back to Where-to page
  };

  const pickupsCount = ride.pickups.length;

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />

      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 43.0731,
          longitude: -89.4012,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
      />

      {/* Top: title + destination */}
      <SafeAreaView edges={["top"]} pointerEvents="box-none" style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <Text style={{ fontSize: 24, fontWeight: "700" }}>On my way!</Text>
          <Text numberOfLines={1} style={{ marginTop: 4, fontSize: 14, opacity: 0.7 }}>
            {ride.destination ?? "No destination"}
          </Text>
        </View>
      </SafeAreaView>

      {/* Bottom panel: stats + actions (Invite / Leave ride) */}
      <SafeAreaView edges={["bottom"]} pointerEvents="box-none" style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
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
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
              <View>
                <Text style={{ fontSize: 12, opacity: 0.6 }}>Time · Distance</Text>
                <Text style={{ fontSize: 16, fontWeight: "600" }}>— min · — mi</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={{ fontSize: 12, opacity: 0.6 }}>Pickups</Text>
                <Text style={{ fontSize: 16, fontWeight: "600" }}>{pickupsCount}</Text>
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
                onPress={leaveRide}
                style={({ pressed }) => ({
                  flex: 1,
                  backgroundColor: "#9ca3af",
                  borderRadius: 10,
                  paddingVertical: 12,
                  alignItems: "center",
                  opacity: pressed ? 0.85 : 1,
                })}
              >
                <Text style={{ color: "white", fontWeight: "700" }}>Leave ride</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
