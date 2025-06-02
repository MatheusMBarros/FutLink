import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  Platform,
  StyleSheet,
  TouchableOpacity,
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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location"; // Importação adicionada

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

  const [usarTime, setUsarTime] = useState(false);
  const [teamId, setTeamId] = useState("");

  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState("Futebol");
  const [tipos, setTipos] = useState([
    { label: "Futebol", value: "Futebol" },
    { label: "Futsal", value: "Futsal" },
    { label: "Society", value: "Society" },
    { label: "Areia", value: "Areia" },
  ]);

  const [openTipoPartida, setOpenTipoPartida] = useState(false);
  const [tipoPartida, setTipoPartida] = useState("Jogo");
  const [tiposPartida, setTiposPartida] = useState([
    { label: "Jogo", value: "Jogo" },
    { label: "Torneio", value: "Torneio" },
    { label: "Treino", value: "Treino" },
  ]);

  useEffect(() => {
    const loadUserData = async () => {
      const userString = await AsyncStorage.getItem("user");
      const user = JSON.parse(userString);
      if (user) {
        setCriador(user.id);
        try {
          const res = await axios.get(`${BASE_URL}/api/teams/user/${user.id}`);
          if (res.data.length > 0 && usarTime) {
            setTeamId(res.data[0]._id);
          }
        } catch (err) {
          console.error("Erro ao buscar time do usuário:", err);
        }
      }
    };

    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permissão negada",
            "Não foi possível acessar sua localização. Por favor, conceda permissão nas configurações do seu dispositivo."
          );
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
      } catch (error) {
        console.error("Erro ao obter localização:", error);
        Alert.alert(
          "Erro de Localização",
          "Não foi possível obter sua localização atual. Verifique suas configurações de GPS."
        );
      }
    };

    loadUserData();
    getLocation(); // Chama a função para obter a localização ao carregar a tela
  }, [usarTime]); // Adicionado 'usarTime' às dependências para recarregar quando o checkbox é marcado/desmarcado

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
      !criador ||
      !tipoPartida
    ) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

    const [dia, mes, ano] = data.split("/");
    const dateObj = new Date(`${ano}-${mes}-${dia}T12:00:00Z`);
    if (isNaN(dateObj.getTime())) {
      // Use getTime() para verificar se é uma data válida
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
      tipoPartida,
      vagas: Number(vagas),
      finalizada: false,
      criador,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      ...(usarTime && teamId && { timeId: teamId }),
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
        error.response?.data?.message || "Erro desconhecido ao criar partida."
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
      {/* KeyboardAvoidingView não é necessário com KeyboardAwareScrollView no iOS */}
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={globalStyles.container}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true} // Habilita no Android
        extraScrollHeight={Platform.OS === "ios" ? 80 : 20} // Ajuste extra para iOS e Android
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
          multiline={true} // Permite múltiplas linhas para a descrição
          numberOfLines={4} // Número de linhas iniciais
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

        <DropDownPicker
          open={open}
          value={tipo}
          items={tipos}
          setOpen={setOpen}
          setValue={setTipo}
          setItems={setTipos}
          style={globalStyles.input}
          dropDownDirection="TOP"
          dropDownContainerStyle={{
            backgroundColor: "#2C2C3E",
            borderWidth: 0,
            zIndex: 1000, // Z-index para DropDownPicker
          }}
          textStyle={{ color: "#fff" }}
          listItemLabelStyle={{ color: "#fff" }}
          placeholder="Selecione o tipo"
          zIndex={3000} // Z-index para o componente em si
          listMode="SCROLLVIEW" // Melhora o comportamento em ScrollView
        />

        <DropDownPicker
          open={openTipoPartida}
          value={tipoPartida}
          items={tiposPartida}
          setOpen={setOpenTipoPartida}
          setValue={setTipoPartida}
          setItems={setTiposPartida}
          style={[globalStyles.input, { marginTop: open ? 100 : 0 }]} // Adiciona margin top se o picker acima estiver aberto
          dropDownDirection="TOP"
          dropDownContainerStyle={{
            backgroundColor: "#2C2C3E",
            borderWidth: 0,
            zIndex: 900, // Z-index menor que o primeiro picker
          }}
          textStyle={{ color: "#fff" }}
          listItemLabelStyle={{ color: "#fff" }}
          zIndex={2000} // Z-index para o componente em si
          listMode="SCROLLVIEW"
        />

        <TouchableOpacity
          onPress={() => setUsarTime(!usarTime)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
            marginTop: 10, // Adicionado um pequeno espaçamento
          }}
        >
          <Ionicons
            name={usarTime ? "checkbox" : "square-outline"}
            size={24}
            color="#00e676"
          />
          <Text style={{ color: "#fff", marginLeft: 8 }}>
            Deseja convidar os membros do seu time?
          </Text>
        </TouchableOpacity>

        <Text style={globalStyles.label}>
          Toque no mapa para marcar a localização:
        </Text>

        <MapView
          style={styles.map}
          // region para centralizar no marcador se existir, senão na inicial
          region={
            latitude && longitude
              ? {
                  latitude,
                  longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }
              : {
                  latitude: -27.054119, // Latitude inicial padrão (Ibirama, SC)
                  longitude: -49.519172, // Longitude inicial padrão (Ibirama, SC)
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }
          }
          onPress={handleMapPress}
        >
          {latitude && longitude && (
            <Marker coordinate={{ latitude, longitude }}>
              <MaterialIcons
                name="person-pin-circle"
                size={32}
                color="#00e676"
              />
            </Marker>
          )}
        </MapView>

        <SecondaryButton title="Criar Partida" onPress={criarPartida} />
      </KeyboardAwareScrollView>
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
