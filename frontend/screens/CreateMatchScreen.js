import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { Marker } from "react-native-maps";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";
import { TextInputMask } from "react-native-masked-text";
import BackButton from "../components/BackButton";
import SecondaryButton from "../components/SecondaryButton";
import { globalStyles } from "../styles/globalStyles";
import { BASE_URL } from "../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

export default function CreateMatchScreen({ navigation }) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [local, setLocal] = useState("");
  const [cidade, setCidade] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [duracao, setDuracao] = useState("");
  const [vagas, setVagas] = useState("");
  const [criador, setCriador] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState("Futebol");
  const [tipos, setTipos] = useState([
    { label: "Futebol", value: "Futebol" },
    { label: "Futsal", value: "Futsal" },
    { label: "Society", value: "Society" },
  ]);

  useEffect(() => {
    const loadUserId = async () => {
      const userString = await AsyncStorage.getItem("user");
      const user = JSON.parse(userString);
      if (user) setCriador(user.id);
    };
    loadUserId();
  }, []);

  const criarPartida = async () => {
    if (
      !titulo ||
      !local ||
      !cidade ||
      !data ||
      !horario ||
      !duracao ||
      !latitude ||
      !longitude ||
      !criador
    ) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

    const [dia, mes, ano] = data.split("/");
    const dateObj = new Date(`${ano}-${mes}-${dia}T12:00:00Z`);
    if (isNaN(dateObj)) {
      Alert.alert("Erro", "Data inválida. Use o formato dd/mm/yyyy");
      return;
    }

    const matchData = {
      titulo,
      descricao,
      local,
      cidade,
      data: dateObj.toISOString(),
      horario,
      duracao: Number(duracao),
      tipo,
      vagas: Number(vagas),
      finalizada: false,
      criador,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
    };

    try {
      await axios.post(`${BASE_URL}/api/matches`, matchData);
      Alert.alert("Sucesso", "Partida criada com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error(
        "Erro ao criar partida:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Erro desconhecido."
      );
    }
  };

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLatitude(latitude);
    setLongitude(longitude);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          contentContainerStyle={globalStyles.container}
          keyboardShouldPersistTaps="handled"
        >
          <BackButton />
          <Text style={globalStyles.title}>Criar Nova Partida</Text>

          <TextInputMask
            type={"custom"}
            options={{ mask: "************************" }}
            value={titulo}
            onChangeText={setTitulo}
            style={globalStyles.input}
            placeholder="Título"
            placeholderTextColor="#888"
          />

          <TextInputMask
            type={"custom"}
            options={{
              mask: "********************************************************************",
            }}
            value={descricao}
            onChangeText={setDescricao}
            style={globalStyles.input}
            placeholder="Descrição"
            placeholderTextColor="#888"
          />

          <TextInputMask
            type={"custom"}
            options={{ mask: "************************" }}
            value={local}
            onChangeText={setLocal}
            style={globalStyles.input}
            placeholder="Local"
            placeholderTextColor="#888"
          />

          <TextInputMask
            type={"custom"}
            options={{ mask: "************************" }}
            value={cidade}
            onChangeText={setCidade}
            style={globalStyles.input}
            placeholder="Cidade"
            placeholderTextColor="#888"
          />

          <TextInputMask
            type={"datetime"}
            options={{ format: "DD/MM/YYYY" }}
            value={data}
            onChangeText={setData}
            style={globalStyles.input}
            placeholder="Data (dd/mm/yyyy)"
            keyboardType="numeric"
            placeholderTextColor="#888"
          />

          <TextInputMask
            type={"datetime"}
            options={{ format: "HH:mm" }}
            value={horario}
            onChangeText={setHorario}
            style={globalStyles.input}
            placeholder="Horário (ex: 18:30)"
            keyboardType="numeric"
            placeholderTextColor="#888"
          />

          <TextInputMask
            type={"only-numbers"}
            value={duracao}
            onChangeText={setDuracao}
            style={globalStyles.input}
            placeholder="Duração (em minutos)"
            keyboardType="numeric"
            placeholderTextColor="#888"
          />

          <TextInputMask
            type={"only-numbers"}
            value={vagas}
            onChangeText={setVagas}
            style={globalStyles.input}
            placeholder="Vagas"
            keyboardType="numeric"
            placeholderTextColor="#888"
          />

          <View style={{ zIndex: 1000 }}>
            <Text style={globalStyles.label}>Tipo</Text>
            <DropDownPicker
              open={open}
              value={tipo}
              items={tipos}
              setOpen={setOpen}
              setValue={setTipo}
              setItems={setTipos}
              style={globalStyles.input}
              dropDownContainerStyle={{
                backgroundColor: "#2C2C3E",
                borderWidth: 0,
              }}
              textStyle={{ color: "#fff" }}
              listItemLabelStyle={{ color: "#fff" }}
              placeholder="Selecione o tipo"
            />
          </View>

          <Text style={globalStyles.label}>
            Toque no mapa para marcar a localização:
          </Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: -27.054119,
              longitude: -49.519172,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onPress={handleMapPress}
          >
            {latitude && longitude && (
              <Marker coordinate={{ latitude, longitude }} />
            )}
          </MapView>

          <SecondaryButton title="Criar Partida" onPress={criarPartida} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
});
