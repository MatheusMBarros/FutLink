import React, { useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../constants";
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";

export default function TeamScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const checkTeam = async () => {
    try {
      const userJson = await AsyncStorage.getItem("user");
      const user = JSON.parse(userJson);
      const userId = user?._id || user?.id;
      if (!userId) throw new Error("ID de usuário não encontrado");

      const res = await axios.get(`${BASE_URL}/api/teams/user/${userId}`);

      if (res.data.length > 0) {
        navigation.replace("TeamDetailsScreen", {
          team: res.data[0],
          userId,
        });
      } else {
        navigation.replace("JoinOrCreateTeamScreen", { userId });
      }
    } catch (err) {
      console.error("Erro ao verificar time:", err.message);
      setLoading(false);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    checkTeam();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (route.params?.forceRefresh) {
        setLoading(true);
        checkTeam();
      }
    }, [route.params?.forceRefresh])
  );

  const onRefresh = () => {
    setRefreshing(true);
    checkTeam();
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {loading ? <ActivityIndicator size="large" color="#00e676" /> : <View />}
    </ScrollView>
  );
}
