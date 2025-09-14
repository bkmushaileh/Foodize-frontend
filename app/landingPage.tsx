import { colors } from "@/colors/colors";
import CustomButton from "@/components/customButton";
import { Redirect, router } from "expo-router";
import React, { useContext } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AuthContext from "./context/AuthContext";

export default function Index() {
  const { isAuthenticated } = useContext(AuthContext);
  if (isAuthenticated) return <Redirect href="/(tabs)" />;

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        resizeMode="contain"
        accessible
        accessibilityLabel="Sufrah logo"
        source={require("../assets/images/Sufrah1-removebg-preview.png")}
      />

      <View style={styles.buttonContainer}>
        <CustomButton
          text="Sign Up"
          onPress={() => {
            router.push("/auth/signup");
          }}
          variant="primary"
        />

        <CustomButton
          text="Sign In"
          onPress={() => {
            router.push("/auth/signIn");
          }}
          variant="outline"
        />
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.guest}>Continue as guest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bg,
  },
  image: {
    height: 300,
    width: 300,
    marginBottom: 50,
  },
  buttonContainer: {
    gap: 14,
    alignItems: "center",
  },
  guest: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    color: colors.yellowDark,
    textDecorationLine: "underline",
  },
});
