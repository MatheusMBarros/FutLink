// screens/RegisterScreen.js
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { globalStyles } from "../styles/globalStyles";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import { BASE_URL } from "../constants";

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [posicao, setPosicao] = useState("");
  const [cidade, setCidade] = useState("");
  const [loading, setLoading] = useState(false);
  const range = 5000;
  const handleRegister = async () => {
    if (!nome || !email || !senha) {
      alert("Por favor, preencha os campos obrigatórios: Nome, Email e Senha.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          senha,
          posicao,
          cidade,
          range,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Cadastro realizado com sucesso!");
        navigation.goBack();
      } else {
        alert("Erro no cadastro: " + (data.message || "Tente novamente."));
      }
    } catch (error) {
      alert("Erro na conexão: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={globalStyles.keyboardAvoiding}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={globalStyles.formContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={globalStyles.title}>Cadastre-se no FutLink</Text>

        <InputField
          label="Nome *"
          value={nome}
          onChangeText={setNome}
          placeholder="Seu nome"
          autoCapitalize="words"
        />
        <InputField
          label="Email *"
          value={email}
          onChangeText={setEmail}
          placeholder="seu@email.com"
          keyboardType="email-address"
        />
        <InputField
          label="Senha *"
          value={senha}
          onChangeText={setSenha}
          placeholder="Digite sua senha"
          secureTextEntry
        />
        <InputField
          label="Posição"
          value={posicao}
          onChangeText={setPosicao}
          placeholder="Ex: Atacante"
          autoCapitalize="words"
        />
        <InputField
          label="Cidade"
          value={cidade}
          onChangeText={setCidade}
          placeholder="Sua cidade"
          autoCapitalize="words"
        />

        <PrimaryButton
          title="CADASTRAR"
          onPress={handleRegister}
          loading={loading}
          disabled={loading}
        />

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginTop: 20 }}
          activeOpacity={0.7}
        >
          <Text style={globalStyles.link}>Voltar para Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
