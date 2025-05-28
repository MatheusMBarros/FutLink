import React, { useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  KeyboardAvoidingView,
  Platform,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import { UserContext } from "../context/UserContext";
import { globalStyles } from "../styles/globalStyles";
import { BASE_URL } from "../constants";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { setUser } = useContext(UserContext);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));

        setUser({
          id: data.user.id,
          nome: data.user.nome,
          email: data.user.email,
          posicao: data.user.posicao,
          cidade: data.user.cidade,
        });

        navigation.replace("MainTabs");
      } else {
        alert("Login falhou: " + data.error);
      }
    } catch (error) {
      alert("Erro na conexão: " + error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Image
        source={require("../assets/LogoBgOff.png")}
        style={globalStyles.logo}
      />

      <Text style={globalStyles.subtitle}>
        Bem-vindo! Faça login para continuar
      </Text>

      <InputField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="seu@email.com"
        keyboardType="email-address"
      />
      <InputField
        label="Senha"
        value={senha}
        onChangeText={setSenha}
        placeholder="Digite sua senha"
        secureTextEntry
      />

      <PrimaryButton title="Entrar" onPress={handleLogin} />

      <TouchableOpacity
        onPress={() => navigation.navigate("Register")}
        style={{ marginTop: 24 }}
        activeOpacity={0.7}
      >
        <Text style={globalStyles.link}>Ainda não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
