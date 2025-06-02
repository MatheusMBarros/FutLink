// navigation/BottomTabs.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import TeamStackNavigator from "../navigation/TeamStackNavigator"; // 👈 novo import
import FeedScreen from "../screens/FeedScreen";
import FindMatchesScreen from "../screens/FindMatchScreen";
import MyMatchesScreen from "../screens/MyMatchesScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#00e676",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#121212",
          borderTopColor: "#222",
          height: 60,
          paddingBottom: 6,
        },
        tabBarIcon: ({ color }) => {
          const size = 22;
          if (route.name === "Home") {
            return <Ionicons name="home-outline" size={size} color={color} />;
          } else if (route.name === "Feed") {
            return <Ionicons name="reader-outline" size={size} color={color} />;
          } else if (route.name === "Partidas") {
            return <FontAwesome5 name="futbol" size={size} color={color} />;
          } else if (route.name === "Minhas Partidas") {
            return (
              <Ionicons name="calendar-outline" size={size} color={color} />
            );
          } else if (route.name === "Time") {
            return <Ionicons name="people" size={size} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Partidas" component={FindMatchesScreen} />
      <Tab.Screen name="Minhas Partidas" component={MyMatchesScreen} />
      <Tab.Screen name="Time" component={TeamStackNavigator} />
    </Tab.Navigator>
  );
}
