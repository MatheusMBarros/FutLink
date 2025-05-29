import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import { Video } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalStyles } from "../styles/globalStyles";
import axios from "axios";
import { BASE_URL } from "../constants";
import { useNavigation } from "@react-navigation/native";
import BackButton from "../components/BackButton";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";

const { width } = Dimensions.get("window");

const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export default function CreatePostScreen() {
  const [media, setMedia] = useState(null);
  const [content, setContent] = useState("");
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem("user");
        const user = JSON.parse(userJson);
        setUserId(user?._id || user?.id);
      } catch (err) {
        console.warn("Erro ao carregar usuário:", err);
      }
    };
    loadUser();
  }, []);

  const handlePickMedia = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (newStatus !== "granted") {
        Alert.alert(
          "Permissão negada",
          "Permita acesso à galeria nas configurações."
        );
        return;
      }
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setMedia(result.assets[0]);
      }
    } catch (err) {
      console.error("Erro ao abrir galeria:", err);
      Alert.alert("Erro", "Não foi possível abrir a galeria.");
    }
  };

  const handleSubmit = async () => {
    if (!media) return Alert.alert("Selecione uma mídia");
    if (!content) return Alert.alert("Digite algo na legenda");

    try {
      setUploading(true);

      const mimeType =
        media.mimeType ||
        (media.type?.includes("video") ? "video/mp4" : "image/jpeg");

      const ext = media.fileName?.split(".").pop() || mimeType.split("/")[1];
      const fileName = `${generateUUID()}.${ext}`;
      const path = `posts/${fileName}`;

      if (media.fileSize > 50 * 1024 * 1024) {
        Alert.alert("Vídeo muito grande", "Selecione um vídeo de até 50MB.");
        return;
      }

      const response = await fetch(media.uri);
      const blob = await response.blob();

      const fileRef = ref(storage, path);
      await uploadBytes(fileRef, blob);
      const mediaUrl = await getDownloadURL(fileRef);
      const type = media.type?.includes("video") ? "video" : "image";

      const postData = {
        author: userId,
        content,
        mediaUrl,
        type: isVideo ? "video" : "image",
      };

      await axios.post(`${BASE_URL}/api/posts`, postData);
      Alert.alert("Sucesso", "Post publicado com sucesso!");
      navigation.goBack();
    } catch (err) {
      console.error("Erro ao publicar:", err);
      Alert.alert("Erro", err.message || "Não foi possível publicar o post");
    } finally {
      setUploading(false);
    }
  };

  const isVideo = media?.type?.includes("video");

  return (
    <View style={globalStyles.container}>
      <BackButton />

      <TouchableOpacity onPress={handlePickMedia} style={styles.mediaBox}>
        {media ? (
          isVideo ? (
            <Video
              source={{ uri: media.uri }}
              style={styles.media}
              useNativeControls
              resizeMode="contain"
            />
          ) : (
            <Image source={{ uri: media.uri }} style={styles.media} />
          )
        ) : (
          <Text style={globalStyles.link}>Selecionar imagem ou vídeo</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={[globalStyles.input, styles.input]}
        placeholder="Escreva uma legenda..."
        placeholderTextColor="#777"
        multiline
        value={content}
        onChangeText={setContent}
      />

      <TouchableOpacity
        style={[globalStyles.button, uploading && globalStyles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={uploading}
      >
        <Text style={globalStyles.buttonText}>
          {uploading ? "Publicando..." : "Publicar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mediaBox: {
    width: "100%",
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "#1e1e2f",
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  media: {
    width: width - 48,
    height: 220,
    borderRadius: 10,
  },
  input: {
    minHeight: 100,
    textAlignVertical: "top",
  },
});
