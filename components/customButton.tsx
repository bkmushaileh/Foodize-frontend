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
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: "center",
    width: 280,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
  },
});

export default CustomButton;
