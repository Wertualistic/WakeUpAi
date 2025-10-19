import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

interface WorldClock {
  city: string;
  timezone: string;
  offset: string;
}

export const ClockScreen = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [worldClocks] = useState<WorldClock[]>([
    { city: "New York", timezone: "America/New_York", offset: "-5h" },
    { city: "Moscow", timezone: "Europe/Moscow", offset: "-3h" },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return {
      time: `${displayHours}:${minutes.toString().padStart(2, "0")}`,
      period,
    };
  };

  const getWorldTime = (timezone: string) => {
    const date = new Date(
      currentTime.toLocaleString("en-US", { timeZone: timezone })
    );
    return formatTime(date);
  };

  const mainTime = formatTime(currentTime);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.mainClock}>
          <Text style={styles.mainTime}>{mainTime.time}</Text>
          <Text style={styles.mainPeriod}>{mainTime.period}</Text>
          <Text style={styles.date}>
            {currentTime.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>

        <View style={styles.worldClocks}>
          {worldClocks.map((clock, index) => {
            const time = getWorldTime(clock.timezone);
            return (
              <View key={index} style={styles.worldClockCard}>
                <View>
                  <Text style={styles.cityName}>{clock.city}</Text>
                  <Text style={styles.offset}>{clock.offset}</Text>
                </View>
                <Text style={styles.worldTime}>
                  {time.time}{" "}
                  <Text style={styles.worldPeriod}>{time.period}</Text>
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
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
  mainClock: {
    alignItems: "center",
    paddingVertical: 60,
  },
  mainTime: {
    color: "#fff",
    fontSize: 72,
    fontWeight: "300",
  },
  mainPeriod: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "300",
  },
  date: {
    color: "#8888a0",
    fontSize: 16,
    marginTop: 8,
  },
  worldClocks: {
    padding: 16,
  },
  worldClockCard: {
    backgroundColor: "#2d2d44",
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cityName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  offset: {
    color: "#8888a0",
    fontSize: 14,
    marginTop: 4,
  },
  worldTime: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "600",
  },
  worldPeriod: {
    fontSize: 16,
    fontWeight: "400",
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
});
