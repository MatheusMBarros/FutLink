import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from "react-native";
import Slider from "@react-native-community/slider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import BackButton from "../components/BackButton";
import { BASE_URL } from "../constants";
import { globalStyles } from "../styles/globalStyles";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [posicao, setPosicao] = useState("");
  const [range, setRange] = useState(5000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setNome(parsedUser.nome || "");
          setEmail(parsedUser.email || "");
          setPosicao(parsedUser.posicao || "");
          setRange(parsedUser.range || 5000);
        }
      } catch (error) {
        console.error("Erro ao carregar usuário do AsyncStorage:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const salvarPerfil = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/users/${user._id || user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, posicao, range }),
      });

      if (res.ok) {
        const updated = await res.json();
        await AsyncStorage.setItem("user", JSON.stringify(updated));
        setUser(updated);
        setNome(updated.nome || "");
        setEmail(updated.email || "");
        setPosicao(updated.posicao || "");
        setRange(updated.range);
        Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
        await AsyncStorage.setItem("user", JSON.stringify(updated));
      } else {
        Alert.alert("Erro", "Falha ao atualizar o perfil.");
      }
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
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

  if (loading) {
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

      <Text style={globalStyles.title}>Editar Perfil</Text>

      <Text style={[globalStyles.label, { alignSelf: "flex-start" }]}>
        Nome
      </Text>
      <TextInput
        style={globalStyles.input}
        value={nome}
        onChangeText={setNome}
      />

      <Text style={[globalStyles.label, { alignSelf: "flex-start" }]}>
        Email
      </Text>
      <TextInput
        style={globalStyles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text style={[globalStyles.label, { alignSelf: "flex-start" }]}>
        Posição
      </Text>
      <TextInput
        style={globalStyles.input}
        value={posicao}
        onChangeText={setPosicao}
      />

      <Text style={[globalStyles.label, { marginTop: 20 }]}>
        Raio de busca: {range} metros
      </Text>

      <Slider
        style={{ width: "100%", marginVertical: 20 }}
        minimumValue={100}
        maximumValue={50000}
        step={100}
        minimumTrackTintColor="#00e676"
        maximumTrackTintColor="#888"
        thumbTintColor="#00C853"
        value={range}
        onValueChange={(value) => setRange(Math.round(value))}
      />

      <TouchableOpacity style={globalStyles.button} onPress={salvarPerfil}>
        <Text style={globalStyles.buttonText}>Salvar Perfil</Text>
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
