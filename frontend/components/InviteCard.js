// components/InviteCard.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { globalStyles } from "../styles/globalStyles";

export default function InviteCard({ invite, onAccept, onDecline }) {
  return (
    <View style={styles.card}>
      <Text style={styles.teamName}>
        {invite.team?.nome || "Time Desconhecido"}
      </Text>
      <Text style={styles.sender}>
        Convidado por: {invite.remetente?.nome || "Desconhecido"}
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
          <Text style={styles.buttonText}>Aceitar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.declineButton} onPress={onDecline}>
          <Text style={styles.buttonText}>Recusar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  teamName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  sender: {
    color: "#aaa",
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  acceptButton: {
    backgroundColor: "#00C853",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  declineButton: {
    backgroundColor: "#d32f2f",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
