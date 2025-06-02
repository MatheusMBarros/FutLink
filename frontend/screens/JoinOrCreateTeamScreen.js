import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "../constants";
import { globalStyles } from "../styles/globalStyles";
import BackButton from "../components/BackButton";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function JoinOrCreateTeamScreen({ route, navigation }) {
  const { userId } = route.params;
  const [nomeBusca, setNomeBusca] = useState("");
  const [novoNome, setNovoNome] = useState("");

  const handleBuscar = async () => {
    const termo = nomeBusca.trim();
    if (!termo) return Alert.alert("Erro", "Digite um nome ou ID");

    try {
      const res = await axios.get(`${BASE_URL}/api/teams/buscar?nome=${termo}`);
      if (res.data.length === 0) return Alert.alert("Nenhum time encontrado.");

      const time = res.data[0];

      const resposta = await axios.post(
        `${BASE_URL}/api/teams/${time._id}/invite`,
        {
          identificador: time.criador,
          remetenteId: userId,
        }
      );

      Alert.alert(
        "Solicitação enviada",
        resposta.data?.message || "Aguardando aprovação do criador."
      );
      setNomeBusca("");
    } catch (err) {
      Alert.alert(
        "Erro",
        err.response?.data?.message || "Erro ao enviar solicitação."
      );
    }
  };

  const handleCriar = async () => {
    const nome = novoNome.trim();
    if (!nome) return Alert.alert("Erro", "Digite um nome válido para o time.");

    try {
      const res = await axios.post(`${BASE_URL}/api/teams`, {
        nome,
        criador: userId,
      });
      navigation.replace("TeamDetailsScreen", { team: res.data, userId });
    } catch (err) {
      Alert.alert("Erro", "Erro ao criar o time.");
    }
  };

  // 🔁 Ao focar, verifica se o usuário foi aceito em um time
  useFocusEffect(
    useCallback(() => {
      const verificarEntrada = async () => {
        const userJson = await AsyncStorage.getItem("user");
        const user = JSON.parse(userJson);
        const id = user?._id || user?.id;
        const res = await axios.get(`${BASE_URL}/api/teams/user/${id}`);
        if (res.data.length > 0) {
          navigation.replace("TeamDetailsScreen", {
            team: res.data[0],
            userId: id,
          });
        }
      };
      verificarEntrada();
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={globalStyles.container}>
      <BackButton />
      <Text
        style={[globalStyles.title, { marginTop: 20, alignContent: "center" }]}
      >
        Entrar ou Criar um Time
      </Text>

      <View style={styles.section}>
        <Text style={globalStyles.label}>Solicitar entrada em um time:</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="Digite o nome ou ID do time"
          placeholderTextColor="#999"
          value={nomeBusca}
          onChangeText={setNomeBusca}
        />
        <TouchableOpacity style={globalStyles.button} onPress={handleBuscar}>
          <Text style={globalStyles.buttonText}>Enviar Solicitação</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={globalStyles.label}>Criar um novo time:</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="Nome do novo time"
          placeholderTextColor="#999"
          value={novoNome}
          onChangeText={setNovoNome}
        />
        <TouchableOpacity style={globalStyles.button} onPress={handleCriar}>
          <Text style={globalStyles.buttonText}>Criar Time</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
});
