import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalStyles } from "../styles/globalStyles";
import HeaderSection from "../components/HeaderSection";
import StatCard from "../components/StatCard";
import InviteCard from "../components/InviteCard";
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
  const [invites, setInvites] = useState([]);
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
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    await Promise.all([fetchStats(), fetchInvites()]);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAllData().finally(() => setRefreshing(false));
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

  const fetchInvites = async () => {
    try {
      // const res = await fetch(`${BASE_URL}/api/invites/${user._id || user.id}`);
      // const data = await res.json();
      const data = []; // Substituir por dados reais
      setInvites(data);
    } catch (error) {
      console.error("Erro ao buscar convites:", error);
    }
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <FlatList
        style={{ paddingHorizontal: 20 }}
        data={invites}
        keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
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
            </View>
          </>
        }
        renderItem={({ item }) => <InviteCard invite={item} />}
        ListEmptyComponent={
          <Text
            style={[
              globalStyles.itemText,
              { textAlign: "center", marginTop: 20 },
            ]}
          >
            Sem convites no momento
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 60 }}
      />
    </SafeAreaView>
  );
}
