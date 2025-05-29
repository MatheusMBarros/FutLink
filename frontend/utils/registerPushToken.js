import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Permissão para notificações negada!");
      return null;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("Use um dispositivo físico para testar notificações.");
  }

  return token;
}
