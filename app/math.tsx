import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
// import { Audio } from "expo-av";
import { useRouter } from "expo-router";

export default function MathScreen() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setQuestion(`${a} + ${b} = ?`);
    setCorrectAnswer(a + b);
  };

  const handleSubmit = async () => {
    if (parseInt(answer) === correctAnswer) {
      Alert.alert("✅ Correct!", "Alarm stopped!");
      router.push("/(tabs)/alarm");
    } else {
      Alert.alert("❌ Wrong answer", "Try again!");
      setAnswer("");
      generateQuestion();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Solve to Stop Alarm</Text>
      <Text style={styles.question}>{question}</Text>
      <TextInput
        style={styles.input}
        value={answer}
        keyboardType="numeric"
        onChangeText={setAnswer}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  question: { fontSize: 26, marginBottom: 20 },
  input: {
    width: "50%",
    borderWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
    fontSize: 20,
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
  },
});
