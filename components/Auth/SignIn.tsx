import { colors } from "@/colors/colors";
import { SignInUserInfo } from "@/data/userInfo";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import CustomButton from "../customButton";
import CustomTextInput from "../customTextInput";

const SignInScreen = () => {
  const [userInfo, setUserInfo] = useState<SignInUserInfo>({
    username: "",
    password: "",
  });
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to Sufrah 🍴</Text>
      <Text style={styles.subText}>
        Log in to explore recipes & share your own
      </Text>
      <CustomTextInput
        placeholder={"Username"}
        value={userInfo.username}
        onChangeText={(text) => setUserInfo({ ...userInfo, username: text })}
      ></CustomTextInput>
      <CustomTextInput
        placeholder={"Password"}
        value={userInfo.password}
        onChangeText={(text) => setUserInfo({ ...userInfo, password: text })}
      ></CustomTextInput>

      <View style={styles.buttonContainer}>
        <CustomButton text={"Sign In"} onPress={() => {}} />
      </View>
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 11,
    alignItems: "center",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.yellowDark,
    textAlign: "center",
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: colors.muted,
    textAlign: "center",
    marginBottom: 60,
  },
});
