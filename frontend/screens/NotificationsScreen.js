import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BackButton from "../components/BackButton";
import { BASE_URL } from "../constants";
import { UserContext } from "../context/UserContext";

export default function NotificationsScreen() {
  const { user } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = async () => {
    try {
      if (!user?._id) return;
      const response = await axios.get(`${BASE_URL}/notification/${user._id}`);
      setNotifications(response.data.reverse()); // Da mais recente para mais antiga
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
      <Text style={styles.title}>
        {item.type === "like"
          ? `${item.from?.username} curtiu seu post`
          : `${item.from?.username} comentou: ${item.comment || ""}`}
      </Text>
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
          keyExtractor={(item) => item._id}
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
  emptyText: {
    color: "#999",
    textAlign: "center",
    marginTop: 40,
  },
});
