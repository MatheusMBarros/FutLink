import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  PanResponder,
  Animated,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { BASE_URL } from "../constants";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import BackButton from "../components/BackButton";

export default function CommentsScreen({ route, navigation }) {
  const { postId } = route.params;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const translateY = new Animated.Value(0);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/comment/${postId}`);
      if (response == undefined) {
        setComments([]);
      } else {
        setComments(response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar comentários:", error.message);
    }
  };

  const handleSend = async () => {
    if (!newComment.trim()) return;

    try {
      const user = JSON.parse(await AsyncStorage.getItem("user"));
      await axios.post(`${BASE_URL}/api/comment`, {
        postId,
        userId: user.id,
        content: newComment,
      });
      setNewComment("");
      fetchComments(); // atualiza após enviar
    } catch (error) {
      console.error("Erro ao enviar comentário:", error.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return gestureState.dy > 20;
    },
    onPanResponderMove: (_, gestureState) => {
      translateY.setValue(gestureState.dy);
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 100) {
        navigation.goBack();
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const renderItem = ({ item }) => (
    <View style={styles.comment}>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        <Text style={styles.author}>{item.user?.nome || "Usuário"} </Text>
        <Text style={styles.text}>{item.content}</Text>
      </View>
      <Text style={styles.time}>
        {formatDistanceToNow(new Date(item.createdAt), {
          addSuffix: true,
          locale: ptBR,
        })}
      </Text>
    </View>
  );

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY }] }]}
      {...panResponder.panHandlers}
    >
      <BackButton />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding", android: undefined })}
        keyboardVerticalOffset={90}
      >
        <FlatList
          data={comments}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16 }}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Adicione um comentário..."
            placeholderTextColor="#888"
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Ionicons name="send" size={20} color="#00e676" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    backgroundColor: "#121218",
  },
  comment: {
    marginBottom: 16,
  },
  author: {
    color: "#fff",
    fontWeight: "bold",
  },
  text: {
    color: "#ccc",
  },
  time: {
    color: "#666",
    fontSize: 12,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#2e2e2e",
    backgroundColor: "#1a1a1a",
  },
  input: {
    flex: 1,
    color: "#fff",
    backgroundColor: "#2a2a2a",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
  },
  sendButton: {
    marginLeft: 10,
    justifyContent: "center",
  },
});
