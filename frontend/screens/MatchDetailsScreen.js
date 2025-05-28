import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import BackButton from "../components/BackButton";
import { globalStyles } from "../styles/globalStyles";
import { BASE_URL } from "../constants";

const MatchDetailsScreen = ({ route }) => {
  const { match } = route.params;
  const navigation = useNavigation();
  const [matchData, setMatchData] = useState(match);
  const [currentUser, setCurrentUser] = useState(null);
  const [inscritos, setInscritos] = useState(match.participantes || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) setCurrentUser(JSON.parse(storedUser));
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (currentUser) fetchMatch();
  }, [currentUser]);

  const fetchMatch = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/matches/${match._id}`);
      if (response.ok) {
        const updatedMatch = await response.json();
        setMatchData(updatedMatch);
        setInscritos(updatedMatch.participantes || []);
      }
    } catch (error) {
      console.error("Erro ao buscar partida atualizada:", error);
    }
  };

  const isUserSubscribed = () =>
    inscritos.some(
      (p) => p && (p._id === currentUser?.id || p._id === currentUser?._id)
    );

  const isCriador =
    currentUser?.id === match.criador?._id ||
    currentUser?._id === match.criador?._id;

  const handleInscricao = async () => {
    if (inscritos.length >= match.vagas)
      return Alert.alert("Não há mais vagas disponíveis.");

    try {
      setLoading(true);
      const userId = currentUser?._id || currentUser?.id;
      const response = await fetch(
        `${BASE_URL}/api/matches/${match._id}/inscrever`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );

      if (response.ok) {
        Alert.alert("Inscrição realizada com sucesso!");
        await fetchMatch();
      } else {
        const error = await response.json();
        console.error("Erro:", error);
        Alert.alert("Erro ao se inscrever na partida.");
      }
    } catch (error) {
      console.error("Erro ao se inscrever:", error);
      Alert.alert("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleDesinscricao = async () => {
    try {
      setLoading(true);
      const userId = currentUser?._id || currentUser?.id;
      const response = await fetch(
        `${BASE_URL}/api/matches/${match._id}/remover`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );

      if (response.ok) {
        Alert.alert("Inscrição cancelada com sucesso.");
        await fetchMatch();
      } else {
        const error = await response.json();
        console.error("Erro:", error);
        Alert.alert("Erro ao cancelar inscrição.");
      }
    } catch (error) {
      console.error("Erro ao cancelar inscrição:", error);
      Alert.alert("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const irParaGerenciamento = () => {
    navigation.navigate("ManageMatch", { match, inscritos });
  };

  if (!currentUser) {
    return (
      <View style={globalStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#00C853" />
        <Text style={globalStyles.loadingText}>Carregando usuário...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={globalStyles.container}>
      <BackButton />
      <Text style={globalStyles.title}>{match.titulo}</Text>

      {[
        {
          label: "Descrição",
          value: match.descricao,
        },
        {
          label: "Data",
          value: `${new Date(match.data).toLocaleDateString("pt-BR")} às ${
            match.horario ||
            new Date(match.data).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })
          }`,
        },
        {
          label: "Duração",
          value: `${match.duracao} minutos`,
        },
        {
          label: "Local",
          value: match.local,
        },
        {
          label: "Cidade",
          value: match.cidade,
        },
        {
          label: "Tipo",
          value: match.tipo,
        },
        {
          label: "Vagas disponíveis",
          value: matchData.vagas - inscritos.length,
        },
        {
          label: "Criador",
          value: match.criador?.nome,
        },
      ].map((item, index) => (
        <View key={index} style={{ marginBottom: 10 }}>
          <Text style={globalStyles.label}>{item.label}:</Text>
          <Text style={globalStyles.itemText}>{item.value}</Text>
        </View>
      ))}

      <Text style={globalStyles.label}>Inscritos:</Text>
      {inscritos.length > 0 ? (
        inscritos.map((p, idx) => (
          <TouchableOpacity
            key={p._id || idx}
            onPress={() => navigation.navigate("UserProfile", { user: p })}
          >
            <Text
              style={[
                globalStyles.itemText,
                { textDecorationLine: "underline" },
              ]}
            >
              • {p.nome}
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={globalStyles.itemText}>Nenhum participante ainda.</Text>
      )}

      {!isCriador && (
        <>
          {isUserSubscribed() ? (
            <TouchableOpacity
              style={[globalStyles.button, { backgroundColor: "#D32F2F" }]} // vermelho para destaque
              onPress={handleDesinscricao}
              disabled={loading}
            >
              <Text style={globalStyles.buttonText}>
                {loading ? "Processando..." : "Desinscrever-se"}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={globalStyles.button}
              onPress={handleInscricao}
              disabled={loading}
            >
              <Text style={globalStyles.buttonText}>
                {loading ? "Processando..." : "Inscrever-se na Partida"}
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </ScrollView>
  );
};

export default MatchDetailsScreen;
