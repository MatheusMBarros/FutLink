// components/InviteCard.js
import React from "react";
import { View, Text } from "react-native";
import { globalStyles } from "../styles/globalStyles";

export default function InviteCard({ invite }) {
  return (
    <View style={globalStyles.card}>
      <Text style={globalStyles.itemText}>• {invite.eventName}</Text>
    </View>
  );
}
