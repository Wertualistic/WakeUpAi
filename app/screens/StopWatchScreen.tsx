import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export const StopwatchScreen = () => {
  const [milliseconds, setMilliseconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  useEffect(() => {
    let interval: number;
    if (isRunning) {
      interval = setInterval(() => {
        setMilliseconds((prev) => prev + 10);
      }, 10) as unknown as number;
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);

    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
      centiseconds: centiseconds.toString().padStart(2, "0"),
    };
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps([milliseconds, ...laps]);
    } else {
      setMilliseconds(0);
      setLaps([]);
    }
  };

  const time = formatTime(milliseconds);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.timeDisplay}>
          <Text style={styles.timeNumber}>
            {time.hours}:{time.minutes}:{time.seconds}
          </Text>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={handleStartStop}>
            <Text style={styles.startButtonText}>
              {isRunning ? "Stop" : "Start"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.lapButton]}
            onPress={handleLap}>
            <Text style={styles.lapButtonText}>
              {isRunning ? "Lap" : "Reset"}
            </Text>
          </TouchableOpacity>
        </View>

        {laps.length > 0 && (
          <ScrollView style={styles.lapsContainer}>
            {laps.map((lap, index) => {
              const lapTime = formatTime(lap);
              return (
                <View key={index} style={styles.lapItem}>
                  <Text style={styles.lapNumber}>
                    Lap {laps.length - index}
                  </Text>
                  <Text style={styles.lapTime}>
                    {lapTime.hours}:{lapTime.minutes}:{lapTime.seconds}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  timeDisplay: {
    marginBottom: 60,
  },
  timeNumber: {
    color: "#fff",
    fontSize: 64,
    fontWeight: "300",
  },
  buttons: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 40,
  },
  button: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
  },
  startButton: {
    backgroundColor: "#e8ff59",
  },
  startButtonText: {
    color: "#1a1a2e",
    fontSize: 18,
    fontWeight: "600",
  },
  lapButton: {
    backgroundColor: "#3d3d54",
  },
  lapButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  lapsContainer: {
    width: "100%",
    maxHeight: 300,
  },
  lapItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#2d2d44",
  },
  lapNumber: {
    color: "#8888a0",
    fontSize: 16,
  },
  lapTime: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
