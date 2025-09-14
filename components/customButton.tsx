import { colors } from "@/colors/colors";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type ButtonProps = {
  text: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
};

const CustomButton = ({ text, onPress, variant = "primary" }: ButtonProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        variant === "primary" && {
          backgroundColor: pressed ? colors.yellow : colors.yellowDark,
        },
        variant === "secondary" && {
          backgroundColor: pressed ? colors.blue : colors.blueDark,
        },
        variant === "outline" && {
          backgroundColor: pressed ? colors.blueLight : colors.white,
          borderWidth: 2,
          borderColor: colors.yellow,
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={[styles.text, variant === "outline" && { color: colors.yellow }]}
      >
        {text}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.yellowDark,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    width: 350,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
  },
});

export default CustomButton;
