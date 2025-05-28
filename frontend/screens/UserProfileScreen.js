import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import BackButton from "../components/BackButton";
import StatCard from "../components/StatCard";
import { globalStyles } from "../styles/globalStyles";
import { BASE_URL } from "../constants";

export default function UserProfileScreen({ route }) {
  const userParam = route?.params?.user;
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndStats = async () => {
      try {
        const userId = userParam?._id;
        if (!userId) return;

        const userResponse = await fetch(`${BASE_URL}/api/users/${userId}`);
        const userData = await userResponse.json();
        setUser(userData);

        const statsResponse = await fetch(`${BASE_URL}/api/stats/${userId}`);
        const statsData = await statsResponse.json();
        setStats(statsData);
      } catch (error) {
        console.error(
          "Erro ao buscar dados do usuário ou estatísticas:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    if (userParam?._id) {
      fetchUserAndStats();
    }
  }, [userParam]);

  if (!user) {
    return (
      <View style={globalStyles.container}>
        <BackButton />
        <Text style={globalStyles.name}>Usuário não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <BackButton />

      <Text style={[globalStyles.name, { marginTop: 40 }]}>{user?.nome}</Text>

      <Text style={globalStyles.email}>{user?.email}</Text>
      {user?.cidade && (
        <Text style={globalStyles.info}>Cidade: {user.cidade}</Text>
      )}
      {user?.posicao && (
        <Text style={globalStyles.info}>Posição: {user.posicao}</Text>
      )}

      <Text style={globalStyles.sectionTitle}>Estatísticas</Text>
      {loading ? (
        <ActivityIndicator color="#00C853" size="large" />
      ) : stats ? (
        <StatCard stats={stats} />
      ) : (
        <Text style={globalStyles.emptyText}>Sem dados de estatísticas.</Text>
      )}
    </View>
  );
}
