import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "../_layout";

interface Alarm {
  id: string;
  label: string;
  time: string;
  period: "AM" | "PM";
  days: boolean[];
  enabled: boolean;
}

const INITIAL_ALARMS: Alarm[] = [];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const AlarmScreen = () => {
  const [alarms, setAlarms] = useState<Alarm[]>(INITIAL_ALARMS);
  const [modalVisible, setModalVisible] = useState(false);
  const [newAlarm, setNewAlarm] = useState({
    label: "",
    time: "8:30",
    period: "AM" as "AM" | "PM",
    days: [true, true, true, true, true, true, true],
  });

  const toggleAlarm = (id: string) => {
    setAlarms(
      alarms.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const toggleDay = (index: number) => {
    const updatedDays = [...newAlarm.days];
    updatedDays[index] = !updatedDays[index];
    setNewAlarm({ ...newAlarm, days: updatedDays });
  };

  const formatDaysDisplay = (days: boolean[]) => {
    const allSelected = days.every((d) => d);
    if (allSelected) return "Everyday";

    const weekdays = [true, true, true, true, true, false, false];
    const isWeekdays = days.every((d, i) => d === weekdays[i]);
    if (isWeekdays) return "Weekdays";

    const weekend = [false, false, false, false, false, true, true];
    const isWeekend = days.every((d, i) => d === weekend[i]);
    if (isWeekend) return "Weekend";

    return DAY_NAMES.filter((_, i) => days[i])
      .map((d) => d.charAt(0))
      .join(" ");
  };

  const addAlarm = async () => {
    await registerForPushNotificationsAsync();
    const alarm: Alarm = {
      id: Date.now().toString(),
      ...newAlarm,
      enabled: true,
    };

    setAlarms([...alarms, alarm]);
    setModalVisible(false);

    const [hour, minute] = newAlarm.time.split(":").map(Number);
    const alarmDate = new Date();
    let hours = (hour % 12) + (newAlarm.period === "PM" ? 12 : 0);
    alarmDate.setHours(hours);
    alarmDate.setMinutes(minute);
    alarmDate.setSeconds(0);

    // if time already passed, set for next day
    if (alarmDate <= new Date()) {
      alarmDate.setDate(alarmDate.getDate() + 1);
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⏰ WAKE UP!",
        body: "Solve the math to stop alarm 🔢",
        sound: "default",
      },
      trigger: {
        date: alarmDate,
        channelId: "alarms",
        repeats: false,
      },
    });

    setNewAlarm({
      label: "",
      time: "8:30",
      period: "AM",
      days: [true, true, true, true, true, true, true],
    });
    Alert.alert("Alarm set for", alarmDate.toLocaleTimeString());
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {alarms.map((alarm) => (
            <View key={alarm.id} style={styles.alarmCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.label}>{alarm.label}</Text>
                <Switch
                  value={alarm.enabled}
                  onValueChange={() => toggleAlarm(alarm.id)}
                  trackColor={{ false: "#3d3d54", true: "#e8ff59" }}
                  thumbColor="#fff"
                  ios_backgroundColor="#3d3d54"
                />
              </View>
              <Text style={styles.time}>
                {alarm.time} <Text style={styles.period}>{alarm.period}</Text>
              </Text>
              <Text style={styles.days}>{formatDaysDisplay(alarm.days)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Alarm</Text>

            <TextInput
              style={styles.input}
              placeholder="Label (e.g., Work)"
              placeholderTextColor="#8888a0"
              value={newAlarm.label}
              onChangeText={(text) => setNewAlarm({ ...newAlarm, label: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Time (e.g., 8:30)"
              placeholderTextColor="#8888a0"
              value={newAlarm.time}
              onChangeText={(text) => setNewAlarm({ ...newAlarm, time: text })}
            />

            <View style={styles.periodSelector}>
              <TouchableOpacity
                style={[
                  styles.periodButton,
                  newAlarm.period === "AM" && styles.periodButtonActive,
                ]}
                onPress={() => setNewAlarm({ ...newAlarm, period: "AM" })}>
                <Text
                  style={[
                    styles.periodButtonText,
                    newAlarm.period === "AM" && styles.periodButtonTextActive,
                  ]}>
                  AM
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.periodButton,
                  newAlarm.period === "PM" && styles.periodButtonActive,
                ]}
                onPress={() => setNewAlarm({ ...newAlarm, period: "PM" })}>
                <Text
                  style={[
                    styles.periodButtonText,
                    newAlarm.period === "PM" && styles.periodButtonTextActive,
                  ]}>
                  PM
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionLabel}>Repeat</Text>
            <View style={styles.daysContainer}>
              {DAY_NAMES.map((day, index) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    newAlarm.days[index] && styles.dayButtonActive,
                  ]}
                  onPress={() => toggleDay(index)}>
                  <Text
                    style={[
                      styles.dayButtonText,
                      newAlarm.days[index] && styles.dayButtonTextActive,
                    ]}>
                    {day.charAt(0)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButton} onPress={addAlarm}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  alarmCard: {
    width: "48%",
    backgroundColor: "#2d2d44",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  time: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 4,
  },
  period: {
    fontSize: 18,
    fontWeight: "400",
  },
  days: {
    color: "#8888a0",
    fontSize: 12,
  },
  fab: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e8ff59",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 32,
    color: "#1a1a2e",
    fontWeight: "300",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#2d2d44",
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#1a1a2e",
    color: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  periodSelector: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  periodButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
  },
  periodButtonActive: {
    backgroundColor: "#e8ff59",
  },
  periodButtonText: {
    color: "#8888a0",
    fontSize: 16,
    fontWeight: "600",
  },
  periodButtonTextActive: {
    color: "#1a1a2e",
  },
  sectionLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1a1a2e",
    justifyContent: "center",
    alignItems: "center",
  },
  dayButtonActive: {
    backgroundColor: "#e8ff59",
  },
  dayButtonText: {
    color: "#8888a0",
    fontSize: 14,
    fontWeight: "600",
  },
  dayButtonTextActive: {
    color: "#1a1a2e",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#3d3d54",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  addButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#e8ff59",
    alignItems: "center",
  },
  addButtonText: {
    color: "#1a1a2e",
    fontSize: 16,
    fontWeight: "600",
  },
});
