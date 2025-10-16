import React, { useState } from "react";
import { View, Text, Button, Platform, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";

export default function SetAlarmScreen() {
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const router = useRouter();

  const handleChange = (event: any, selectedTime?: Date) => {
    setShowPicker(false);
    if (selectedTime) setTime(selectedTime);
  };

  const scheduleAlarm = async () => {
    const now = new Date();
    const alarmTime = new Date(now);

    // 🕓 set hours & minutes from selected time
    alarmTime.setHours(time.getHours());
    alarmTime.setMinutes(time.getMinutes());
    alarmTime.setSeconds(0);

    // if the chosen time is earlier than now, schedule for tomorrow
    if (alarmTime <= now) {
      alarmTime.setDate(alarmTime.getDate() + 1);
    }

    const diffSeconds = Math.floor(
      (alarmTime.getTime() - now.getTime()) / 1000
    );

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Please allow notifications to use the alarm 🔔");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⏰ Wake Up!",
        body: "Solve the math problem to stop the alarm!",
        sound: "default",
        data: { openMath: true },
      },
      trigger: {
        seconds: diffSeconds, // correct delay
        repeats: false,
      },
    });

    alert(
      `✅ Alarm set for ${alarmTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Your Alarm ⏰</Text>

      <Button title="Choose Time" onPress={() => setShowPicker(true)} />

      {showPicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChange}
        />
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Set Alarm" onPress={scheduleAlarm} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  title: { fontSize: 24, fontWeight: "bold" },
});
