import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Video } from "expo-av";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../constants";

const { width } = Dimensions.get("window");

export default function FeedScreen() {
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const navigation = useNavigation();

  const fetchPosts = async () => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem("user"));
      const response = await axios.get(
        `${BASE_URL}/api/posts?userId=${user.id}`
      );
      setPosts(response.data);

      const likeMap = {};
      const likedMap = {};
      response.data.forEach((post) => {
        likeMap[post._id] = post.likes || 0;
        likedMap[post._id] = false;
      });
      setLikes(likeMap);
      setLikedPosts(likedMap);
    } catch (error) {
      console.error("Erro ao buscar posts:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const handleLike = async (postId) => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem("user"));
      const response = await axios.post(`${BASE_URL}/api/like`, {
        postId,
        userId: user.id,
      });

      const liked = response.data.liked;

      setLikes((prev) => ({
        ...prev,
        [postId]: prev[postId] + (liked ? 1 : -1),
      }));

      setLikedPosts((prev) => ({
        ...prev,
        [postId]: liked,
      }));
    } catch (error) {
      console.error("Erro ao curtir:", error.message);
    }
  };

  const renderItem = ({ item }) => {
    const isVideo = item.type === "video";
    const isExpanded = expandedPostId === item._id;
    const maxLines = isExpanded ? undefined : 3;

    return (
      <View style={styles.post}>
        {/* Cabeçalho */}
        <View style={styles.postHeader}>
          <Text style={styles.username}>{item.author?.nome || "Usuário"}</Text>
        </View>

        {/* Mídia */}
        {item.mediaUrl &&
          (isVideo ? (
            <Video
              key={item._id} // força re-render do componente
              source={{ uri: item.mediaUrl }}
              style={styles.media}
              useNativeControls
              resizeMode="cover"
              isLooping
              shouldPlay={false}
              isMuted={false}
            />
          ) : (
            <Image source={{ uri: item.mediaUrl }} style={styles.media} />
          ))}

        {/* Ações */}
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => handleLike(item._id)}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <AntDesign
              name={likedPosts[item._id] ? "heart" : "hearto"}
              size={22}
              color={likedPosts[item._id] ? "#ff5252" : "#fff"}
            />
            <Text style={styles.likeCount}>{likes[item._id] || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginLeft: 16 }}
            onPress={() =>
              navigation.navigate("Comments", { postId: item._id })
            }
          >
            <Feather name="message-circle" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Legenda */}
        <View style={styles.caption}>
          <Text numberOfLines={maxLines}>
            <Text style={styles.captionAuthor}>
              {item.author?.nome || "Usuário"}{" "}
            </Text>
            <Text style={styles.captionText}>{item.content}</Text>
          </Text>
          {!isExpanded && item.content?.length > 100 && (
            <TouchableOpacity onPress={() => setExpandedPostId(item._id)}>
              <Text style={styles.seeMore}>Ver mais</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00e676" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreatePostScreen")}
      >
        <Ionicons name="add" size={28} color="#121218" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: "#121218",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121218",
  },
  post: {
    marginBottom: 32,
  },
  postHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  username: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  media: {
    width: width,
    height: 300,
    backgroundColor: "#000",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  likeCount: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 4,
  },
  caption: {
    paddingHorizontal: 16,
  },
  captionAuthor: {
    color: "#fff",
    fontWeight: "bold",
  },
  captionText: {
    color: "#ccc",
  },
  seeMore: {
    marginTop: 4,
    color: "#00e676",
    fontSize: 13,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#00e676",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#00e676",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
});
