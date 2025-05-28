import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MainStack from "./MainStack";
import { navigationRef } from "./navigation/RootNavigation";
import { UserProvider, UserContext } from "./context/UserContext"; // ajuste o caminho
import { GestureHandlerRootView } from "react-native-gesture-handler";

function AppContent() {
  const { setUser } = React.useContext(UserContext);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem("user");

      if (userJson) {
        const user = JSON.parse(userJson);
        setUser(user);
      }

      setTimeout(() => {
        if (navigationRef.isReady()) {
          navigationRef.current?.reset({
            index: 0,
            routes: [{ name: token ? "MainTabs" : "Login" }],
          });
        }
      }, 100);
    };

    checkAuth();
  }, []);

  return <MainStack />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <NavigationContainer ref={navigationRef}>
          <AppContent />
        </NavigationContainer>
      </UserProvider>
    </GestureHandlerRootView>
  );
}
