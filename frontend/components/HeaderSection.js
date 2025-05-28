// components/HeaderSection.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "../styles/globalStyles";

export default function HeaderSection({ user, navigation }) {
  return (
    <View style={globalStyles.header}>
      <Text style={globalStyles.greeting}>Olá, {user?.nome || "Usuário"}</Text>
      <View style={globalStyles.headerIcons}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Profile")}
          style={globalStyles.iconButton}
        >
          <Ionicons name="person-circle-outline" size={30} color="#00e676" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Notifications")}
          style={globalStyles.iconButton}
        >
          <Ionicons name="notifications-outline" size={28} color="#00e676" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
