import React, { useState, useEffect } from "react";
import { View, Text, Alert, ScrollView, TextInput } from "react-native";
import MapView, { Marker } from "react-native-maps";
import DropDownPicker from "react-native-dropdown-picker";
import BackButton from "../components/BackButton";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import { Swipeable } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../styles/globalStyles";
import { BASE_URL } from "../constants";

const ManageMatchScreen = ({ route }) => {
  const navigation = useNavigation();
  const { match, inscritos: initialInscritos } = route.params;
  const isFinalizada = match.finalizada === true;

  const [inscritos, setInscritos] = useState(initialInscritos || []);
  const [titulo, setTitulo] = useState(match.titulo);
  const [descricao, setDescricao] = useState(match.descricao);
  const [local, setLocal] = useState(match.local);
  const [cidade, setCidade] = useState(match.cidade);
  const [tipo, setTipo] = useState(match.tipo);
  const [vagas, setVagas] = useState(String(match.vagas));
  const [data, setData] = useState(
    new Date(match.data).toLocaleDateString("pt-BR")
  );
  const [horario, setHorario] = useState(match.horario || "");
  const [duracao, setDuracao] = useState(String(match.duracao || ""));
  const [latitude, setLatitude] = useState(match.location?.coordinates[1]);
  const [longitude, setLongitude] = useState(match.location?.coordinates[0]);
  const [statsPorJogador, setStatsPorJogador] = useState({});

  const [open, setOpen] = useState(false);
  const [tipos] = useState([
    { label: "Futebol", value: "Futebol" },
    { label: "Futsal", value: "Futsal" },
    { label: "Society", value: "Society" },
  ]);

  const excluirPartida = async () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir esta partida?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(
                `${BASE_URL}/api/matches/${match._id}`,
                {
                  method: "DELETE",
                }
              );

              if (response.ok) {
                Alert.alert("Sucesso", "Partida excluída com sucesso!");
                navigation.canGoBack()
                  ? navigation.goBack()
                  : navigation.navigate("Home");
              } else {
                const error = await response.json();
                Alert.alert(
                  "Erro",
                  error.message || "Não foi possível excluir."
                );
              }
            } catch (err) {
              console.error("Erro ao excluir:", err);
              Alert.alert("Erro", "Erro de conexão com o servidor.");
            }
          },
        },
      ]
    );
  };

  const removerParticipante = async (userId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/matches/${match._id}/removePlayer`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );

      if (response.ok) {
        setInscritos((prev) => prev.filter((p) => p._id !== userId));
        Alert.alert("Participante removido com sucesso!");
      } else {
        const text = await response.text();
        let error;
        try {
          error = JSON.parse(text);
        } catch (e) {
          console.error("Resposta não JSON:", text);
          error = { message: "Erro inesperado do servidor." };
        }
        Alert.alert("Erro", error.message || "Erro ao remover participante.");
      }
    } catch (error) {
      console.error("Erro:", error);
      Alert.alert("Erro ao conectar com o servidor.");
    }
  };
  const fetchEstatisticasDosJogadores = async () => {
    try {
      const statsMap = {};
      for (const jogador of inscritos) {
        const res = await fetch(`${BASE_URL}/api/stats/${jogador._id}`);
        if (res.ok) {
          const data = await res.json();
          statsMap[jogador._id] = data;
        }
      }
      setStatsPorJogador(statsMap);
    } catch (err) {
      console.error("Erro ao buscar estatísticas dos jogadores:", err);
    }
  };
  useEffect(() => {
    if (isFinalizada && inscritos.length > 0) {
      fetchEstatisticasDosJogadores();
    }
  }, [isFinalizada, inscritos]);
  const salvarAlteracoes = async () => {
    const [dia, mes, ano] = data.split("/");
    const dateObj = new Date(`${ano}-${mes}-${dia}T12:00:00Z`);

    if (isNaN(dateObj)) {
      Alert.alert("Erro", "Data inválida. Use o formato dd/mm/yyyy");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/matches/${match._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo,
          descricao,
          local,
          cidade,
          tipo,
          vagas: parseInt(vagas),
          data: dateObj.toISOString(),
          horario,
          duracao: parseInt(duracao),
          location: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
        }),
      });

      if (response.ok) {
        Alert.alert("Sucesso", "Partida atualizada com sucesso!");
      } else {
        Alert.alert("Erro", "Erro ao atualizar partida.");
      }
    } catch (error) {
      console.error("Erro:", error);
      Alert.alert("Erro", "Erro de conexão com o servidor.");
    }
  };

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLatitude(latitude);
    setLongitude(longitude);
  };

  return (
    <ScrollView contentContainerStyle={globalStyles.container}>
      <BackButton />
      <Text style={globalStyles.title}>Gerenciar Partida</Text>

      <TextInput
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
        editable={!isFinalizada}
        style={globalStyles.input}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        editable={!isFinalizada}
        style={[globalStyles.input, { height: 80 }]}
        multiline
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Local"
        value={local}
        onChangeText={setLocal}
        editable={!isFinalizada}
        style={globalStyles.input}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Cidade"
        value={cidade}
        onChangeText={setCidade}
        editable={!isFinalizada}
        style={globalStyles.input}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Data (dd/mm/yyyy)"
        value={data}
        onChangeText={setData}
        editable={!isFinalizada}
        style={globalStyles.input}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Horário (ex: 18:30)"
        value={horario}
        onChangeText={setHorario}
        editable={!isFinalizada}
        style={globalStyles.input}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Duração (em minutos)"
        value={duracao}
        onChangeText={setDuracao}
        editable={!isFinalizada}
        keyboardType="numeric"
        style={globalStyles.input}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Vagas"
        value={vagas}
        onChangeText={setVagas}
        editable={!isFinalizada}
        keyboardType="numeric"
        style={globalStyles.input}
        placeholderTextColor="#888"
      />

      <Text style={globalStyles.label}>Tipo</Text>
      <DropDownPicker
        open={open}
        value={tipo}
        items={tipos}
        setOpen={setOpen}
        setValue={setTipo}
        setItems={() => {}}
        disabled={isFinalizada}
        style={globalStyles.input}
        dropDownContainerStyle={{ backgroundColor: "#2C2C3E" }}
        textStyle={{ color: "#fff" }}
        placeholder="Selecione o tipo"
        listItemLabelStyle={{ color: "#fff" }}
      />

      <Text style={globalStyles.label}>
        Toque no mapa para ajustar a localização:
      </Text>
      <MapView
        style={globalStyles.map}
        initialRegion={{
          latitude: latitude || -27.054119,
          longitude: longitude || -49.519172,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        scrollEnabled={!isFinalizada}
        onPress={isFinalizada ? undefined : handleMapPress}
      >
        {latitude && longitude && (
          <Marker coordinate={{ latitude, longitude }} />
        )}
      </MapView>

      {!isFinalizada && (
        <>
          <PrimaryButton title="Salvar Alterações" onPress={salvarAlteracoes} />
          <SecondaryButton title="Excluir Partida" onPress={excluirPartida} />
        </>
      )}

      <Text style={[globalStyles.label, { marginTop: 30 }]}>
        {isFinalizada ? "Estatísticas dos Jogadores:" : "Participantes:"}
      </Text>

      {inscritos.length === 0 ? (
        <Text style={globalStyles.itemText}>Nenhum participante ainda.</Text>
      ) : isFinalizada ? (
        inscritos.map((p) => (
          <View key={p._id} style={globalStyles.card}>
            <Text style={globalStyles.itemText}>👤 {p.nome}</Text>
            <Text style={globalStyles.itemText}>
              Gols: {statsPorJogador[p._id]?.gols ?? 0}
            </Text>
            <Text style={globalStyles.itemText}>
              Assistências: {statsPorJogador[p._id]?.assistencias ?? 0}
            </Text>
            <Text style={globalStyles.itemText}>
              Vitória: {statsPorJogador[p._id]?.vitorias ? "✅" : "❌"}
            </Text>
            <Text style={globalStyles.itemText}>
              Minutos jogados: {statsPorJogador[p._id]?.minutos ?? 0}
            </Text>
          </View>
        ))
      ) : (
        inscritos.map((p) => (
          <Swipeable
            key={p._id}
            renderRightActions={() => (
              <SecondaryButton
                title="❌"
                onPress={() =>
                  Alert.alert(
                    "Remover Participante",
                    `Deseja remover ${p.nome} da partida?`,
                    [
                      { text: "Cancelar", style: "cancel" },
                      {
                        text: "Remover",
                        style: "destructive",
                        onPress: () => removerParticipante(p._id),
                      },
                    ]
                  )
                }
                style={{ width: 70, marginVertical: 2 }}
                textStyle={{ color: "#ff4d4f" }}
              />
            )}
          >
            <View style={globalStyles.card}>
              <Text
                style={globalStyles.itemText}
                onPress={() => navigation.navigate("UserProfile", { user: p })}
              >
                👤 {p.nome}
              </Text>
            </View>
          </Swipeable>
        ))
      )}
    </ScrollView>
  );
};

export default ManageMatchScreen;
