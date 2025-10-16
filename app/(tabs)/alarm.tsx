import React, { useEffect, useState, useRef } from "react";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";
import { Audio } from "expo-av";

export default function AlarmScreen() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [problem, setProblem] = useState({ a: 0, b: 0 });
  const [answer, setAnswer] = useState("");
  const [isSolved, setIsSolved] = useState(false);

  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    generateProblem();
    playSound();

    return () => {
      stopSound(); // cleanup when leaving screen
    };
  }, []);

  async function playSound() {
    console.log("🔊 Loading sound...");
    const { sound } = await Audio.Sound.createAsync(
      require("@/assets/alarm.wav"), // make sure you have an alarm.mp3 inside assets
      { shouldPlay: true, isLooping: true }
    );
    soundRef.current = sound;
    setSound(sound);
  }

  async function stopSound() {
    if (soundRef.current) {
      console.log("🛑 Stopping sound...");
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  }

  function generateProblem() {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setProblem({ a, b });
  }

  async function checkAnswer() {
    if (parseInt(answer) === problem.a + problem.b) {
      setIsSolved(true);
      await stopSound();
    } else {
      alert("❌ Wrong! Try again.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wake Up Alarm ⏰</Text>
      <Text style={styles.problem}>
        {problem.a} + {problem.b} = ?
      </Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={answer}
        onChangeText={setAnswer}
        placeholder="Your answer"
      />
      <Button title="Check" onPress={checkAnswer} />
      <View style={{ marginTop: 20 }}>
        <Button title="Stop Sound" onPress={stopSound} />
      </View>
      {isSolved && <Text style={styles.success}>✅ Alarm stopped!</Text>}
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
  problem: { fontSize: 22 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    width: 120,
    textAlign: "center",
  },
  success: { color: "green", fontSize: 18, marginTop: 10 },
});
