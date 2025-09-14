import { signUp } from "@/api/auth";
import AuthContext from "@/app/context/AuthContext";
import { colors } from "@/colors/colors";
import CustomButton from "@/components/customButton";
import { UserInfo } from "@/data/userInfo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useHeaderHeight } from "@react-navigation/elements";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useContext, useState } from "react";
import { Alert } from "react-native";

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

const SignupScreen = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    password: " ",
    email: "",
    username: "",
    image: "",
  });

  const headerHeight = useHeaderHeight();
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  const handleError = (error: string) => {
    if (error === "Request failed with status code 400") {
      Alert.alert("Email already exists");
    }
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["signup"],
    mutationFn: signUp,
    onSuccess: () => {
      setIsAuthenticated(true);
      router.dismissTo("/(tabs)");
    },
    onError: (err) => {
      console.log("Error:", err);
      console.log(err.message);
      handleError(err.message);
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const pickImage = async (setFieldValue: any) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.5,
    });

    if (!result.canceled) {
      setFieldValue("image", result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={headerHeight + 8}
      >
        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
            confirmationPassword: "",
            image: "",
          }}
          validationSchema={RegisterSchema}
          onSubmit={(values) => {
            const formData = new FormData();
            formData.append("username", values.username.trim());
            formData.append("email", values.email.trim());
            formData.append("password", values.password);
            formData.append("image", {
              uri: values.image,
              name: "profile.jpg",
              type: "image/jpeg",
            } as any);
            mutate(formData);
          }}
        >
          {({
            handleChange,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
            handleBlur,
          }) => (
            <View style={styles.formWrap}>
              <View style={styles.avatarWrap}>
                <Image
                  source={
                    values.image
                      ? { uri: values.image }
                      : require("@/assets/images/default.png")
                  }
                  style={styles.avatar}
                />
                <TouchableOpacity
                  onPress={() => pickImage(setFieldValue)}
                  style={styles.imagePicked}
                  accessibilityRole="button"
                  accessibilityLabel="Change profile image"
                >
                  <FontAwesome5 name="pen" size={18} color={colors.blueNavy} />
                </TouchableOpacity>
              </View>
              <Text style={styles.helper}>
                {touched.image && errors.image ? errors.image : " "}
              </Text>

              <TextInput
                onChangeText={handleChange("username")}
                onBlur={handleBlur("username")}
                placeholder="Username"
                placeholderTextColor={colors.muted}
                style={[
                  styles.inputLine,
                  touched.username && errors.username && styles.inputLineError,
                ]}
                value={values.username}
                autoCapitalize="none"
                returnKeyType="next"
              />
              <Text style={styles.helper}>
                {touched.username && errors.username ? errors.username : " "}
              </Text>

              <TextInput
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                placeholder="Email"
                placeholderTextColor={colors.muted}
                style={[
                  styles.inputLine,
                  touched.email && errors.email && styles.inputLineError,
                ]}
                value={values.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
              <Text style={styles.helper}>
                {touched.email && errors.email ? errors.email : " "}
              </Text>

              <View style={styles.passwordField}>
                <TextInput
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  placeholder="Password"
                  placeholderTextColor={colors.muted}
                  style={[
                    styles.inputLine,
                    styles.passwordInput,
                    touched.password &&
                      errors.password &&
                      styles.inputLineError,
                  ]}
                  value={values.password}
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
                {touched.password && errors.password ? errors.password : " "}
              </Text>

              <View style={styles.passwordField}>
                <TextInput
                  onChangeText={handleChange("confirmationPassword")}
                  onBlur={handleBlur("confirmationPassword")}
                  placeholder="Confirm Password"
                  placeholderTextColor={colors.muted}
                  style={[
                    styles.inputLine,
                    styles.passwordInput,
                    touched.confirmationPassword &&
                      errors.confirmationPassword &&
                      styles.inputLineError,
                  ]}
                  value={values.confirmationPassword}
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
                {touched.confirmationPassword && errors.confirmationPassword
                  ? errors.confirmationPassword
                  : " "}
              </Text>

              <View style={styles.buttonContainer}>
                <CustomButton
                  text={isPending ? "Signing Up..." : "Sign Up"}
                  onPress={handleSubmit}
                />
              </View>
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;

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
