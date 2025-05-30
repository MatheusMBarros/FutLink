import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import FindMatchScreen from "./screens/FindMatchScreen";
import CreateMatchScreen from "./screens/CreateMatchScreen";
import PostMatchScreen from "./screens/PostMatchScreen";
import MatchDetailsScreen from "./screens/MatchDetailsScreen";
import ManageMatch from "./screens/ManageMatchScreen";
import CreatePostScreen from "./screens/CreatePostScreen";
import BottomTabs from "./components/BottomTabNavigator";
import ProfileScreen from "./screens/ProfileScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import UserProfileScreen from "./screens/UserProfileScreen";
import CommentsScreen from "./screens/CommentsScreen";

const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="MainTabs" component={BottomTabs} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Matches" component={FindMatchScreen} />
      <Stack.Screen name="CreateMatch" component={CreateMatchScreen} />
      <Stack.Screen name="PostMatch" component={PostMatchScreen} />
      <Stack.Screen name="Comments" component={CommentsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="MatchDetails" component={MatchDetailsScreen} />
      <Stack.Screen name="ManageMatch" component={ManageMatch} />
      <Stack.Screen
        name="CreatePostScreen"
        component={CreatePostScreen}
        options={{ title: "Nova Postagem" }}
      />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}
