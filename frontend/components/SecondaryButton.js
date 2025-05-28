import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { globalStyles } from "../styles/globalStyles";

export default function SecondaryButton({ title, onPress, style, textStyle }) {
  return (
    <TouchableOpacity
      style={[globalStyles.secondaryButton, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[{ color: "#00e676", fontWeight: "700" }, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
