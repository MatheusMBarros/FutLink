// components/PrimaryButton.js
import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { globalStyles } from "../styles/globalStyles";

export default function PrimaryButton({ title, onPress, disabled, loading }) {
  return (
    <TouchableOpacity
      style={[globalStyles.button, disabled && globalStyles.buttonDisabled]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#121218" />
      ) : (
        <Text style={globalStyles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
