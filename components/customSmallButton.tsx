import { colors } from "@/colors/colors";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type ButtonProps = {
  title: string;
  onPress: () => void;
};
const CustomSmallButton = ({ title, onPress }: ButtonProps) => {
  return (
    <TouchableOpacity style={styles.base} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomSmallButton;
const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.blueLight,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    height: 35,
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.white,
  },
});
