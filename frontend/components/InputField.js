// components/InputField.js
import React from "react";
import { View, Text, TextInput } from "react-native";
import { globalStyles } from "../styles/globalStyles";

export default function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
}) {
  return (
    <View style={globalStyles.inputGroup}>
      <Text style={globalStyles.label}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#444"
        style={globalStyles.input}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}
