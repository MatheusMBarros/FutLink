import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Slider from "@react-native-community/slider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import BackButton from "../components/BackButton";
import StatCard from "../components/StatCard";
import { BASE_URL } from "../constants";
import { globalStyles } from "../styles/globalStyles";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(5000);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setRange(parsedUser.range || 5000);
        }
      } catch (error) {
        console.error("Erro ao carregar usuário do AsyncStorage:", error);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    if (user?._id || user?.id) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const userId = user._id || user.id;
      const res = await fetch(`${BASE_URL}/api/stats/${userId}`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Erro ao buscar estatísticas:", err);
    } finally {
      setLoading(false);
    }
  };

  const salvarRange = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/users/${user._id || user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ range }),
      });

      if (res.ok) {
        const updated = await res.json();
        await AsyncStorage.setItem("user", JSON.stringify(updated));
        setUser(updated); // atualiza user local também
        setRange(updated.range);
        Alert.alert("Sucesso", "Raio de busca atualizado com sucesso!");
      } else {
        Alert.alert("Erro", "Falha ao atualizar o raio.");
      }
    } catch (err) {
      console.error("Erro ao atualizar range:", err);
      Alert.alert("Erro", "Erro de conexão.");
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(["token", "user"]);
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível fazer logout.");
    }
  };

  if (!user) {
    return (
      <View style={[globalStyles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#00C853" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[globalStyles.container, { alignItems: "center" }]}
    >
      <BackButton />
      <Text style={globalStyles.title}>{user?.nome || "Usuário"}</Text>
      <Text style={globalStyles.subtitle}>
        {user?.email || "email@email.com"}
      </Text>

      {loading ? (
        <ActivityIndicator color="#00C853" size="large" />
      ) : stats ? (
        <StatCard stats={stats} />
      ) : (
        <Text style={globalStyles.itemText}>
          Nenhuma estatística encontrada.
        </Text>
      )}

      <Text style={[globalStyles.label, { marginTop: 20 }]}>
        Raio de busca: {range} metros
      </Text>

      <Slider
        style={{ width: "100%", marginVertical: 20 }}
        minimumValue={100}
        maximumValue={10000}
        step={100}
        minimumTrackTintColor="#00e676"
        maximumTrackTintColor="#888"
        thumbTintColor="#00C853"
        value={range}
        onValueChange={(value) => setRange(Math.round(value))}
      />

      <TouchableOpacity style={globalStyles.button} onPress={salvarRange}>
        <Text style={globalStyles.buttonText}>Salvar Raio</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[globalStyles.logoutButton, { marginTop: 20 }]}
        onPress={handleLogout}
      >
        <Text style={globalStyles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
