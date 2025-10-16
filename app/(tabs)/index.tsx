import { Image, Pressable } from "react-native";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { HelloWave } from "@/components/hello-wave";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Ready to try the camera?</ThemedText>
        <Pressable
          onPress={() => router.push("/camera")}
          style={styles.cameraButton}>
          <ThemedText type="defaultSemiBold" style={styles.cameraButtonText}>
            📷 Open Camera
          </ThemedText>
        </Pressable>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 12,
    marginTop: 20,
  },
  cameraButton: {
    backgroundColor: "#1D3D47",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  cameraButtonText: {
    color: "white",
    fontSize: 16,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
