import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../styles/globalStyles";
import HeaderSection from "../components/HeaderSection";
import StatCard from "../components/StatCard";
import { BASE_URL } from "../constants";

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    matchesPlayed: 0,
    mvpCount: 0,
    gols: 0,
    assistencias: 0,
    vitorias: 0,
    derrotas: 0,
    empates: 0,
    minutos: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Erro ao carregar usuário do AsyncStorage:", error);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    if (user?._id || user?.id) {
      fetchStats();
    }
  }, [user]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStats().finally(() => setRefreshing(false));
  }, [user]);

  const fetchStats = async () => {
    try {
      const userId = user._id || user.id;
      const res = await fetch(`${BASE_URL}/api/stats/${userId}`);
      const data = await res.json();
      setStats({
        matchesPlayed: data.vitorias + data.derrotas + data.empates,
        mvpCount: data.mvpCount,
        gols: data.gols,
        assistencias: data.assistencias,
        vitorias: data.vitorias,
        derrotas: data.derrotas,
        empates: data.empates,
        minutos: data.minutos,
      });
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    }
  };

  return (
    <View style={globalStyles.container}>
      <FlatList
        data={[]} // Vazio para usar apenas como scroll/refresh container
        keyExtractor={() => Math.random().toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#00C853"]}
          />
        }
        ListHeaderComponent={
          <>
            <HeaderSection user={user} navigation={navigation} />
            <StatCard stats={stats} />

            <View style={globalStyles.card}>
              <Text style={globalStyles.cardTitle}>📨 Convites Pendentes</Text>
              <TouchableOpacity
                style={{ marginTop: 10 }}
                onPress={() => navigation.navigate("InvitesScreen")}
              >
                <Text style={globalStyles.link}>Ver convites</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        contentContainerStyle={{ paddingBottom: 60 }}
      />
    </View>
  );
}
