import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { globalStyles, typography, colors } from '../styles/global';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log(`Login com: ${email}, ${password}`);
    // Lógica de login pode ser adicionada aqui
  };

  return (
    <View style={globalStyles.container}>
      {/* Logo */}
      <Image 
        source={require('../../assets/images/FutLink-Logo.webp')} 
        style={globalStyles.image}
      />

      {/* Título */}
      <Text style={typography.title}>FutLink</Text>

      {/* Campos de entrada */}
      <TextInput
        style={globalStyles.input}
        placeholder="Email"
        placeholderTextColor={colors.textSecondary}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Senha"
        placeholderTextColor={colors.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Botão de login */}
      <TouchableOpacity style={globalStyles.button} onPress={handleLogin}>
        <Text style={globalStyles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      {/* Link para cadastro */}
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={typography.link}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}
