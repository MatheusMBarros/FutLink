import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import BackButton from "../components/BackButton";
import { globalStyles } from "../styles/globalStyles";
import { BASE_URL } from "../constants";

export default function MyMatchesScreen() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchMatches = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      const user = JSON.parse(storedUser);
      const userId = user?._id || user?.id;

      if (!userId) {
        throw new Error("Usuário não encontrado.");
      }

      const response = await fetch(`${BASE_URL}/api/matches/creator/${userId}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setMatches(data);
      } else {
        console.error("Erro: resposta inesperada ao buscar partidas", data);
        setMatches([]);
      }
    } catch (error) {
      console.error("Erro ao buscar partidas:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMatches();
  }, []);

  const renderItem = ({ item }) => {
    const now = new Date();

    const inicio = new Date(item.data); // base correta da partida
    const [hour, minute] = (item.horario || "00:00").split(":").map(Number);
    inicio.setHours(hour, minute, 0, 0);

    const fim = new Date(inicio.getTime() + (item.duracao || 0) * 60000);

    const isFinalizada = item.finalizada;
    const precisaAvaliacao = !item.finalizada && fim <= now;
    const aindaNaoOcorreu = fim > now;

    const dataFormatada = inicio.toLocaleDateString("pt-BR");
    const horarioFormatado = inicio.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const handlePress = () => {
      if (precisaAvaliacao) {
        navigation.navigate("PostMatch", {
          match: item,
          inscritos: item.participantes,
        });
      } else {
        navigation.navigate("ManageMatch", {
          match: item,
          inscritos: item.participantes,
        });
      }
    };

    return (
      <TouchableOpacity
        key={item._id}
        style={[globalStyles.card, { opacity: isFinalizada ? 0.6 : 1 }]}
        onPress={handlePress}
      >
        {(isFinalizada || precisaAvaliacao || aindaNaoOcorreu) && (
          <View
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: isFinalizada
                ? "#EF5350"
                : precisaAvaliacao
                ? "#FFD600"
                : "#00C853",
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 8,
              zIndex: 1,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 12 }}>
              {isFinalizada
                ? "FINALIZADA"
                : precisaAvaliacao
                ? "AGUARDANDO AVALIAÇÃO"
                : "EM BREVE"}
            </Text>
          </View>
        )}

        <Text style={globalStyles.cardTitle}>{item.titulo}</Text>
        <Text style={globalStyles.itemText}>
          {dataFormatada} às {horarioFormatado}
        </Text>
        <Text style={globalStyles.itemText}>Vagas: {item.vagas}</Text>
        <Text style={globalStyles.itemText}>
          Inscritos: {item.participantes.length}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={globalStyles.container}>
      <BackButton />
      <Text style={globalStyles.title}>Minhas Partidas</Text>

      <TouchableOpacity
        style={[globalStyles.button, { marginBottom: 20 }]}
        onPress={() => navigation.navigate("CreateMatch")}
      >
        <Text style={globalStyles.buttonText}>+ Criar Nova Partida</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#00C853"
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#00C853"]}
            />
          }
          ListEmptyComponent={
            <Text style={[globalStyles.emptyText, { marginTop: 40 }]}>
              Você ainda não criou nenhuma partida.
            </Text>
          }
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
}
