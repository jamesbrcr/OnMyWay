// app/(ride)/invite.tsx
import { View, Text, Button, Alert, Platform } from "react-native";
import { useRideStore } from "../../lib/rideStore";
import { useRouter } from "expo-router";
import QRCode from "react-native-qrcode-svg";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { Share } from "react-native";

export default function Invite() {
  const { ride } = useRideStore();
  const router = useRouter();

  if (!ride.id || !ride.destination) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>No active ride. Create one first.</Text>
      </View>
    );
  }

  // Build an app link like myapp://ride/join?rideId=XYZ
  const inviteUrl = Linking.createURL("/(ride)/join", {
    queryParams: { rideId: ride.id, dest: ride.destination },
  });

  const copyLink = async () => {
    await Clipboard.setStringAsync(inviteUrl);
    Alert.alert("Copied", "Invite link copied to clipboard.");
  };

  const shareLink = async () => {
    await Share.share({ message: `Join my ride: ${inviteUrl}` });
  };

  return (
    <View style={{ flex: 1, padding: 20, gap: 16, alignItems: "center" }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>Invite friends to your ride</Text>
      <Text>Destination: {ride.destination}</Text>
      <View style={{ padding: 12, borderWidth: 1, borderColor: "#eee", borderRadius: 12 }}>
        <QRCode value={inviteUrl} size={180} />
      </View>
      <Text selectable style={{ textAlign: "center" }}>{inviteUrl}</Text>
      <Button title="Copy link" onPress={copyLink} />
      <Button title="Share link" onPress={shareLink} />
      <Button title="Open Map" onPress={() => router.push("./map")} />
    </View>
  );
}
