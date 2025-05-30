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

  const loadUser = async () => {
    try {
      const userJson = await AsyncStorage.getItem("user");
      const parsed = JSON.parse(userJson);
      if (parsed?._id || parsed?.id) {
        setUserId(parsed._id || parsed.id);
      }
    } catch (err) {
      console.warn("⚠️ Erro ao carregar usuário:", err.message);
    }
  };

  const loadNotifications = async () => {
    try {
      if (!userId) {
        console.warn("❌ ID do usuário não disponível");
        return;
      }

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

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (userId) {
      loadNotifications();
    }
  }, [userId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => {
    const remetente = item.from?.nome || "Alguém";

    return (
      <View style={styles.card}>
        <Text style={styles.title}>
          {item.type === "like"
            ? `${remetente} curtiu seu post`
            : item.type === "comment"
            ? ` ${item.message || ""}`
            : item.message}
        </Text>
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
