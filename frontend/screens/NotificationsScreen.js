import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackButton from "../components/BackButton";

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = async () => {
    try {
      const stored = await AsyncStorage.getItem("notifications");
      const parsed = stored ? JSON.parse(stored) : [];
      setNotifications(parsed.reverse()); // Mostrar da mais recente para mais antiga
    } catch (err) {
      console.error("Erro ao carregar notificações:", err.message);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.body}>{item.body}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      {notifications.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma notificação ainda.</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121218",
    padding: 16,
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
  body: {
    color: "#ccc",
    marginTop: 4,
  },
  emptyText: {
    color: "#999",
    textAlign: "center",
    marginTop: 40,
  },
});
