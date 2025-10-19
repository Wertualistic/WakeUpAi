import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Vibration,
} from "react-native";
import { Audio } from "expo-av";
import { useNavigation } from "@react-navigation/native";

export const MathProblemScreen = () => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(0);
  const [userInput, setUserInput] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    // Generate a random math problem
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const op = ["+", "-", "×"][Math.floor(Math.random() * 3)];
    let result = op === "+" ? a + b : op === "-" ? a - b : a * b;
    setQuestion(`${a} ${op} ${b}`);
    setAnswer(result);

    // Play sound + vibration
    (async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/alarm.wav"),
        {
          shouldPlay: true,
          isLooping: true,
        }
      );
      await sound.playAsync();
      setSound(sound);
      Vibration.vibrate([500, 500, 500, 500], true);
    })();

    return () => {
      if (sound) sound.unloadAsync();
      Vibration.cancel();
    };
  }, []);

  const checkAnswer = async () => {
    if (parseInt(userInput) === answer) {
      await sound?.stopAsync();
      Vibration.cancel();
      navigation.navigate("Alarm" as never); // Go back to alarm screen
    } else {
      alert("Wrong! Try again 🔁");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Solve to Stop Alarm 🔢</Text>
      <Text style={styles.question}>{question}</Text>
      <TextInput
        value={userInput}
        onChangeText={setUserInput}
        keyboardType="numeric"
        placeholder="Your answer"
        placeholderTextColor="#aaa"
        style={styles.input}
      />
      <TouchableOpacity onPress={checkAnswer} style={styles.button}>
        <Text style={styles.buttonText}>Check</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { color: "#fff", fontSize: 24, marginBottom: 20 },
  question: {
    color: "#e8ff59",
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#2d2d44",
    color: "#fff",
    fontSize: 24,
    padding: 10,
    width: "50%",
    textAlign: "center",
    borderRadius: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#e8ff59",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: { color: "#1a1a2e", fontSize: 20, fontWeight: "700" },
});
