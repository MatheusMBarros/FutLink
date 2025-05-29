import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { globalStyles } from "../styles/globalStyles";
import BackButton from "../components/BackButton";
import { BASE_URL } from "../constants";
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
        Selecione o MVP e registre as estatísticas dos jogadores:
      </Text>

      {playerStats.map((p) => (
        <View key={p.userId} style={[globalStyles.card, styles.playerCard]}>
          <TouchableOpacity
            onPress={() => setMvpId(p.userId)}
            style={[
              styles.playerHeader,
              mvpId === p.userId && styles.mvpHighlight,
            ]}
          >
            <Text
              style={[
                styles.playerName,
                mvpId === p.userId && { color: "#00C853", fontWeight: "bold" },
              ]}
            >
              {p.nome} {mvpId === p.userId ? "(MVP)" : ""}
            </Text>
          </TouchableOpacity>

          <View style={styles.statBlock}>
            <Text style={styles.statLabel}>Gols</Text>
            <View style={styles.counterRow}>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() =>
                  atualizarStat(p.userId, "gols", Math.max(0, p.gols - 1))
                }
              >
                <Text style={styles.counterText}>–</Text>
              </TouchableOpacity>
              <Text style={styles.counterValue}>{p.gols}</Text>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => atualizarStat(p.userId, "gols", p.gols + 1)}
              >
                <Text style={styles.counterText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.statBlock}>
            <Text style={styles.statLabel}>Assistências</Text>
            <View style={styles.counterRow}>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() =>
                  atualizarStat(
                    p.userId,
                    "assistencias",
                    Math.max(0, p.assistencias - 1)
                  )
                }
              >
                <Text style={styles.counterText}>–</Text>
              </TouchableOpacity>
              <Text style={styles.counterValue}>{p.assistencias}</Text>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() =>
                  atualizarStat(p.userId, "assistencias", p.assistencias + 1)
                }
              >
                <Text style={styles.counterText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.minutos}>
            Minutos jogados: {p.minutosJogador}
          </Text>

          <TouchableOpacity
            style={styles.toggleBtn}
            onPress={() => atualizarStat(p.userId, "vitorias", !p.vitorias)}
          >
            <Text style={styles.toggleBtnText}>
              Vitória: {p.vitorias ? "Sim" : "Não"} (toque para alternar)
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
          <Text style={globalStyles.buttonText}>Finalizar Partida</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  playerCard: {
    marginBottom: 25,
    padding: 16,
  },
  playerHeader: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: "#333",
    marginBottom: 10,
  },
  mvpHighlight: {
    borderBottomColor: "#00C853",
  },
  playerName: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
  statBlock: {
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 4,
  },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  counterBtn: {
    backgroundColor: "#00C853",
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  counterText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#121218",
  },
  counterValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    width: 24,
    textAlign: "center",
  },
  minutos: {
    textAlign: "center",
    marginTop: 14,
    fontSize: 14,
    color: "#aaa",
  },
  toggleBtn: {
    marginTop: 8,
    padding: 8,
  },
  toggleBtnText: {
    color: "#00C853",
    textAlign: "center",
    fontSize: 14,
  },
});
