// components/StatCard.js
import React from "react";
import { View, Text } from "react-native";
import { globalStyles } from "../styles/globalStyles";

export default function StatCard({ stats }) {
  return (
    <View style={globalStyles.card}>
      <Text style={globalStyles.cardTitle}>📊 Estatísticas</Text>
      <Text style={globalStyles.itemText}>
        Partidas Jogadas: {stats.matchesPlayed}
      </Text>
      <Text style={globalStyles.itemText}>Vitórias: {stats.vitorias}</Text>
      <Text style={globalStyles.itemText}>Derrotas: {stats.derrotas}</Text>
      <Text style={globalStyles.itemText}>Empates: {stats.empates}</Text>
      <Text style={globalStyles.itemText}>Gols: {stats.gols}</Text>
      <Text style={globalStyles.itemText}>
        Assistências: {stats.assistencias}
      </Text>
      <Text style={globalStyles.itemText}>
        Minutos Jogados: {stats.minutos}
      </Text>
      <Text style={globalStyles.itemText}>MVPs: {stats.mvpCount}</Text>
    </View>
  );
}
