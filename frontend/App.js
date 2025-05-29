import React, { useEffect, useState, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import axios from "axios";

import { BASE_URL } from "./constants";
import registerForPushNotificationsAsync from "./utils/registerPushToken";
import { navigationRef } from "./navigation/RootNavigation";
import MainStack from "./MainStack";
import { UserProvider, UserContext } from "./context/UserContext";

// Configuração global de notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function AppContent() {
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const initApp = async () => {
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem("user");

      if (userJson) {
        const parsedUser = JSON.parse(userJson);
        setUser(parsedUser);

        const pushToken = await registerForPushNotificationsAsync();
        if (pushToken && parsedUser._id) {
          await axios.post(`${BASE_URL}/api/device-token`, {
            userId: parsedUser._id,
            token: pushToken,
          });
        }
      }

      // Redirecionar para Login ou MainTabs
      setTimeout(() => {
        if (navigationRef.isReady()) {
          navigationRef.current?.reset({
            index: 0,
            routes: [{ name: token ? "MainTabs" : "Login" }],
          });
        }
      }, 100);
    };

    initApp();

    const sub = Notifications.addNotificationReceivedListener(
      async (notification) => {
        const newNotification = {
          title: notification.request.content.title,
          body: notification.request.content.body,
          data: notification.request.content.data,
        };

        console.log("🔔 Notificação recebida:", newNotification);

        const existing = await AsyncStorage.getItem("notifications");
        const list = existing ? JSON.parse(existing) : [];
        list.push(newNotification);
        await AsyncStorage.setItem("notifications", JSON.stringify(list));
      }
    );

    return () => sub.remove();
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
