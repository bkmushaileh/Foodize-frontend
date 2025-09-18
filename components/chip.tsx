import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type ChipProps = {
  selected: boolean;
  label: string;
  onPress: () => void;
};

export default function Chip({ selected, label, onPress }: ChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
      activeOpacity={0.7}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: "#eef1f7",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    margin: 4,
  },
  chipSelected: {
    backgroundColor: "#dadff0",
  },
  chipText: {
    color: "#2e3646",
    fontWeight: "600",
  },
  chipTextSelected: {
    color: "#1f2533",
  },
});
