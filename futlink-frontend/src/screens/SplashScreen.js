import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    // Simula carregamento inicial (ex: autenticação)
    const timer = setTimeout(() => {
      navigation.replace('Login'); // Vai para a tela de Login
    }, 2000);

    return () => clearTimeout(timer); // Limpa o timer ao desmontar
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FutLink</Text>
      <ActivityIndicator size="large" color="#00f" />
      </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#222' },
  title: { fontSize: 32, color: '#fff', fontWeight: 'bold', marginBottom: 20 },
});
