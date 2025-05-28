import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { globalStyles } from "../styles/globalStyles";
import BackButton from "../components/BackButton";
import { BASE_URL } from "../constants";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";

export default function PostMatchScreen({ route }) {
  const { match, inscritos } = route.params;
  const navigation = useNavigation();

  const [mvpId, setMvpId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [playerStats, setPlayerStats] = useState(
    inscritos.map((p) => ({
      userId: p._id,
      nome: p.nome,
      gols: 0,
      assistencias: 0,
      minutosJogador: match?.duracao ?? 0,
      vitorias: true,
    }))
  );

  const atualizarStat = (userId, campo, valor) => {
    setPlayerStats((prev) =>
      prev.map((p) => (p.userId === userId ? { ...p, [campo]: valor } : p))
    );
  };

  const finalizarPartida = async () => {
    if (!mvpId) {
      Alert.alert("MVP não selecionado", "Selecione o MVP antes de finalizar.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        mvpId,
        stats: playerStats.map((p) => ({
          userId: p.userId,
          gols: parseInt(p.gols) || 0,
          assistencias: parseInt(p.assistencias) || 0,
          minutosJogador: parseInt(p.minutosJogador) || 0,
          vitorias: !!p.vitorias,
        })),
      };

      const response = await fetch(
        `${BASE_URL}/api/matches/${match._id}/finalizar`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        Alert.alert("Sucesso", "Partida finalizada com sucesso!", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        const error = await response.json();
        throw new Error(error.message || "Erro ao finalizar.");
      }
    } catch (error) {
      console.error("Erro ao finalizar partida:", error);
      Alert.alert("Erro", error.message || "Erro ao finalizar partida.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[globalStyles.container, { paddingBottom: 40 }]}
      keyboardShouldPersistTaps="handled"
    >
      <BackButton />
      <Text
        style={[globalStyles.title, { textAlign: "center", marginBottom: 10 }]}
      >
        Finalizar Partida
      </Text>
      <Text style={[globalStyles.label, { marginBottom: 20 }]}>
        Toque no nome do jogador para selecionar o MVP. Use os sliders para
        registrar estatísticas:
      </Text>

      {playerStats.map((p) => (
        <View
          key={p.userId}
          style={[globalStyles.card, { marginBottom: 25, padding: 16 }]}
        >
          <TouchableOpacity
            onPress={() => setMvpId(p.userId)}
            style={{
              backgroundColor: mvpId === p.userId ? "#00e67622" : "#222",
              padding: 10,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: mvpId === p.userId ? "bold" : "normal",
                color: mvpId === p.userId ? "#00e676" : "#fff",
              }}
            >
              {p.nome} {mvpId === p.userId ? "🌟 (MVP)" : ""}
            </Text>
          </TouchableOpacity>

          <View style={{ marginTop: 12 }}>
            <Text style={globalStyles.label}>Gols: {p.gols}</Text>
            <Slider
              key={`gols-${p.userId}-${p.gols}`}
              minimumValue={0}
              maximumValue={10}
              step={1}
              value={p.gols}
              onValueChange={(val) => atualizarStat(p.userId, "gols", val)}
              minimumTrackTintColor="#00C853"
              maximumTrackTintColor="#888"
              thumbTintColor="#00C853"
            />
          </View>

          <View style={{ marginTop: 12 }}>
            <Text style={globalStyles.label}>
              Assistências: {p.assistencias}
            </Text>
            <Slider
              key={`assists-${p.userId}-${p.assistencias}`}
              minimumValue={0}
              maximumValue={10}
              step={1}
              value={p.assistencias}
              onValueChange={(val) =>
                atualizarStat(p.userId, "assistencias", val)
              }
              minimumTrackTintColor="#00C853"
              maximumTrackTintColor="#888"
              thumbTintColor="#00C853"
            />
          </View>

          <View style={{ marginTop: 12 }}>
            <Text style={globalStyles.label}>
              Minutos Jogados: {p.minutosJogador}
            </Text>
          </View>

          <TouchableOpacity
            style={{ marginTop: 8 }}
            onPress={() => atualizarStat(p.userId, "vitorias", !p.vitorias)}
          >
            <Text style={[globalStyles.link]}>
              Vitória? {p.vitorias ? "✅ Sim" : "❌ Não"} (toque para alternar)
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        style={[
          globalStyles.button,
          { marginTop: 20 },
          (!mvpId || loading) && globalStyles.buttonDisabled,
        ]}
        onPress={finalizarPartida}
        disabled={!mvpId || loading}
      >
        {loading ? (
          <ActivityIndicator color="#121218" />
        ) : (
          <Text style={globalStyles.buttonText}>✅ Finalizar Partida</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
