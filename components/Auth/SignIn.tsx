import { signIn } from "@/api/auth";
import AuthContext from "@/app/context/AuthContext";
import { colors } from "@/colors/colors";
import CustomButton from "@/components/customButton";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useContext, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";

const SignInSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const SignInScreen = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const handleError = (error: string) => {
    if (error === "Request failed with status code 401") {
      Alert.alert("Invalid Credentials!");
    }
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["signin"],
    mutationFn: signIn,
    onSuccess: () => {
      setIsAuthenticated(true);
      router.dismissTo("/(tabs)");
    },
    onError: (err: any) => {
      console.log("Error:", err);
      handleError(err?.message || "Unknown error");
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to Sufrah 🍴</Text>
      <Text style={styles.subText}>
        Log in to explore recipes & share your own
      </Text>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={SignInSchema}
        onSubmit={(values) => mutate(values)}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <>
            {/* Email */}
            <TextInput
              placeholder="Email"
              placeholderTextColor={colors.muted}
              style={[
                styles.inputLine,
                touched.email && errors.email && styles.inputLineError,
              ]}
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              returnKeyType="next"
            />
            <Text style={styles.helper}>
              {touched.email && errors.email ? errors.email : " "}
            </Text>
            <View style={styles.passwordField}>
              <TextInput
                placeholder="Password"
                placeholderTextColor={colors.muted}
                style={[
                  styles.inputLine,
                  styles.passwordInput,
                  touched.password && errors.password && styles.inputLineError,
                ]}
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                returnKeyType="done"
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

            <View style={styles.buttonContainer}>
              <CustomButton
                text={isPending ? "Signing In..." : "Sign In"}
                onPress={handleSubmit}
              />
            </View>
          </>
        )}
      </Formik>
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
    backgroundColor: "#fff",
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
