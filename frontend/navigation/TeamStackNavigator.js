// navigation/TeamStackNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TeamScreen from "../screens/TeamScreen";
import JoinOrCreateTeamScreen from "../screens/JoinOrCreateTeamScreen";
import TeamDetailsScreen from "../screens/TeamDetailsScreen";

const Stack = createNativeStackNavigator();

export default function TeamStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TeamScreen" component={TeamScreen} />
      <Stack.Screen
        name="JoinOrCreateTeamScreen"
        component={JoinOrCreateTeamScreen}
      />
      <Stack.Screen name="TeamDetailsScreen" component={TeamDetailsScreen} />
    </Stack.Navigator>
  );
}
