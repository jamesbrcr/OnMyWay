// app/(ride)/map.tsx
import React from "react";
import { View, Text, FlatList } from "react-native";
import { useRideStore } from "../../lib/rideStore";

export default function RideMap() {
  const { ride } = useRideStore();

  if (!ride.id) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>No active ride.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>Route Overview</Text>
      <Text>Destination: {ride.destination}</Text>

      {/* Placeholder “map” box */}
      <View
        style={{
          height: 220,
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text>Map placeholder (swap with Google Maps SDK later)</Text>
      </View>

      <Text style={{ fontWeight: "600", marginTop: 8 }}>
        Pickups ({ride.pickups.length})
      </Text>
      <FlatList
        data={ride.pickups}
        keyExtractor={(p) => p.id}
        renderItem={({ item, index }) => (
          <View
            style={{
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderBottomColor: "#eee",
            }}
          >
            <Text>
              {index + 1}. {item.name ?? "Guest"} — {item.lat ?? "?"}, {item.lng ?? "?"}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text>No pickups yet.</Text>}
      />
    </View>
  );
}
