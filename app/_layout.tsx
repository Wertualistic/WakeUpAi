import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AlarmScreen } from "./screens/AlarmScreen";
import { ClockScreen } from "./screens/ClockScreen";
import { TimerScreen } from "./screens/TimerScreen";
import { StopwatchScreen } from "./screens/StopWatchScreen";
import {
  AlarmIcon,
  ClockIcon,
  TimerIcon,
  StopwatchIcon,
} from "../components/icons";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { MathProblemScreen } from "./screens/MathProblemScreen";

type RootStackParamList = {
  Alarm: undefined;
  Clock: undefined;
  Timer: undefined;
  Stopwatch: undefined;
  MathProblem: undefined;
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// ✅ Notification behavior (fixed)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ✅ Register notifications function
export async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Permission not granted for notifications!");
      return;
    }
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("alarms", {
      name: "Alarms",
      importance: Notifications.AndroidImportance.MAX,
      sound: "default",
      vibrationPattern: [250, 250, 500],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }
}

const Tab = createBottomTabNavigator<RootStackParamList>();

export default function RootLayout() {
  // ✅ Auto-register on app start
  useEffect(() => {
    registerForPushNotificationsAsync();

    const sub = Notifications.addNotificationResponseReceivedListener(() => {
      // When user taps the alarm notification
      navigationRef.current?.navigate("MathProblem");
    });

    return () => sub.remove();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#1a1a2e",
        },
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#1a1a2e",
          borderTopColor: "#2d2d44",
        },
        tabBarActiveTintColor: "#e8ff59",
        tabBarInactiveTintColor: "#8888a0",
      }}>
      <Tab.Screen
        name="Alarm"
        component={AlarmScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AlarmIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Clock"
        component={ClockScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <ClockIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Timer"
        component={TimerScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <TimerIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Stopwatch"
        component={StopwatchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <StopwatchIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="MathProblem"
        component={MathProblemScreen}
        options={{ tabBarButton: () => null }}
      />
    </Tab.Navigator>
  );
}
