import signUp from "@/api/auth";
import AuthContext from "@/app/context/AuthContext";
import { colors } from "@/colors/colors";
import { UserInfo } from "@/data/userInfo";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useContext, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomButton from "../customButton";
import CustomTextInput from "../customTextInput";

const Signup = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: " ",
    password: " ",
    image: " ",
    email: "",
  });
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [confirmationPassword, setConfirmationPassword] = useState("");

  const [image, setImage] = useState<string | null>(null);
  const { mutate } = useMutation({
    mutationKey: ["SignUp"],
    mutationFn: signUp,
    onSuccess: () => {
      setIsAuthenticated(true);
      router.dismissTo("/(tabs)");
    },
    onError: (err) => {
      console.log("Error:", err);
    },
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const handleSignup = () => {
    if (userInfo.password != confirmationPassword) {
      return console.log("NOT EQUAAAL");
    }
    const formData = new FormData();
    formData.append("username", userInfo.username);
    formData.append("password", userInfo.password);
    formData.append("image", userInfo.image);
    formData.append("email", userInfo.email);
    mutate(formData);
  };
  return (
    <KeyboardAvoidingView
      style={styles.container1}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <TouchableOpacity onPress={pickImage}>
        <Text style={styles.text}>Pick an image</Text>
      </TouchableOpacity>
      <View style={styles.form}>
        <CustomTextInput
          placeholder="Username"
          value={userInfo.username}
          onChangeText={(text) =>
            setUserInfo((p) => ({ ...p, username: text }))
          }
          error={!userInfo.username ? "Username is required" : undefined}
        />
        <CustomTextInput
          placeholder="Email"
          value={userInfo.email}
          onChangeText={(text) => setUserInfo((p) => ({ ...p, email: text }))}
          error={!userInfo.email ? "Email is required" : undefined}
        />
        <CustomTextInput
          placeholder="Password"
          value={userInfo.password}
          onChangeText={(text) =>
            setUserInfo((p) => ({ ...p, password: text }))
          }
          error={!userInfo.password ? "Password is required" : undefined}
          secureTextEntry={true}
        />
        <CustomTextInput
          placeholder="Confirmation Password"
          value={confirmationPassword}
          onChangeText={setConfirmationPassword}
          error={
            !confirmationPassword
              ? "Confirmation Password is required"
              : undefined
          }
          secureTextEntry={true}
        />
        <View style={styles.buttonContainer}>
          <CustomButton
            text={"Sign Up"}
            onPress={() => {
              handleSignup;
            }}
          ></CustomButton>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: { alignItems: "center", justifyContent: "center" },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: 180,
    width: 180,
    resizeMode: "cover",
    backgroundColor: colors.muted,
    borderWidth: 2,
    borderRadius: 90,
    borderColor: colors.yellowLight,
  },
  form: {
    width: "90%",
  },
  text: {
    fontSize: 16,
    color: colors.muted,
    padding: 10,
    marginBottom: 30,
  },
});
function setIsAuthenticated(arg0: boolean) {
  throw new Error("Function not implemented.");
}
