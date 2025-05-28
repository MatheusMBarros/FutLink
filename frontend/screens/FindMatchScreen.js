// screens/FindMatchesScreen.js
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import MatchCard from "../components/MatchCard";
import { BASE_URL } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage"; // adicione

export default function FindMatchesScreen({ navigation }) {
  const [partidas, setPartidas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const buscarPartidas = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "Permita o acesso à localização.");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const userString = await AsyncStorage.getItem("user");
      const user = JSON.parse(userString);
      const range = user?.range || 5000;

      const response = await axios.get(`${BASE_URL}/api/matches/nearby`, {
        params: {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
          dist: range,
        },
      });

      setPartidas(response.data);
    } catch (error) {
      console.error("Erro ao buscar partidas:", error.message);
      Alert.alert("Erro", "Não foi possível buscar partidas.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      buscarPartidas();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Partidas Próximas</Text>

      <FlatList
        data={partidas}
        keyExtractor={(item) => item._id}
        style={{ marginTop: 24 }}
        refreshing={loading}
        onRefresh={buscarPartidas}
        ListHeaderComponent={
          loading ? (
            <ActivityIndicator
              size="large"
              color="#00C853"
              style={{ marginVertical: 20 }}
            />
          ) : null
        }
        renderItem={({ item }) => (
          <MatchCard
            match={item}
            userLocation={userLocation}
            onPress={() => navigation.navigate("MatchDetails", { match: item })}
          />
        )}
        ListEmptyComponent={
          !loading && (
            <Text style={styles.emptyText}>Nenhuma partida encontrada.</Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121218",
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#00C853",
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 1,
    textShadowColor: "#00C85355",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  emptyText: {
    color: "#ccc",
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
  },
});
