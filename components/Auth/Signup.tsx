import signUp from "@/api/auth";
import { colors } from "@/colors/colors";
import CustomButton from "@/components/customButton";
import { UserInfo } from "@/data/userInfo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useHeaderHeight } from "@react-navigation/elements";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image as RNImage } from "react-native";

import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";

const RegisterSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(
      /[@$!%*?&#]/,
      "Password must contain at least one special character"
    ),

  confirmationPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirmation password is required"),
  image: Yup.string().required("Image is required"),
});

const RegisterScreen = () => {
  const defaultImageUri = RNImage.resolveAssetSource(
    require("@/assets/images/default.png")
  ).uri;
  const [userInfo, setUserInfo] = useState<UserInfo>({
    password: "",
    email: "",
    username: "",
    image: defaultImageUri,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [confirmationPassword, setConfirmationPassword] = useState<string>();
  const headerHeight = useHeaderHeight();

  const { mutate, isPending } = useMutation({
    mutationKey: ["signup"],
    mutationFn: signUp,
    onSuccess: () => {
      console.log("Signup successfully!");
      setIsAuthenticated(true);
      router.dismissTo("/(tabs)/recipes");
    },
    onError: (err) => {
      console.log("Error:", err);
    },
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.7,
    });

    if (!result.canceled) {
      setUserInfo((p) => ({ ...p, image: result.assets[0].uri }));
    }
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("username", userInfo.username);
    formData.append("password", userInfo.password);
    formData.append("email", userInfo.email.trim());
    formData.append("image", {
      uri: userInfo.image,
      name: "profile.jpg",
      type: "image/jpeg",
    } as any);
    mutate(formData);
    console.log(userInfo);
    console.log(confirmationPassword);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={headerHeight + 8}
      >
        <View style={styles.formWrap}>
          <View style={styles.avatarWrap}>
            <Image
              source={
                userInfo.image
                  ? { uri: userInfo.image }
                  : require("@/assets/images/default.png")
              }
              style={styles.avatar}
            />
            <TouchableOpacity
              onPress={pickImage}
              style={styles.imagePicked}
              accessibilityRole="button"
              accessibilityLabel="Change profile image"
            >
              <FontAwesome5 name="pen" size={18} color={colors.blueNavy} />
            </TouchableOpacity>
          </View>
          <Text style={styles.helper}>
            {/* {touched.image && errors.image ? errors.image : " "} */}
          </Text>

          <TextInput
            onChangeText={(text) =>
              setUserInfo({ ...userInfo, username: text })
            }
            placeholder="Username"
            placeholderTextColor={colors.muted}
            style={[
              styles.inputLine,
              // touched.username && errors.username && styles.inputLineError,
            ]}
            value={userInfo.username}
            autoCapitalize="none"
            returnKeyType="next"
          />
          <Text style={styles.helper}>
            {/* {touched.username && errors.username ? errors.username : " "} */}
          </Text>

          <TextInput
            onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
            placeholder="Email"
            placeholderTextColor={colors.muted}
            style={[
              styles.inputLine,
              // touched.email && errors.email && styles.inputLineError,
            ]}
            value={userInfo.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
          />
          <Text style={styles.helper}>
            {/* {touched.email && errors.email ? errors.email : " "} */}
          </Text>

          <View style={styles.passwordField}>
            <TextInput
              onChangeText={(text) =>
                setUserInfo({ ...userInfo, password: text })
              }
              placeholder="Password"
              placeholderTextColor={colors.muted}
              style={[
                styles.inputLine,
                styles.passwordInput,
                // touched.password &&
                //   errors.password &&
                //   styles.inputLineError,
              ]}
              value={userInfo.password}
              secureTextEntry={!showPassword}
              returnKeyType="next"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eye}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <FontAwesome5
                name={showPassword ? "eye-slash" : "eye"}
                size={18}
                color={colors.blueNavy}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.helper}>
            {/* {touched.password && errors.password ? errors.password : " "} */}
          </Text>

          <View style={styles.passwordField}>
            <TextInput
              onChangeText={(text) => setConfirmationPassword(text)}
              placeholder="Confirm Password"
              placeholderTextColor={colors.muted}
              style={[
                styles.inputLine,
                styles.passwordInput,
                // touched.confirmationPassword &&
                //   errors.confirmationPassword &&
                //   styles.inputLineError,
              ]}
              value={confirmationPassword}
              secureTextEntry={!showConfirm}
              returnKeyType="done"
            />
            <TouchableOpacity
              onPress={() => setShowConfirm(!showConfirm)}
              style={styles.eye}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <FontAwesome5
                name={showConfirm ? "eye-slash" : "eye"}
                size={18}
                color={colors.blueNavy}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.helper}>
            {/* {touched.confirmationPassword && errors.confirmationPassword
                  ? errors.confirmationPassword
                  : " "} */}
          </Text>

          <View style={styles.buttonContainer}>
            <CustomButton
              text={isPending ? "Signing Up..." : "Sign Up"}
              onPress={handleSubmit}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  formWrap: {
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    paddingBottom: 12,
    color: "#000",
    alignSelf: "flex-start",
  },
  inputLine: {
    borderBottomWidth: 2,
    borderBottomColor: colors.yellow,
    paddingVertical: 10,
    marginBottom: 4,
    fontSize: 16,
    color: "#000",
    width: "100%",
  },
  inputLineError: {
    borderBottomColor: colors.error,
  },
  helper: {
    minHeight: 18,
    lineHeight: 18,
    color: colors.error,
    marginBottom: 8,
    alignSelf: "flex-start",
    fontSize: 13,
  },
  buttonContainer: {
    marginTop: 11,

    alignItems: "center",
  },
  avatarWrap: {
    alignItems: "center",
    marginBottom: 0,
  },
  avatar: {
    height: 170,
    width: 170,
    borderRadius: 90,
    borderWidth: 3,
    borderColor: colors.yellowLight,
  },
  imagePicked: {
    position: "absolute",
    bottom: 4,
    right: "30%",
    backgroundColor: colors.yellowLight,
    borderRadius: 18,
    padding: 8,
    borderWidth: 2,
    borderColor: colors.white,
  },
  passwordField: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    paddingRight: 40,
  },
  eye: {
    position: "absolute",
    right: 0,
    padding: 10,
  },
});
