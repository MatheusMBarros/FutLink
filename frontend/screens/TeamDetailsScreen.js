import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";
import { BASE_URL } from "../constants";
import { globalStyles } from "../styles/globalStyles";
import BackButton from "../components/BackButton";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function TeamDetailsScreen({ route }) {
  const navigation = useNavigation();
  const { team, userId } = route.params;
  const [nome, setNome] = useState(team.nome);
  const [membros, setMembros] = useState(team.membros || []);
  const [novoMembro, setNovoMembro] = useState("");
  const [notificacoes, setNotificacoes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [novoLiderId, setNovoLiderId] = useState(null);
  const [dropdownItems, setDropdownItems] = useState([]);
  const isCriador = team.criador === userId;

  const loadTeamData = async () => {
    try {
      const [resTeam, resMatches] = await Promise.all([
        axios.get(`${BASE_URL}/api/teams/${team._id}`),
        axios.get(`${BASE_URL}/api/matches/team/${team._id}`),
      ]);

      setNome(resTeam.data.nome);
      setMembros(resTeam.data.membros);
      setNotificacoes(resMatches.data);
    } catch (err) {
      console.warn("Erro ao carregar dados do time:", err.message);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTeamData();
    }, [])
  );

  useEffect(() => {
    const options = membros
      .filter((m) => m._id !== userId)
      .map((m) => ({
        key: m._id, // ✅ Corrigido: adiciona chave única
        label: m.nome,
        value: m._id,
      }));
    setDropdownItems(options);
  }, [membros]);

  const onRefresh = () => {
    setRefreshing(true);
    loadTeamData();
  };

  const handleSave = async () => {
    try {
      await axios.put(`${BASE_URL}/api/teams/${team._id}`, { nome });
      Alert.alert("Sucesso", "Time atualizado.");
    } catch (err) {
      Alert.alert("Erro", "Erro ao atualizar nome.");
    }
  };

  const handleInvite = async () => {
    if (!novoMembro.trim()) return Alert.alert("Erro", "Digite email ou ID.");
    try {
      const res = await axios.post(`${BASE_URL}/api/teams/${team._id}/invite`, {
        identificador: novoMembro,
        remetenteId: userId,
      });
      Alert.alert("Convite enviado", res.data?.message || "Enviado.");
      setNovoMembro("");
    } catch (err) {
      Alert.alert("Erro", err.response?.data?.message || "Falha no convite.");
    }
  };

  const handleTransferCreator = async (newCreatorId) => {
    Alert.alert("Transferir liderança", "Deseja transferir a liderança?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Transferir",
        onPress: async () => {
          try {
            await axios.post(`${BASE_URL}/api/teams/${team._id}/transfer`, {
              newCreatorId,
            });
            Alert.alert("Sucesso", "Liderança transferida.");
            navigation.replace("TeamScreen");
          } catch {
            Alert.alert("Erro", "Não foi possível transferir.");
          }
        },
      },
    ]);
  };

  const handleDeleteTeam = async () => {
    Alert.alert("Deletar time", "Essa ação não pode ser desfeita. Confirmar?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Deletar",
        style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(`${BASE_URL}/api/teams/${team._id}`);
            Alert.alert("Time deletado.");
            navigation.replace("TeamScreen");
          } catch {
            Alert.alert("Erro", "Não foi possível deletar.");
          }
        },
      },
    ]);
  };

  const handleLeaveTeam = async () => {
    Alert.alert("Sair do time", "Tem certeza que deseja sair do time?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            await axios.post(`${BASE_URL}/api/teams/${team._id}/remove`, {
              userId,
            });
            Alert.alert("Sucesso", "Você saiu do time.");
            navigation.replace("TeamScreen");
          } catch {
            Alert.alert("Erro", "Não foi possível sair do time.");
          }
        },
      },
    ]);
  };

  const handleRemoveMember = async (id) => {
    try {
      await axios.post(`${BASE_URL}/api/teams/${team._id}/remove`, {
        userId: id,
      });
      Alert.alert("Removido", "Membro removido com sucesso.");
      loadTeamData();
    } catch {
      Alert.alert("Erro", "Não foi possível remover o membro.");
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={globalStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      keyboardShouldPersistTaps="handled"
    >
      <BackButton />
      <Text style={styles.teamTitle}>{nome}</Text>

      {isCriador && (
        <>
          <Text style={globalStyles.label}>Editar Nome:</Text>
          <TextInput
            style={globalStyles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Nome do time"
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            style={[globalStyles.button, styles.smallButton]}
            onPress={handleSave}
          >
            <Text style={globalStyles.buttonText}>Salvar Nome</Text>
          </TouchableOpacity>

          <Text style={[globalStyles.label, { marginTop: 24 }]}>
            Convidar Membro:
          </Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Email ou ID"
            value={novoMembro}
            onChangeText={setNovoMembro}
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            style={[globalStyles.button, styles.smallButton]}
            onPress={handleInvite}
          >
            <Text style={globalStyles.buttonText}>Enviar Convite</Text>
          </TouchableOpacity>

          <Text style={[globalStyles.label, { marginTop: 30 }]}>
            Ações administrativas:
          </Text>
          <Text style={{ color: "#aaa", fontSize: 13, marginBottom: 8 }}>
            Transferir liderança:
          </Text>
          <View style={{ zIndex: 1000 }}>
            <DropDownPicker
              open={dropdownOpen}
              setOpen={setDropdownOpen}
              value={novoLiderId}
              setValue={setNovoLiderId}
              items={dropdownItems}
              placeholder="Selecione um membro"
              containerStyle={{ marginBottom: 10 }}
              style={{
                backgroundColor: "#222",
                borderColor: "#444",
              }}
              dropDownContainerStyle={{
                backgroundColor: "#222",
                borderColor: "#444",
              }}
              textStyle={{ color: "#ccc" }}
            />
          </View>

          <TouchableOpacity
            style={[
              globalStyles.button,
              styles.smallButton,
              { backgroundColor: "#4CAF50", marginBottom: 16 },
            ]}
            disabled={!novoLiderId}
            onPress={() => handleTransferCreator(novoLiderId)}
          >
            <Text style={globalStyles.buttonText}>Confirmar transferência</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              globalStyles.button,
              styles.smallButton,
              { backgroundColor: "#444" },
            ]}
            onPress={handleDeleteTeam}
          >
            <Text style={[globalStyles.buttonText, { color: "#f44336" }]}>
              Deletar Clube
            </Text>
          </TouchableOpacity>
        </>
      )}

      {!isCriador && (
        <TouchableOpacity
          style={[globalStyles.button, { backgroundColor: "#d32f2f" }]}
          onPress={handleLeaveTeam}
        >
          <Text style={globalStyles.buttonText}>Sair do Time</Text>
        </TouchableOpacity>
      )}

      <Text style={[globalStyles.label, { marginTop: 32 }]}>Membros:</Text>
      {membros.length === 0 ? (
        <Text style={{ color: "#888", marginTop: 10 }}>
          Nenhum membro ainda
        </Text>
      ) : (
        membros.map((item) => (
          <View key={item._id} style={styles.memberRow}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => navigation.navigate("UserProfile", { user: item })}
            >
              <Text style={styles.memberText}>{item.nome}</Text>
            </TouchableOpacity>

            {isCriador && item._id !== userId && (
              <TouchableOpacity onPress={() => handleRemoveMember(item._id)}>
                <Ionicons
                  name="remove-circle-outline"
                  size={22}
                  color="#e53935"
                />
              </TouchableOpacity>
            )}
          </View>
        ))
      )}

      <Text style={[globalStyles.label, { marginTop: 32 }]}>
        Próximas partidas do time:
      </Text>
      {notificacoes.length === 0 ? (
        <Text style={{ color: "#888" }}>Nenhuma partida marcada.</Text>
      ) : (
        notificacoes.map((item) => (
          <TouchableOpacity
            key={item._id}
            onPress={async () => {
              try {
                const res = await axios.get(
                  `${BASE_URL}/api/matches/${item._id}`
                );
                navigation.navigate("MatchDetails", { match: res.data });
              } catch {
                Alert.alert("Erro", "Não foi possível carregar a partida.");
              }
            }}
            style={styles.matchItem}
          >
            <Text style={{ color: "#aaa", fontSize: 13 }}>
              {new Date(item.data).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}{" "}
              às {item.horario} {item.local}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  teamTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginVertical: 20,
  },
  memberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 0.3,
    borderColor: "#444",
  },
  memberText: {
    color: "#ccc",
    fontSize: 16,
  },
  matchItem: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: "#333",
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 10,
  },
});
