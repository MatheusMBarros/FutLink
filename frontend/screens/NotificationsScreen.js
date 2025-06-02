import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BackButton from "../components/BackButton";
import { BASE_URL } from "../constants";

export default function NotificationsScreen() {
  const [userId, setUserId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem("user");
        const parsed = JSON.parse(userJson);
        const id = parsed?._id || parsed?.id;
        setUserId(id);
      } catch (err) {
        console.warn("⚠️ Erro ao carregar usuário:", err.message);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (userId) {
      loadNotifications();
    }
  }, [userId]);

  const loadNotifications = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/notification/${userId}`
      );
      setNotifications(response.data.reverse());
    } catch (err) {
      console.error("❌ Erro ao carregar notificações:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => {
    const remetente = item.from?.nome || "Alguém";

    let mensagem = item.message;
    if (item.type === "like") {
      mensagem = `${remetente} curtiu seu post`;
    } else if (item.type === "comment") {
      mensagem = item.message || `${remetente} comentou em seu post`;
    } else if (item.type === "nova-partida") {
      mensagem = item.message;
    } else if (item.type === "lembrete") {
      mensagem = item.message;
    }

    return (
      <View style={styles.card}>
        <Text style={styles.title}>{mensagem}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: "#fff" }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma notificação ainda.</Text>
        }
        contentContainerStyle={{ paddingTop: 50, padding: 16 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121218",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#121218",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#1e1e2f",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyText: {
    color: "#999",
    textAlign: "center",
    marginTop: 40,
  },
});
