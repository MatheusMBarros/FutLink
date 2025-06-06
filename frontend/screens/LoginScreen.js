import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  KeyboardAvoidingView,
  Platform,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { BASE_URL } from "../constants";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import { registerForPushNotificationsAsync } from "../utils/registerPushToken";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

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
        const pushToken = await registerForPushNotificationsAsync();
        if (pushToken) {
          await fetch(`${BASE_URL}/api/device-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: data.user.id,
              token: pushToken,
            }),
          });
        }

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
      testID="login_screen"
    >
      <Image
        source={require("../assets/LogoBgOff.png")}
        style={globalStyles.logo}
        testID="logo"
      />

      <Text style={globalStyles.subtitle} testID="subtitle">
        Bem-vindo! Faça login para continuar
      </Text>

      <InputField
        testID="input_email"
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="seu@email.com"
        keyboardType="email-address"
      />
      <InputField
        testID="input_senha"
        label="Senha"
        value={senha}
        onChangeText={setSenha}
        placeholder="Digite sua senha"
        secureTextEntry
      />

      <PrimaryButton testID="btn_entrar" title="Entrar" onPress={handleLogin} />

      <TouchableOpacity
        testID="btn_ir_para_cadastro"
        onPress={() => navigation.navigate("Register")}
        style={{ marginTop: 24 }}
        activeOpacity={0.7}
      >
        <Text style={globalStyles.link}>Ainda não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
