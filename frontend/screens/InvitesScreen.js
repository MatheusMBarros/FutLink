import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BASE_URL } from "../constants";
import { globalStyles } from "../styles/globalStyles";
import InviteCard from "../components/InviteCard";
import BackButton from "../components/BackButton";

export default function InvitesScreen() {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchInvites = async () => {
    try {
      const userJson = await AsyncStorage.getItem("user");
      const user = JSON.parse(userJson);
      const userId = user?._id || user?.id;

      if (!userId) throw new Error("Usuário não encontrado");

      const res = await axios.get(`${BASE_URL}/api/teams/invites/${userId}`);
      setInvites(res.data);
    } catch (err) {
      console.error("Erro ao buscar convites:", err);
      Alert.alert("Erro", "Não foi possível carregar os convites");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const respondToInvite = async (inviteId, action) => {
    try {
      await axios.post(`${BASE_URL}/api/teams/invites/${inviteId}/respond`, {
        action,
      });
      if (action === "aceitar") {
        // ⚠️ Buscar novamente os dados do usuário após aceitar
        const userJson = await AsyncStorage.getItem("user");
        const user = JSON.parse(userJson);
        const userId = user?._id || user?.id;

        const res = await axios.get(`${BASE_URL}/api/teams/user/${userId}`);

        if (res.data.length > 0) {
          const team = res.data[0];

          // Se o usuário NÃO for o criador, redireciona
          if (team.criador !== userId) {
            navigation.replace("TeamScreen", { forceRefresh: true });
          }
        }
      }
      setInvites((prev) => prev.filter((inv) => inv._id !== inviteId));
    } catch (err) {
      console.error("Erro ao responder convite:", err);
      Alert.alert(
        "Erro",
        `Não foi possível ${
          action === "aceitar" ? "aceitar" : "recusar"
        } o convite`
      );
    }
  };

  const handleAccept = (inviteId) => respondToInvite(inviteId, "aceitar");
  const handleDecline = (inviteId) => respondToInvite(inviteId, "recusar");

  useEffect(() => {
    fetchInvites();
  }, []);

  return (
    <View style={globalStyles.container}>
      <BackButton />
      <Text style={globalStyles.title}>Convites Pendentes</Text>

      {loading ? (
        <ActivityIndicator color="#00C853" size="large" />
      ) : (
        <FlatList
          data={invites}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchInvites();
              }}
              colors={["#00C853"]}
            />
          }
          renderItem={({ item }) => (
            <InviteCard
              invite={item}
              onAccept={() => handleAccept(item._id)}
              onDecline={() => handleDecline(item._id)}
            />
          )}
          ListEmptyComponent={
            <Text
              style={{
                color: "#ccc",
                textAlign: "center",
                marginTop: 20,
              }}
            >
              Nenhum convite no momento
            </Text>
          }
        />
      )}
    </View>
  );
}
