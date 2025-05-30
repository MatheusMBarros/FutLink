import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import axios from "axios";

import { BASE_URL } from "./constants";
import { registerForPushNotificationsAsync } from "./utils/registerPushToken";
import { navigationRef } from "./navigation/RootNavigation";
import MainStack from "./MainStack";

// Configuração global de notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function AppContent() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        const userJson = await AsyncStorage.getItem("user");

        if (userJson) {
          const parsedUser = JSON.parse(userJson);

          const pushToken = await registerForPushNotificationsAsync();
          if (pushToken && parsedUser._id) {
            await axios.post(`${BASE_URL}/api/device-token`, {
              userId: parsedUser._id,
              token: pushToken,
            });
          }
        }

        setIsAppReady(true);
      } catch (err) {
        console.error("Erro ao iniciar o app:", err);
        setIsAppReady(true);
      }
    };

    initApp();

    const sub = Notifications.addNotificationReceivedListener(
      async (notification) => {
        const newNotification = {
          title: notification.request.content.title,
          body: notification.request.content.body,
          data: notification.request.content.data,
        };

        try {
          const existing = await AsyncStorage.getItem("notifications");
          const list = existing ? JSON.parse(existing) : [];
          list.push(newNotification);
          await AsyncStorage.setItem("notifications", JSON.stringify(list));
        } catch (e) {
          console.error("Erro ao salvar notificação local:", e);
        }
      }
    );

    return () => sub.remove();
  }, []);

  if (!isAppReady) return null;

  return <MainStack />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer ref={navigationRef}>
        <AppContent />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
