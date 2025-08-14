import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  Text,
} from "react-native";
import COLORS from "./colors";

interface InputProps extends TextInputProps {
  iconName: keyof typeof MaterialCommunityIcons.glyphMap; // Restrict to valid MaterialCommunityIcons names
  type?: "text" | "password";
  endLogo?: boolean; // Eye toggle for password
  error?: string;
}

const Input: React.FC<InputProps> = ({
  iconName,
  style,
  type = "text",
  endLogo = false,
  error,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <View style={styles.container}>
        {/* Start icon */}
        <MaterialCommunityIcons
          name={iconName}
          size={20}
          color="#666"
          style={styles.icon}
        />

        {/* Input */}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor="#999"
          secureTextEntry={type === "password" && !showPassword}
          {...rest}
        />

        {/* End icon + text (password toggle) */}
        {endLogo && type === "password" && (
          <TouchableOpacity
            style={styles.toggleContainer}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Entypo
              name={showPassword ? "eye" : "eye-with-line"}
              size={18}
              color="#666"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 15,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  errorText: {
    color: COLORS.red,
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
});
