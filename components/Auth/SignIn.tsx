import { signIn } from "@/api/auth";
import AuthContext from "@/app/context/AuthContext";
import { colors } from "@/colors/colors";
import { SignInUserInfo } from "@/data/userInfo";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useContext, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import * as Yup from "yup";
import CustomButton from "../customButton";
import CustomTextInput from "../customTextInput";

const SignInSchema = Yup.object().shape({
  email: Yup.string().required("Email is required"),
  password: Yup.string().required("Password is required"),
});
const SignInScreen = () => {
  const [userInfo, setUserInfo] = useState<SignInUserInfo>({
    email: "",
    password: "",
  });
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const handleError = (error: string) => {
    if (error == "Request failed with status code 401") {
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
    onError: (err) => {
      console.log("Error:", err);
      handleError(err?.message || "Unknown error");
    },
  });

  const handleSubmit = () => {
    mutate(userInfo);
  };
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
            <CustomTextInput
              placeholder="Email"
              value={values.email}
              onChangeText={handleChange("email")}
              secureTextEntry={false}
              error={touched.email ? errors.email : undefined}
            />
            <CustomTextInput
              placeholder="Password"
              value={values.password}
              onChangeText={handleChange("password")}
              secureTextEntry
              error={touched.password ? errors.password : undefined}
            />

            <View style={styles.buttonContainer}>
              <CustomButton
                text={isPending ? "Signing In..." : "Sign In"}
                onPress={handleSubmit as any}
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
});
