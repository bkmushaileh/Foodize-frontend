import { colors } from "@/colors/colors";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
};

const CustomTextInput = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
}: Props) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          {
            borderBottomColor: error
              ? colors.error
              : focused
              ? colors.yellowDark
              : colors.yellow,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 18,
    marginTop: 5,
    padding: 3,
  },
  input: {
    borderBottomWidth: 2,
    fontSize: 16,
    paddingVertical: 10,
    color: colors.text,
  },
  error: {
    color: colors.error,
    fontSize: 13,
    marginTop: 4,
  },
});
