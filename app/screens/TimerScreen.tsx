import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export const TimerScreen = () => {
  const [hours, setHours] = useState(2);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);

  useEffect(() => {
    let interval: number;
    if (isRunning && totalSeconds > 0) {
      interval = setInterval(() => {
        setTotalSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, totalSeconds]);

  useEffect(() => {
    if (totalSeconds > 0) {
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;
      setHours(h);
      setMinutes(m);
      setSeconds(s);
    }
  }, [totalSeconds]);

  const handleStart = () => {
    if (!isRunning && totalSeconds === 0) {
      setTotalSeconds(hours * 3600 + minutes * 60 + seconds);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTotalSeconds(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.labels}>
          <Text style={styles.label}>Hours</Text>
          <Text style={styles.label}>Minutes</Text>
          <Text style={styles.label}>Seconds</Text>
        </View>

        <View style={styles.timeDisplay}>
          <Text style={styles.timeNumber}>
            {hours.toString().padStart(2, "0")}
          </Text>
          <Text style={styles.separator}>:</Text>
          <Text style={styles.timeNumber}>
            {minutes.toString().padStart(2, "0")}
          </Text>
          <Text style={styles.separator}>:</Text>
          <Text style={styles.timeNumber}>
            {seconds.toString().padStart(2, "0")}
          </Text>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={handleStart}>
            <Text style={styles.startButtonText}>
              {isRunning ? "Pause" : "Start"}
            </Text>
          </TouchableOpacity>
          {totalSeconds > 0 && (
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={handleReset}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          )}
        </View>
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
  labels: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  label: {
    color: "#8888a0",
    fontSize: 14,
    flex: 1,
    textAlign: "center",
  },
  timeDisplay: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 60,
  },
  timeNumber: {
    color: "#fff",
    fontSize: 64,
    fontWeight: "300",
    width: 120,
    textAlign: "center",
  },
  separator: {
    color: "#fff",
    fontSize: 64,
    fontWeight: "300",
    marginHorizontal: 10,
  },
  buttons: {
    flexDirection: "row",
    gap: 16,
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
  resetButton: {
    backgroundColor: "#3d3d54",
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
