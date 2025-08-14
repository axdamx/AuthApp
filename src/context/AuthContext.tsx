import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  User,
  AuthContextType,
  AuthProviderProps,
  StorageKeys,
} from "../types/auth";

// Issue: if we remove all users data, user cant login with the same account
// Ideally in production:
// 1.) You enter credentials (email/password, Google login, etc.).
// 2.) The server verifies and sends back a session object (e.g., access token + refresh token + user data).
// 3.) Your app stores this in AsyncStorage so that if the user closes the app, they remain logged in next time.

// Constants for AsyncStorage keys
const USERS_STORAGE_KEY = StorageKeys.USERS; // array of accounts, acts as a database
const CURRENT_USER_KEY = StorageKeys.CURRENT_USER; // id of current account, acts as a session

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // track startup loading state

  // Restore logged-in user on app start
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        setIsLoading(true);
        const storedUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);
        const currentUserId = await AsyncStorage.getItem(CURRENT_USER_KEY);

        console.log("storedUsers", storedUsers);
        console.log("currentUserId", currentUserId);

        if (storedUsers && currentUserId) {
          const users: User[] = JSON.parse(storedUsers);
          const foundUser = users.find((u) => u.id === currentUserId);
          if (foundUser) {
            setUser(foundUser);
          }
        }
      } catch (error) {
        console.error("Error loading current user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrentUser();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const storedUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      if (!storedUsers) throw new Error("User not found");

      const users: User[] = JSON.parse(storedUsers);
      const foundUser = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!foundUser) throw new Error("Invalid credentials");

      setUser(foundUser);
      await AsyncStorage.setItem(CURRENT_USER_KEY, foundUser.id);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string) => {
    if (!name || !email || !password)
      throw new Error("All fields are required");
    if (!email.includes("@")) throw new Error("Invalid email format");
    if (password.length < 6)
      throw new Error("Password must be at least 6 characters");

    try {
      const storedUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      let users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

      if (users.some((u) => u.email === email)) {
        throw new Error("Email already exists");
      }

      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        password, // ⚠️ plain password only for local demo
      };

      users.push(newUser);
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

      setUser(newUser);
      await AsyncStorage.setItem(CURRENT_USER_KEY, newUser.id);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      // this will remove all users data, so user cant login with the same account
      // await AsyncStorage.removeItem(USERS_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
