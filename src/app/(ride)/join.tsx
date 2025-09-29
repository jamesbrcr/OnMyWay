// app/(ride)/join.tsx
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, Alert, Share } from "react-native";
import MapView from "react-native-maps";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Linking from "expo-linking";
import * as Location from "expo-location";
import { useRideStore } from "@/lib/rideStore"; // or "../../lib/rideStore"
import { supabase } from "@/lib/supabase";

export default function JoinRide() {
  const params = useLocalSearchParams<{ rideId?: string; dest?: string }>();
  const { ride, attachRide, addPickup, removePickup, reset } = useRideStore();
  const [joined, setJoined] = useState(false);
  const myPickupIdRef = useRef<string | null>(null);

  // 1) Attach to the ride from the link (runs once when params change)
  useEffect(() => {
    const rid = String(params.rideId || "");
    const dest = String(params.dest || "");
    if (!rid || !dest) return;
    if (ride.id !== rid) {
      attachRide(rid, dest);
      // (optional) also upsert the ride row to ensure it exists server-side
      supabase.from("rides").upsert({ id: rid, destination: dest });
    }
  }, [params.rideId, params.dest]);


  // 2–4) Join flow: permission → location → insert → local mirror
  useEffect(() => {
    const join = async () => {
      if (!ride.id || joined) return;

      // 2) permission + coords
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Location needed", "Please allow location to join this ride.");
        return;
      }
      const pos = await Location.getCurrentPositionAsync({});
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      // Make a short pickup id (client-side for MVP)
      const pickupId = Math.random().toString(36).slice(2);
      myPickupIdRef.current = pickupId;

      // 3) insert to Supabase
      const { error } = await supabase.from("pickups").insert({
        id: pickupId,
        ride_id: ride.id,
        name: "Guest",
        lat,
        lng,
      });
      if (error) {
        console.warn("[join] insert pickup error:", error.message);
        Alert.alert("Error joining ride", error.message);
        return;
      }

      // 4) reflect locally
      addPickup({ id: pickupId, name: "Guest", lat, lng });
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
