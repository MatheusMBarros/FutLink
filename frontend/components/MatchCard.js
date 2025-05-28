import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import {
  Feather,
  Entypo,
  Ionicons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import { globalStyles } from "../styles/globalStyles";

const MatchCard = ({ match, userLocation, onPress }) => {
  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const toRad = (valor) => (valor * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const formatarDistancia = (distancia) => {
    if (distancia < 1) return `${Math.round(distancia * 1000)} m`;
    return `${distancia.toFixed(1)} km`;
  };

  const longitudePartida = match.location?.coordinates[0];
  const latitudePartida = match.location?.coordinates[1];

  const distancia =
    userLocation && latitudePartida && longitudePartida
      ? calcularDistancia(
          userLocation.latitude,
          userLocation.longitude,
          latitudePartida,
          longitudePartida
        )
      : null;

  const dataObj = new Date(match.data);
  const dataFormatada = dataObj.toLocaleDateString("pt-BR");
  const horarioFormatado =
    match.horario ||
    dataObj.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const isFinalizada = match.finalizada;
  return (
    <TouchableOpacity
      style={[
        globalStyles.card,
        { paddingBottom: 12, opacity: isFinalizada ? 0.6 : 1 },
      ]}
      activeOpacity={0.9}
      onPress={onPress}
    >
      {/* Badge de finalizada */}
      {isFinalizada && (
        <View
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "#EF5350",
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 8,
            zIndex: 1,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 12 }}>
            FINALIZADA
          </Text>
        </View>
      )}

      <Text style={globalStyles.cardTitle}>{match.titulo}</Text>

      {/* Local e Cidade */}
      <View style={[globalStyles.row, { marginTop: 6 }]}>
        <Entypo name="location-pin" size={16} color="#00C853" />
        <Text style={globalStyles.itemText}>
          {" "}
          {match.local} - {match.cidade}
        </Text>
      </View>

      {/* Tipo + Duração */}
      <View style={[globalStyles.row, { marginTop: 4 }]}>
        <Feather name="map" size={16} color="#00C853" />
        <Text style={globalStyles.itemText}> {match.tipo}</Text>
        <MaterialIcons
          name="timer"
          size={16}
          color="#00C853"
          style={{ marginLeft: 12 }}
        />
        <Text style={globalStyles.itemText}> {match.duracao} min</Text>
      </View>

      {/* Data + Horário */}
      <View style={[globalStyles.row, { marginTop: 4 }]}>
        <Feather name="calendar" size={16} color="#00C853" />
        <Text style={globalStyles.itemText}> {dataFormatada}</Text>
        <Feather
          name="clock"
          size={16}
          color="#00C853"
          style={{ marginLeft: 12 }}
        />
        <Text style={globalStyles.itemText}> {horarioFormatado}</Text>
      </View>

      {/* Distância */}
      <View style={[globalStyles.row, { marginTop: 4 }]}>
        <Ionicons name="location-sharp" size={16} color="#00C853" />
        <Text style={globalStyles.itemText}>
          {" "}
          {distancia !== null
            ? formatarDistancia(distancia)
            : "Distância desconhecida"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default MatchCard;
