import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormData, signupSchema } from "../validation/signUpSchema";
import COLORS from "../components/colors";

const SignupScreen = () => {
  const { signup } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      await signup(data.name, data.email, data.password);
      Alert.alert("Success", "Account created successfully!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create account");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <View style={styles.inputContainer}>
        {/* Name */}
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <>
              <Input
                iconName="account"
                placeholder="Name"
                value={value}
                onChangeText={onChange}
                autoCapitalize="words"
                error={errors.name?.message}
              />
            </>
          )}
        />

        {/* Email */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <>
              <Input
                iconName="email"
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email?.message}
              />
            </>
          )}
        />

        {/* Password */}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <>
              <Input
                iconName="lock"
                placeholder="Password"
                value={value}
                onChangeText={onChange}
                type="password"
                endLogo={true}
                autoCapitalize="none"
                error={errors.password?.message}
              />
            </>
          )}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? "Signing Up..." : "Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: COLORS.black,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  errorText: {
    color: COLORS.red,
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  button: {
    backgroundColor: COLORS.blue,
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  loginButton: {
    marginTop: 15,
  },
  loginText: {
    color: COLORS.blue,
    fontSize: 14,
  },
});

export default SignupScreen;
