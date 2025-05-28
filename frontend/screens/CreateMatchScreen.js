import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Alert, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { Marker } from "react-native-maps";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";
import BackButton from "../components/BackButton";
import SecondaryButton from "../components/SecondaryButton";
import { globalStyles } from "../styles/globalStyles";
import { BASE_URL } from "../constants";

export default function CreateMatchScreen({ navigation }) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [local, setLocal] = useState("");
  const [cidade, setCidade] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [duracao, setDuracao] = useState(""); // Novo campo
  const [vagas, setVagas] = useState("");
  const [criador, setCriador] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState("Futebol");
  const [tipos] = useState([
    { label: "Futebol", value: "Futebol" },
    { label: "Futsal", value: "Futsal" },
    { label: "Society", value: "Society" },
  ]);

  useEffect(() => {
    const loadUserId = async () => {
      const userString = await AsyncStorage.getItem("user");
      const user = JSON.parse(userString);
      if (user) setCriador(user._id);
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
      !duracao || // Validação adicionada
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
      duracao: Number(duracao), // Adicionado ao payload
      tipo,
      vagas: Number(vagas),
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
    <ScrollView contentContainerStyle={globalStyles.container}>
      <BackButton />
      <Text style={globalStyles.title}>Criar Nova Partida</Text>

      <TextInput
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
        style={globalStyles.input}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        style={globalStyles.input}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Local"
        value={local}
        onChangeText={setLocal}
        style={globalStyles.input}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Cidade"
        value={cidade}
        onChangeText={setCidade}
        style={globalStyles.input}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Data (dd/mm/yyyy)"
        value={data}
        onChangeText={setData}
        style={globalStyles.input}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Horário (ex: 18:30)"
        value={horario}
        onChangeText={setHorario}
        style={globalStyles.input}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Duração (em minutos)"
        value={duracao}
        onChangeText={setDuracao}
        keyboardType="numeric"
        style={globalStyles.input}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Vagas"
        value={vagas}
        onChangeText={setVagas}
        keyboardType="numeric"
        style={globalStyles.input}
        placeholderTextColor="#888"
      />

      <Text style={globalStyles.label}>Tipo</Text>
      <DropDownPicker
        open={open}
        value={tipo}
        items={tipos}
        setOpen={setOpen}
        setValue={setTipo}
        setItems={() => {}}
        style={globalStyles.input}
        dropDownContainerStyle={{ backgroundColor: "#2C2C3E" }}
        textStyle={{ color: "#fff" }}
        placeholder="Selecione o tipo"
        listItemLabelStyle={{ color: "#fff" }}
      />

      <Text style={globalStyles.label}>
        Toque no mapa para marcar a localização:
      </Text>
      <MapView
        style={{ height: 200, borderRadius: 10, marginBottom: 20 }}
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
  );
}
